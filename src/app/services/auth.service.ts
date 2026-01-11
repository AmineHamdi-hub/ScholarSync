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

    // Defensive check: surface a clearer message if Firebase/Auth isn't initialized
    const appOptions = (this.auth && (this.auth as any).app && (this.auth as any).app.options) || null;
    if (!appOptions || Object.keys(appOptions).length === 0) {
      console.warn('[AuthService] Firebase Auth appears uninitialized. Check `environment.firebase` and that `provideFirebaseApp(() => initializeApp(...))` runs during bootstrap.');
    }
  }

  async login(email: string, pass: string) {
    if (!this.auth || !(this.auth as any).app || !(this.auth as any).app.options) {
      throw new Error('Firebase Auth not configured. Check `environment.firebase` and app initialization.');
    }
    return signInWithEmailAndPassword(this.auth, email, pass);
  }

  async signup(email: string, pass: string) {
    if (!this.auth || !(this.auth as any).app || !(this.auth as any).app.options) {
      throw new Error('Firebase Auth not configured. Check `environment.firebase` and app initialization.');
    }
    return createUserWithEmailAndPassword(this.auth, email, pass);
  }

  async loginWithGoogle() {
    if (!this.auth || !(this.auth as any).app || !(this.auth as any).app.options) {
      throw new Error('Firebase Auth not configured. Check `environment.firebase` and app initialization.');
    }
    const provider = new GoogleAuthProvider();
    return signInWithPopup(this.auth, provider);
  }

  async logout() {
    await signOut(this.auth);
    return this.router.navigate(['/login']);
  }
}
