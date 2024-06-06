import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./dispositivo.component').then(m => m.DispositivoComponent),
    data: {
      title: `Dispositivo`
    }
  },
];