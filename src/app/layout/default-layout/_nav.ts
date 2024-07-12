import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Monitoreo',
    url: '/monitoreo',
    iconComponent: { name: 'cil-speedometer' },

  },
  {
    title: true,
    name: 'Perfile'
  },
  {
    name: 'Perfil',
    url: '/perfil',
    iconComponent: { name: 'cilUser' }
  },
  {
    name: 'Components',
    title: true
  },
  {
    name: 'Mapas',
    url: '/mapas',
    iconComponent: { name: 'cil-map' },
    children: [
      {
        name: 'Zonas Seguras',
        url: '/mapas/zonas-seguras',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Ubicaciones',
        url: '/mapas/ubicaciones',
        icon: 'nav-icon-bullet'
      }
    ]
  },
  {
    name: 'Clientes',
    url: '/clientes',
    iconComponent: { name: 'cil-people' }
  },
  // {
  //   name: 'Mapa',
  //   url: '/mapa',
  //   iconComponent: { name: 'cil-map' }
  // },
  {
    name: 'Prestamo',
    url: '/prestamo',
    iconComponent: { name: 'cil-bookmark' }
  },
  {

    name: 'Alertas',
    url: '/alerta',
    iconComponent: { name: 'cil-bell' },
    badge: {
      color: 'info',
      text: '!!!'
    }
  },
   { name: 'Dispositivo',
    url: '/dispositivo',
    iconComponent: { name: 'cil-map' }

  }
];
