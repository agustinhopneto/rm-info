import React, { useRef } from 'react';
import { useDisclosure } from '@chakra-ui/hooks';
import {
  IconButton,
  Image,
  Drawer,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  DrawerBody,
  DrawerFooter,
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';

import { useThemeColors } from '../hooks/themeColors';
import { ColorModeSwitcher } from './ColorModeSwitcher';

import logoImg from '../assets/logo.png';

export const DrawerNavigation: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    navBackground,
    navButtonBg,
    navButtonBgHover,
    navButtonColor,
    heading,
  } = useThemeColors();
  const btnRef = useRef<any>();

  return (
    <>
      <IconButton
        onClick={onOpen}
        aria-label="Search database"
        icon={<HamburgerIcon />}
        position="absolute"
        top={4}
        right={6}
        shadow="md"
        size="md"
        bg={navButtonBg}
        color={navButtonColor}
        _hover={{ bg: navButtonBgHover }}
      />
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
        size="xs"
      >
        <DrawerOverlay />
        <DrawerContent bg={navBackground}>
          <DrawerCloseButton color={heading} />
          <DrawerHeader>
            <Image src={logoImg} alt="Rick and Morty" pt={8} px={4} />
          </DrawerHeader>

          <DrawerBody />

          <DrawerFooter>
            <ColorModeSwitcher />
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};
