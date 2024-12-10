import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AlbumService } from 'src/app/PruebaTec/service/album.service';
import { ListsService } from '../../service/lists.service';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';

// Mocks de servicios
class MockAlbumService {
  albums() {
    return of([]); // Simula una respuesta vacía de los albums
  }

  newAlbum(data: any) {
    return of(data); // Simula la creación de un nuevo álbum
  }

  updateAlbum(id: number, data: any) {
    return of(data); // Simula la actualización de un álbum
  }

  deleteAlbum(id: number) {
    return of(id); // Simula la eliminación de un álbum
  }
}

class MockListsService {
  getGeneros() {
    return Promise.resolve([]); // Simula una respuesta vacía de géneros
  }

  getDisqueras() {
    return Promise.resolve([]); // Simula una respuesta vacía de disqueras
  }
}

class MockMessageService {
  add(message: any) {
    console.log(message); // Simplemente logea el mensaje
  }

  clear() {
    console.log('Clear messages');
  }
}

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      imports: [ReactiveFormsModule], // Importa el módulo de formularios reactivos
      providers: [
        { provide: AlbumService, useClass: MockAlbumService },
        { provide: ListsService, useClass: MockListsService },
        { provide: MessageService, useClass: MockMessageService },
        FormBuilder,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Ejecuta los cambios de detección
  });

  it('should create the component', () => {
    expect(component).toBeTruthy(); // Verifica que el componente se crea correctamente
  });

  it('should initialize the form', () => {
    expect(component.formNewAlbum).toBeDefined(); // Verifica que el formulario de creación de album esté definido
    expect(component.formNewCommet).toBeDefined(); // Verifica que el formulario de comentarios esté definido
    expect(component.formUpdateAlbum).toBeDefined(); // Verifica que el formulario de actualización de album esté definido
  });

  it('should call the albums service when consulting albums', () => {
    const albumService = TestBed.inject(AlbumService);
    spyOn(albumService, 'albums').and.callThrough(); // Espía la función albums() del servicio

    component.consultarAlbums(); // Llama a la función en el componente

    expect(albumService.albums).toHaveBeenCalled(); // Verifica que se haya llamado a la función albums()
  });

  it('should return an empty list of albums', () => {
    component.consultarAlbums();
    expect(component.albums).toEqual([]); // Verifica que la lista de albums esté vacía
  });

});
