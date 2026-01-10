import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Outil } from '../models/Outil';

@Injectable({ // decorator to define a service (instance creation), this service accepts being injected in other components or services.
  providedIn: 'root' // makes the service available application-wide
})
export class OutilService { // exporter pour pouvoir l'utiliser ailleurs
  constructor(private httpClient: HttpClient) { } // injection de dépendance
  // get all Outils
  getOutils(): Observable<Outil[]> {  
    return this.httpClient.get<Outil[]> // type de retour : un tableau de Outil
    (`http://localhost:8083/outils`);
    // observable : observer, subscriber and notification
  // observable design pattern : push data (notification) from the source (observer) to the consumer (subscriber) asynchronously
  } 
  // get Outil by id
  getOutilById(id: number): Observable<Outil> {
    // implementation here
    return this.httpClient.get<Outil>
    (`http://localhost:8083/outils/${id}`);
  }

  // add a new Outil
  addOutil(outil: any): Observable<Outil> {
    // implementation here
    return this.httpClient.post<Outil>(`http://localhost:8083/outils`, outil);
  }

  // update a Outil
  updateOutil(idCourant: string, outil: any): Observable<Outil> {
    // implementation here
    return this.httpClient.put<Outil>(`http://localhost:8083/outils/${idCourant}`, outil); 
    // return this.httpClient.patch<void>("http://localhost:8083/outils/${idCourant}", outil.name);

  }

  // delete a Outil
  deleteOutil(id: number){
    // implementation here
    return this.httpClient.delete<void>(`http://localhost:8083/outils/${id}`);
  } 
}
