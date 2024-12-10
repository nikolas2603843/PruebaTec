import { Component, OnInit, OnDestroy } from '@angular/core';
import { ListsService } from '../../service/lists.service';
import { Subscription, debounceTime } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlbumService } from 'src/app/PruebaTec/service/album.service';
import { MessageService } from 'primeng/api';



@Component({
    templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit, OnDestroy {

    subscription!: Subscription;

    isNewAlbum = false;

    generos = [];

    disqueras = [];

    formNewAlbum: FormGroup;
    formNewCommet: FormGroup;
    formUpdateAlbum: FormGroup;

    albums = [];

    responsiveOptions = [];

    isNewComment = false;
    isViewAlbum = false;

    comentariosSeleccionados
    albumSeleccionado
    cancionesAlbumSeleccionado = [];
    albumSeleccionadoEdicion



    constructor(private listsService: ListsService,
        private messageService: MessageService,
        private albumService: AlbumService,
        private formBuilder: FormBuilder,
        public layoutService: LayoutService) {
        this.subscription = this.layoutService.configUpdate$
            .pipe(debounceTime(25))
            .subscribe((config) => {

            });
    }
    cargarDatos(album) {
        
        this.formUpdateAlbum.get('nombre').setValue(album.name)
        this.formUpdateAlbum.get('fecha').setValue(new Date(album.releaseDate))
        this.formUpdateAlbum.get('genero').setValue(this.generos.find(element => element.name == album.genre))
        this.formUpdateAlbum.get('disquera').setValue(this.disqueras.find(element => element.name == album.recordLabel))
        this.formUpdateAlbum.get('descripcion').setValue(album.description)
        this.formUpdateAlbum.get('cubierta').setValue(album.cover)
        this.isViewAlbum = !this.isViewAlbum;
        this.albumSeleccionadoEdicion = album;
        this.cancionesAlbumSeleccionado = album.tracks;
    }
    initializeForm(): void {
        this.formNewCommet = this.formBuilder.group({
            rating: [1, [Validators.required]],
            description: ['']

        })
        this.formUpdateAlbum = this.formBuilder.group({
            nombre: ['', [Validators.required]],
            fecha: ['', Validators.required],
            genero: ['', Validators.required],
            disquera: ['', Validators.required],
            descripcion: ['', Validators.required],
            cubierta: ['', Validators.required],

        })
        this.formNewAlbum = this.formBuilder.group({
            nombre: ['', [Validators.required]],
            fecha: ['', Validators.required],
            genero: ['', Validators.required],
            disquera: ['', Validators.required],
            descripcion: ['', Validators.required],
            cubierta: ['', Validators.required],
        });
    }

    updateAlbum() {
        
        if (this.formUpdateAlbum.valid) {
            const {
                nombre,
                fecha,
                genero,
                disquera,
                descripcion,
                cubierta,
            } = this.formUpdateAlbum.value;

            const payload = {
                name: nombre,
                cover: cubierta,
                releaseDate: fecha.toISOString().replace('Z', '-05:00'),
                description: descripcion,
                genre: genero.name,
                recordLabel: disquera.name
            }

            this.albumService.updateAlbum(this.albumSeleccionadoEdicion.id, payload).subscribe({
                next: () => {
                    this.messageService.add({
                        severity: 'success', summary: 'Actualizado corretamente'
                    });
                    this.isViewAlbum = false;
                    this.formUpdateAlbum.reset();
                    this.consultarAlbums();
                },
                error: err => {
                    console.error(err);
                    this.messageService.add({
                        severity: 'error', summary: 'Surgio un error comunicate con soporte'
                    });

                }
            })
        } else {
            const campos = this.formCamposInvalidosUpdate();
            this.messageService.clear();
            this.messageService.add({ severity: 'error', summary: 'Parece que te falta llenar campos ', detail: `${campos}` });
        }
    }

    registerComment() {
        if (this.formNewCommet.valid) {

            this.comentariosSeleccionados
            const { description, rating } = this.formNewCommet.value;
            this.albumService.newComment(this.albumSeleccionado.id, { description, rating, collector: { id: 1 } }).subscribe({
                next: () => {
                    this.messageService.add({
                        severity: 'success', summary: 'Comentario agregado'
                    });
                    this.isNewComment = false;
                    this.formNewCommet.reset();
                    this.consultarAlbums()
                },
                error: err => {
                    console.error(err);
                    this.messageService.add({
                        severity: 'error', summary: 'Surgio un error en el servicio', detail: 'Comunicate con soporte'
                    });

                }
            })

        } else {
            this.messageService.add({
                severity: 'error', summary: 'Tienes que almenos seleccionar una calificacion'
            });
        }
    }

    ngOnInit() {
        this.initializeForm();
        this.consultarAlbums();
        this.listsService.getGeneros().then(data => this.generos = data);
        this.listsService.getDisqueras().then(data => this.disqueras = data);
        this.responsiveOptions = [
            {
                breakpoint: '1199px',
                numVisible: 1,
                numScroll: 1
            },
            {
                breakpoint: '991px',
                numVisible: 1,
                numScroll: 1
            },
            {
                breakpoint: '767px',
                numVisible: 1,
                numScroll: 1
            }
        ];
    }

    getSeverity(status: string) {

        switch (status) {
            case 'Sony Music':
                return 'success';
            case 'Discos Fuentes':
                return 'warning';
            case 'Elektra':
                return 'danger';
            case 'Fania Records':
                return 'danger';
            default:
                return 'success'
        }
    }

    consultarAlbums() {
        this.albumService.albums().subscribe({
            next: response => {
                this.albums = response
            },
            error: err => {
                console.error(err);
                this.messageService.add({
                    severity: 'error', summary: 'Surgio un error',
                    detail: 'Al consultar la lista de albums surgio un error en el servicio comunicate con soporte'
                });
            }
        })
    }




    formCamposInvalidos() {
        const invalidFields: string[] = [];
        Object.keys(this.formNewAlbum.controls).forEach(field => {
            const control = this.formNewAlbum.get(field);
            if (control && control.invalid) {
                invalidFields.push(field);
            }
        });
        return invalidFields.join(', ');
    }
    formCamposInvalidosUpdate() {
        const invalidFields: string[] = [];
        Object.keys(this.formUpdateAlbum.controls).forEach(field => {
            const control = this.formUpdateAlbum.get(field);
            if (control && control.invalid) {
                invalidFields.push(field);
            }
        });
        return invalidFields.join(', ');
    }

    deleteAlbum() {
        this.albumService.deleteAlbum(this.albumSeleccionadoEdicion.id).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success', summary: 'liminado correctamente'
                });

                this.isViewAlbum = false;
                this.consultarAlbums()
            }, error: err => {
                console.error(err);
                this.messageService.add({
                    severity: 'error', summary: 'Surgio un error',
                    detail: 'Al eliminar el album surgio un error en el servicio comunicate con soporte'
                });
            }
        })
    }


    registerAlbum() {

        if (this.formNewAlbum.valid) {
            const {
                nombre,
                fecha,
                genero,
                disquera,
                descripcion,
                cubierta,
            } = this.formNewAlbum.value;

            const data = {
                name: nombre,
                cover: cubierta,
                releaseDate: fecha.toISOString().replace('Z', '-05:00'),
                description: descripcion,
                genre: genero.name,
                recordLabel: disquera.name
            }

            this.albumService.newAlbum(data).subscribe({
                next: () => {
                    this.messageService.add({ severity: 'success', summary: 'Creado correctamente' });
                    this.formNewAlbum.reset();
                    setTimeout(() => {
                        this.isNewAlbum = false
                        this.consultarAlbums();
                    }, 1000);
                },
                error: e => {

                }
            })
        } else {
            const campos = this.formCamposInvalidos();
            this.messageService.clear();
            this.messageService.add({ severity: 'error', summary: 'Parece que te falta llenar campos ', detail: `${campos}` });
        }
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
