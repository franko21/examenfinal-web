import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Mapas'
    },
    children: [
      {
        path: '',
        redirectTo: 'mapas',
        pathMatch: 'full'
      },
      {
        path: 'zonas-seguras',
        loadComponent: () => import('./zonas-seguras/zonas-seguras.component').then(m => m.ZonasSegurasComponent),
        data: {
          title: 'Zonas Seguras'
        }
      },
      {
        path: 'ubicaciones',
        loadComponent: () => import('./ubicaciones/ubicaciones.component').then(m => m.UbicacionesComponent),
        data: {
          title: 'ubicaciones'
        }
      }
    ]
  }
];