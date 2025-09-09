import { bootstrapApplication } from '@angular/platform-browser';
import { AppShell } from './app/app-shell';
import { appConfig } from './app/app.config';

bootstrapApplication(AppShell, appConfig).catch((err) => console.error(err));
