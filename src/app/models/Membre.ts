import { Evenement } from './Evenement';
import { Outil } from './Outil';
import { Publication } from './Publication';

export interface Member {
  id: number;
  cin: string;
  nom: string;
  prenom: string;
  email: string;
  password: string;
  dateInscription: Date;
  dateNaissance: Date;
  etablissement: string;  
  photo?: string;
  sujet?: string;
  grade?: string;
  diplome?: string;
  typeMbr: string;
  encadrantId?: number;
  encadrant?: Member;
  outils: Outil[];
  evenements: Evenement[];  
  publications?: Publication[];
  cv?: string;

}
