import React from 'react';

import { useNavigation } from '../hooks/useNavigation';
import { Routes } from '../routes';
import { Container } from './Container';

export const AppContent: React.FC = () => {
  const { component } = useNavigation();
  return (
    <>
      {component}
      <Container>
        <Routes />
      </Container>
    </>
  );
};
