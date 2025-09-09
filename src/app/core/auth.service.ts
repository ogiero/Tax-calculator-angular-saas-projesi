import { Injectable, signal, inject } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut as fbSignOut, onAuthStateChanged } from '@angular/fire/auth';
import { Firestore, doc, setDoc, serverTimestamp, getDoc } from '@angular/fire/firestore';

export type Plan = 'free' | 'pro' | 'business';

export interface User {
  email: string;
  plan: Plan;
}

const STORAGE_KEY = 'app_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private afAuth = inject(Auth);
  private db = inject(Firestore);
  private _user = signal<User | null>(this.readFromStorage());

  readonly user = this._user.asReadonly();

  private readFromStorage(): User | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  }

  private writeToStorage(user: User | null) {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEY);
  }

  signIn(email: string, plan: Plan) {
    const user: User = { email, plan };
    this._user.set(user);
    this.writeToStorage(user);
  }

  async signOut() {
    try { await fbSignOut(this.afAuth); } catch {}
    this._user.set(null);
    this.writeToStorage(null);
  }

  isAuthenticated(): boolean {
    return !!this._user();
  }

  async signInWithPassword(email: string, password: string) {
    const cred = await signInWithEmailAndPassword(this.afAuth, email, password);
    let plan: Plan = this._user()?.plan ?? 'free';
    try {
      const snap = await getDoc(doc(this.db, 'users', cred.user.uid));
      const data = snap.data() as any;
      plan = (data?.plan as Plan) ?? plan;
    } catch {}
    const u: User = { email: cred.user.email ?? email, plan };
    this._user.set(u);
    this.writeToStorage(u);
  }

  async register(email: string, password: string, firstName?: string, lastName?: string, plan: Plan = 'free') {
    const cred = await createUserWithEmailAndPassword(this.afAuth, email, password);
    try {
      await setDoc(doc(this.db, 'users', cred.user.uid), {
        firstName: firstName ?? null,
        lastName: lastName ?? null,
        email: cred.user.email ?? email,
        plan,
        createdAt: serverTimestamp(),
      }, { merge: true });
    } catch {}
    this._user.set({ email: cred.user.email ?? email, plan });
    this.writeToStorage({ email: cred.user.email ?? email, plan });
  }

  constructor() {
    try {
      onAuthStateChanged(this.afAuth, async (fbUser) => {
        if (fbUser) {
          const current = this._user();
          let plan: Plan = current?.plan ?? 'free';
          try {
            const snap = await getDoc(doc(this.db, 'users', fbUser.uid));
            const data = snap.data() as any;
            plan = (data?.plan as Plan) ?? plan;
          } catch {}
          const u: User = { email: fbUser.email ?? current?.email ?? '', plan };
          this._user.set(u);
          this.writeToStorage(u);
        } else {
          this._user.set(null);
          this.writeToStorage(null);
        }
      });
    } catch {}
  }
}
