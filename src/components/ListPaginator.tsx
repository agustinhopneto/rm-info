import React from 'react';

import {
  Container,
  Next,
  PageGroup,
  Paginator,
  Previous,
} from 'chakra-paginator';

import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';

import { useThemeColors } from '../hooks/themeColors';

interface Props {
  pagesQuantity: number;
  currentPage: number;
  onPageChange: (currentPage: number) => void;
}

export const ListPaginator: React.FC<Props> = ({
  currentPage,
  onPageChange,
  pagesQuantity,
}) => {
  const { paginationTextActive, paginationBgActive, paginationText } =
    useThemeColors();

  return (
    <Paginator
      pagesQuantity={pagesQuantity}
      currentPage={currentPage}
      onPageChange={current => onPageChange(current)}
      outerLimit={1}
      innerLimit={1}
      activeStyles={{
        color: paginationTextActive,
        background: paginationBgActive,
      }}
    >
      <Container mt={5} justifyContent="center">
        <Previous color={paginationText}>
          <ChevronLeftIcon fontSize={24} />
        </Previous>
        <PageGroup color={paginationText} isInline align="center" mx={2} />
        <Next color={paginationText}>
          <ChevronRightIcon fontSize={24} />
        </Next>
      </Container>
    </Paginator>
  );
};
