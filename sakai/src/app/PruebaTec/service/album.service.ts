import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';



@Injectable({
    providedIn: 'root'
})
export class AlbumService {

    private apiUrl = environment.host
    constructor(private http: HttpClient) { }

    newAlbum(data: { name: string, cover: string, releaseDate: string, description: string, genre: string, recordLabel: string }): Observable<any> {

        return this.http.post<string>(`${this.apiUrl}/albums`, data);
    }
    albums(): Observable<any> {
        return this.http.get<string>(`${this.apiUrl}/albums`);
    }
    newComment(id,data): Observable<any> {

        return this.http.post<string>(`${this.apiUrl}/albums/${id}/comments`, data);
    }


    updateAlbum(id,data):Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/albums/${id}`, data)
    }

    deleteAlbum(id):Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/albums/${id}`)
    }



}