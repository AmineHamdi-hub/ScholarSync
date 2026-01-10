import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut, user, User, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<User | null>;

  constructor(private auth: Auth, private router: Router) {
    this.user$ = user(this.auth);
  }

  async login(email: string, pass: string) {
    return signInWithEmailAndPassword(this.auth, email, pass);
  }

  async signup(email: string, pass: string) {
    return createUserWithEmailAndPassword(this.auth, email, pass);
  }

  async loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(this.auth, provider);
  }

  async logout() {
    await signOut(this.auth);
    return this.router.navigate(['/login']);
  }
}
