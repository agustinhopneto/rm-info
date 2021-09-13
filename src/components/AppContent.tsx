import React from 'react';
import { Container } from './Container';
import { Characters } from '../pages/Characters';
import { useNavigation } from '../hooks/useNavigation';

export const AppContent: React.FC = () => {
  const { component } = useNavigation();
  return (
    <>
      {component}
      <Container>
        <Characters />
      </Container>
    </>
  );
};
