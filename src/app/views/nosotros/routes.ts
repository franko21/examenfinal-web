import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./nosotros.component').then(m => m.NosotrosComponent),
    data: {
      title: `Nosotros`
    }
  },
];
