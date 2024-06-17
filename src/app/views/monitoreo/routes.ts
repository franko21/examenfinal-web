import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./monitoreo.component').then(m => m.MonitoreoComponent),
    data: {
      title: `Monitoreo`
    }
  }
];