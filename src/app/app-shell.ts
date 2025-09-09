import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from './core/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="brand-banner">
      <div class="brand-title">NARPOS</div>
      <div class="brand-subtitle">Integration Systems</div>
    </div>
    <div class="side-banner left">NARPOS POS</div>
    <div class="side-banner right">Integration Systems</div>
    <nav style="display:flex;gap:12px;align-items:center;padding:12px 16px;border-bottom:1px solid var(--border);margin-bottom:16px">
      <a routerLink="/" style="font-weight:600;text-decoration:none;color:inherit">Narpos</a>
      <a routerLink="/dashboard" routerLinkActive="active" style="text-decoration:none;color:inherit">Dashboard</a>
      <a routerLink="/calculator" routerLinkActive="active" style="text-decoration:none;color:inherit">Calculator</a>
      <span style="margin-left:auto"></span>
      @if (user()) {
        <span style="color:#64748b;margin-right:8px">{{ user()?.email }}</span>
        <button (click)="logout()" style="padding:6px 10px;border:1px solid #e2e8f0;border-radius:8px;background:white">Sign Out</button>
      } @else {
        <a routerLink="/login" style="padding:6px 10px;border:1px solid #e2e8f0;border-radius:8px;text-decoration:none;color:inherit">Sign In</a>
      }
      <button (click)="toggleTheme()" title="Toggle theme" style="margin-left:12px;padding:6px 10px;border:1px solid var(--border);border-radius:8px;background:var(--surface);color:var(--text)">Theme</button>
      <a class="nav-contact" href="tel:+902129094889" title="Call Narpos">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M22 16.92v2a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.92 4.18 2 2 0 0 1 4.92 2h2a2 2 0 0 1 2 1.72c.12.89.31 1.76.58 2.6a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.48-1.48a2 2 0 0 1 2.11-.45c.84.27 1.71.46 2.6.58A2 2 0 0 1 22 16.92Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>0212 909 4889</span>
      </a>
    </nav>
    <router-outlet />
  `,
  styleUrls: ['./app.css']
})
export class AppShell {
  auth = inject(AuthService);
  user = computed(() => this.auth.user());
  private router = inject(Router);

  logout() {
    this.auth.signOut();
    this.router.navigateByUrl('/login');
  }

  toggleTheme() {
    const root = document.documentElement;
    const current = root.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch {}
  }

  constructor(){
    try {
      const stored = localStorage.getItem('theme');
      if (stored) document.documentElement.setAttribute('data-theme', stored);
      else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
      }
    } catch {}
  }
}
