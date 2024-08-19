import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./marca.component').then(m => m.MarcaComponent),
    data: {
      title: `Marca`
    }
  },
];
