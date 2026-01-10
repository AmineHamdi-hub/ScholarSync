import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Publication } from '../models/Publication';

@Injectable({ // decorator to define a service (instance creation), this service accepts being injected in other components or services.
  providedIn: 'root' // makes the service available application-wide
})
export class PublicationService { // exporter pour pouvoir l'utiliser ailleurs
  constructor(private httpClient: HttpClient) { } // injection de dépendance
  // get all Publications
  getPublications(): Observable<Publication[]> {  
    return this.httpClient.get<Publication[]> // type de retour : un tableau de Publication
    ('http://localhost:8081/publications');
    // observable : observer, subscriber and notification
  // observable design pattern : push data (notification) from the source (observer) to the consumer (subscriber) asynchronously
  } 
  // get Publication by id
  getPublicationById(id: number): Observable<Publication> {
    // implementation here
    return this.httpClient.get<Publication>
    (`http://localhost:8081/publications/${id}`);
  }

  // add a new Publication
  addPublication(publication: any): Observable<Publication> {
    // implementation here
    return this.httpClient.post<Publication>(`http://localhost:8081/publications`, publication)
  }

  // update a Publication
  updatePublication(idCourant: string, publication: any): Observable<Publication> {
    // implementation here
    return this.httpClient.put<Publication>(`http://localhost:8081/publications/${idCourant}`, publication); 
    // return this.httpClient.patch<void>("http://localhost:8081/Publications/${idCourant}", Publication.name);

  }

  // delete a Publication
  deletePublication(id: number){
    // implementation here
    return this.httpClient.delete<void>(`http://localhost:8081/publications/${id}`);
  } 
}
