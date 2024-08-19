import { Routes } from '@angular/router';
import { DefaultLayoutComponent } from './layout';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Home'
    },
    children: [


      {
        path: 'marca',
        loadChildren: () => import('./views/marca/routes').then((m) => m.routes),

      },
      {
        path: 'vehiculo',
        loadChildren: () => import('./views/vehiculo/routes').then((m) => m.routes)
      },

      {
        path: 'inventario',
        loadChildren: () => import('./views/inventario/routes').then((m) => m.routes)
      },


      //NO TOCAR MAPA
    ]
  },
  {
    path: '404',
    loadComponent: () => import('./views/pages/page404/page404.component').then(m => m.Page404Component),
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    loadComponent: () => import('./views/pages/page500/page500.component').then(m => m.Page500Component),
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    loadComponent: () => import('./views/pages/login/login.component').then(m => m.LoginComponent),
    data: {
      title: 'Login Page'
    }
  },

  // {
  //   path: 'prestamo',
  //   loadComponent: () => import('./views/prestamo/prestamo.component').then(m => m.PrestamoComponent), // Añadir esta línea
  //   data: {
  //     title: 'Prestamo'
  //   }
  // },

];
