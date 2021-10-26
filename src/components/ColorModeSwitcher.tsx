import * as React from 'react';

import { FaMoon, FaSun } from 'react-icons/fa';

import {
  useColorMode,
  useColorModeValue,
  IconButton,
  IconButtonProps,
} from '@chakra-ui/react';

import { useThemeColors } from '../hooks/useThemeColors';

type ColorModeSwitcherProps = Omit<IconButtonProps, 'aria-label'>;

export const ColorModeSwitcher: React.FC<ColorModeSwitcherProps> = props => {
  const { toggleColorMode } = useColorMode();
  const { themeButton } = useThemeColors();
  const SwitchIcon = useColorModeValue(FaMoon, FaSun);

  return (
    <IconButton
      size="md"
      fontSize="lg"
      alignSelf="flex-end"
      variant="ghost"
      color={themeButton}
      onClick={toggleColorMode}
      icon={<SwitchIcon />}
      aria-label={`Switch to ${themeButton} mode`}
      {...props}
    />
  );
};
