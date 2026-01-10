import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Evenement } from '../models/Evenement';

@Injectable({ // decorator to define a service (instance creation), this service accepts being injected in other components or services.
  providedIn: 'root' // makes the service available application-wide
})
export class EvenementService { // exporter pour pouvoir l'utiliser ailleurs
  constructor(private httpClient: HttpClient) { } // injection de dépendance
  // get all evenements
  getEvenements(): Observable<Evenement[]> {  
    return this.httpClient.get<Evenement[]> // type de retour : un tableau de Evenement
    ('http://localhost:8082/evenements');
    // observable : observer, subscriber and notification
  // observable design pattern : push data (notification) from the source (observer) to the consumer (subscriber) asynchronously
  } 
  // get evenement by id
  getEvenementById(id: number): Observable<Evenement> {
    // implementation here
    return this.httpClient.get<Evenement>
    (`http://localhost:8082/evenements/${id}`);
  }

  // add a new evenement
   addEvenement(evenement: Evenement): Observable<Evenement> {
    return this.httpClient.post<Evenement>('http://localhost:8082/evenements', evenement);
  }

  // update a evenement
  updateEvenement(idCourant: string, evenement: any): Observable<Evenement> {
    // implementation here
    return this.httpClient.put<Evenement>(`http://localhost:8082/evenements/${idCourant}`, evenement); 
    // return this.httpClient.patch<void>("http://localhost:8082/evenements/${idCourant}", evenement.name);

  }

  // delete a evenement
  deleteEvenement(id: number){
    // implementation here
    return this.httpClient.delete<void>(`http://localhost:8082/evenements/${id}`);
  } 
}
