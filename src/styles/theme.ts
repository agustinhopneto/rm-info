import { extendTheme } from '@chakra-ui/react';
import { createBreakpoints } from '@chakra-ui/theme-tools';

const breakpoints = createBreakpoints({
  sm: '48em',
  md: '62em',
  lg: '80em',
  xl: '96em',
  '2xl': '112',
});

export const theme = extendTheme({
  fonts: {
    heading: 'Paytone One',
    body: 'Nunito Sans',
  },
  breakpoints,
});
