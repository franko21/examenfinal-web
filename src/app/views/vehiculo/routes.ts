import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./vehiculo.component').then(m => m.VehiculoComponent),
    data: {
      title: `Vehiculo`
    }
  },
];
