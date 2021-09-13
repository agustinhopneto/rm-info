import React from 'react';

import { Container } from './Container';

import { useNavigation } from '../hooks/useNavigation';
import { Routes } from '../routes';

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
