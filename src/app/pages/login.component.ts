import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService, Plan } from '../core/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  email = '';
  plan: Plan = 'free'; // legacy plan selection remains optional
  password = '';
  error = signal<string | null>(null);

  async signIn() {
    if (!this.email || !this.email.includes('@')) {
      this.error.set('Please enter a valid email.');
      return;
    }
    if (!this.password || this.password.length < 6) {
      this.error.set('Password must be at least 6 characters.');
      return;
    }
    try {
      await this.auth.signInWithPassword(this.email.trim(), this.password);
      this.router.navigateByUrl('/dashboard');
    } catch (e: any) {
      const code: string | undefined = e?.code;
      if (code === 'auth/user-not-found') {
        this.error.set('No account found. Please sign up.');
      } else if (code === 'auth/invalid-credential') {
        this.error.set('Invalid email or password.');
      } else {
        this.error.set('Sign in failed. Please try again.');
      }
    }
  }
}
