import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./alerta.component').then(m => m.AlertaComponent),
    data: {
      title: `Alerta`
    }
  },
];