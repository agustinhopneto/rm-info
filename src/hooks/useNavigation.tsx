import React, { createContext, useContext, useEffect, useState } from 'react';

import { useLocation } from 'react-router-dom';

import { useBreakpointValue } from '@chakra-ui/media-query';

import { DrawerNavigation } from '../components/DrawerNavigation';
import { Navigation } from '../components/Navigation';

interface NavigationProps {
  component: React.FC;
  isMdScreen?: boolean;
  path: string;
}

const NavigationContext = createContext<NavigationProps>({} as NavigationProps);

export const NavigationProvider: React.FC = ({ children }) => {
  const isMdScreen = useBreakpointValue({
    base: true,
    md: false,
  });

  const [component, setComponent] = useState<React.FC>(() => {
    return isMdScreen ? <DrawerNavigation /> : <Navigation />;
  });

  const location = useLocation();

  const [path, setPath] = useState(location.pathname);

  useEffect(() => {
    setPath(location.pathname);

    if (isMdScreen) {
      setComponent(() => <DrawerNavigation />);
      return;
    }

    setComponent(() => <Navigation />);
  }, [isMdScreen, location]);

  return (
    <NavigationContext.Provider value={{ component, isMdScreen, path }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = (): NavigationProps => {
  return useContext(NavigationContext);
};
