import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable()
export class ListsService {

    constructor(private http: HttpClient) { }

    getGeneros() {
        return this.http.get<any>('assets/listas/data/generos.json')
            .toPromise()
            .then(res => res.data)
            .then(data => data);
    }
    getDisqueras() {
        return this.http.get<any>('assets/listas/data/disqueras.json')
            .toPromise()
            .then(res => res.data)
            .then(data => data);
    }

}
