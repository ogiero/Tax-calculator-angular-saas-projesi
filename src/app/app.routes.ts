import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';
import { LoginComponent } from './pages/login.component';
import { RegisterComponent } from './pages/register.component';
import { DashboardComponent } from './pages/dashboard.component';
import { CalculatorComponent } from './features/calculator/calculator.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', canActivate: [authGuard], component: DashboardComponent },
  { path: 'calculator', canActivate: [authGuard], component: CalculatorComponent },
  { path: '**', redirectTo: 'dashboard' },
];
