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
    canActivate: [authGuard],
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'monitoreo',
        loadChildren: () => import('./views/monitoreo/routes').then((m) => m.routes),
      },
      {
        path: 'perfil',
        loadChildren: () => import('./views/perfil/routes').then((m) => m.routes),
      },
      {
        path: 'prestamo',
        loadChildren: () => import('./views/prestamo/routes').then((m) => m.routes),

      },
      {
        path: 'alerta',
        loadChildren: () => import('./views/alerta/routes').then((m) => m.routes),
      },
       { path: 'dispositivo',
        loadChildren: () => import('./views/dispositivo/dispositivo.routes').then((m) => m.routes),


      },
      { path: 'clientes',
        loadChildren: () => import('./views/clientes/routes').then((m) => m.routes),


      },
      //NO TOCAR MAPA
      {
        path: 'mapas',
        loadChildren: () => import('./views/mapas/routes').then((m) => m.routes),

      }
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
  {
    path: 'register',
    loadComponent: () => import('./views/pages/register/register.component').then(m => m.RegisterComponent),
    data: {
      title: 'Register Page'
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
