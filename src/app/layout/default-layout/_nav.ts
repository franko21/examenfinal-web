import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [



  {
    name: 'Components',
    title: true
  },

  // {
  //   name: 'Mapa',
  //   url: '/mapa',
  //   iconComponent: { name: 'cil-map' }
  // },

  {
    name: 'Marca',
    url: '/marca',
    iconComponent: { name: 'cil-bookmark' }
  },
  {
    name: 'Vehiculo',
    url: '/vehiculo',
    iconComponent: { name: 'cil-bookmark' }
  },
  {
    name: 'Inventario',
    url: '/inventario',
    iconComponent: { name: 'cil-bookmark' }
  },
];
