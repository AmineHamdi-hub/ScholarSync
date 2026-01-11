import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Evenement } from '../models/Evenement';
import { Member } from '../models/Membre';
import { Outil } from '../models/Outil';
import { Publication } from '../models/Publication';

@Injectable({ // decorator to define a service (instance creation), this service accepts being injected in other components or services.
  providedIn: 'root' // makes the service available application-wide
})
export class MemberService { // exporter pour pouvoir l'utiliser ailleurs
  constructor(private httpClient: HttpClient) { } // injection de dépendance
  // get all members
  getMembers(): Observable<Member[]> {  
    return this.httpClient.get<Member[]> // type de retour : un tableau de Member
    (`http://localhost:8084/membres`);
    // observable : observer, subscriber and notification
  // observable design pattern : push data (notification) from the source (observer) to the consumer (subscriber) asynchronously
  } 

  // get all teachers (enseignants)
  getEnseignants(): Observable<Member[]> {
    // Prefer a teacher-specific endpoint if the backend provides it.
    return this.httpClient.get<Member[]>(`http://localhost:8084/membres/enseignant`);
  }

  // get member by id
  getMemberById(id: number): Observable<Member> {
    // implementation here
    return this.httpClient.get<Member>
    (`http://localhost:8084/membres/${id}`);
  }

  // add a new student
   addSEtudiant(member: Member): Observable<Member> {
    return this.httpClient.post<Member>(`http://localhost:8084/membres/etudiant`, member);
  }

  // add a new supervisor
  addEnseignantChercheur(member: Member): Observable<Member> {
    return this.httpClient.post<Member>(`http://localhost:8084/membres/enseignant`, member);
  }

  // update a student
  updateEtudiant(idCourant: string, member: any): Observable<Member> {
    // implementation here
    return this.httpClient.put<Member>(`http://localhost:8084/membres/etudiant/${idCourant}`, member); 
    // return this.httpClient.patch<void>("http://localhost:9000/MEMBRE-SERVICE/membres/etudiant/${idCourant}", member.name);

  }
    // update a supervisor
  updateEnseignant(idCourant: string, member: any): Observable<Member> {
    // implementation here
    return this.httpClient.put<Member>(`http://localhost:8084/membres/enseignant/${idCourant}`, member); 
    // return this.httpClient.patch<void>("http://localhost:9000/MEMBRE-SERVICE/membres/etudiant/${idCourant}", member.name);

  }

  // delete a member
  deleteMember(id: number){
    // implementation here
    return this.httpClient.delete<void>(`http://localhost:8084/membres/${id}`);
  } 

  getPublicationsByMemberId(id: number): Observable<Publication[]>{
    return this.httpClient.get<Publication[]>(`http://localhost:8084/membres/${id}/publications`);
  }

  getOutilsByMemberId(id: number): Observable<Outil[]>{
    return this.httpClient.get<Outil[]>(`http://localhost:8084/membres/${id}/publications`);
  }

  getEvenementsByMemberId(id: number): Observable<Evenement[]>{
    return this.httpClient.get<Evenement[]>(`http://localhost:8084/membres/${id}/publications`);
  }
}
