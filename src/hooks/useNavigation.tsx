import { useBreakpointValue } from '@chakra-ui/media-query';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { DrawerNavigation } from '../components/DrawerNavigation';
import { Navigation } from '../components/Navigation';

interface NavigationProps {
  component: React.FC;
  isMdScreen?: boolean;
}

const NavigationContext = createContext<NavigationProps>({} as NavigationProps);

const NavigationProvider: React.FC = ({ children }) => {
  const isMdScreen = useBreakpointValue({
    base: true,
    md: false,
  });

  const [component, setComponent] = useState<React.FC>(() => {
    return isMdScreen ? <DrawerNavigation /> : <Navigation />;
  });

  useEffect(() => {
    if (isMdScreen) {
      setComponent(() => <DrawerNavigation />);
      return;
    }

    setComponent(() => <Navigation />);
  }, [isMdScreen]);

  return (
    <NavigationContext.Provider value={{ component, isMdScreen }}>
      {children}
    </NavigationContext.Provider>
  );
};

const useNavigation = (): NavigationProps => {
  const context = useContext(NavigationContext);

  return context;
};

export { NavigationProvider, useNavigation };
