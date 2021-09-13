import { FiMapPin, FiUser } from 'react-icons/fi';
import { Characters } from '../pages/Characters';
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
    path: '/locations',
    name: 'Locations',
    icon: FiMapPin,
    component: Locations,
    exact: false,
  },
];
