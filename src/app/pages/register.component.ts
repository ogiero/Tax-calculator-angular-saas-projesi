import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  firstName = '';
  lastName = '';
  email = '';
  password = '';
  confirm = '';
  error = signal<string | null>(null);
  loading = signal(false);

  async onRegister() {
    this.error.set(null);
    if (!this.firstName || !this.lastName) {
      this.error.set('Please enter your first and last name.');
      return;
    }
    if (!this.email || !this.email.includes('@')) {
      this.error.set('Please enter a valid email.');
      return;
    }
    if (!this.password || this.password.length < 6) {
      this.error.set('Password must be at least 6 characters.');
      return;
    }
    if (this.password !== this.confirm) {
      this.error.set('Passwords do not match.');
      return;
    }
    try {
      this.loading.set(true);
      await this.auth.register(this.email.trim(), this.password, this.firstName.trim(), this.lastName.trim(), 'free');
      this.router.navigateByUrl('/dashboard');
    } catch (e: any) {
      this.error.set(e?.message ?? 'Registration failed. Please try again.');
    } finally {
      this.loading.set(false);
    }
  }
}

