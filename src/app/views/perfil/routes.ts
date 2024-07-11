import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import("./perfil.component").then(m => m.PerfilComponent),
    data: {
      title: `Perfil`
    }
  },
];

