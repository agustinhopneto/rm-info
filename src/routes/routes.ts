import { FiMapPin, FiUser, FiMonitor } from 'react-icons/fi';

import { Characters } from '../pages/Characters';
import { Episodes } from '../pages/Episodes';
import { Locations } from '../pages/Locations';

export default [
  {
    path: '/',
    name: 'Characters',
    icon: FiUser,
    component: Characters,
    exact: true,
  },
  {
    path: '/episodes',
    name: 'Episodes',
    icon: FiMonitor,
    component: Episodes,
    exact: false,
  },
  {
    path: '/locations',
    name: 'Locations',
    icon: FiMapPin,
    component: Locations,
    exact: false,
  },
];
