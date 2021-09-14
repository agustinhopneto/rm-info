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
  Link,
  Box,
} from '@chakra-ui/react';
import { HamburgerIcon, Icon } from '@chakra-ui/icons';
import { Link as ReactRouter } from 'react-router-dom';

import { useThemeColors } from '../hooks/themeColors';
import { ColorModeSwitcher } from './ColorModeSwitcher';

import logoImg from '../assets/logo.png';
import routes from '../routes/routes';
import { useNavigation } from '../hooks/useNavigation';

export const DrawerNavigation: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { navBackground, buttonBg, buttonBgHover, buttonColor, heading } =
    useThemeColors();
  const btnRef = useRef<any>();
  const { linkColor, linkBgHover, linkColorHover } = useThemeColors();
  const { path } = useNavigation();

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
        bg={buttonBg}
        color={buttonColor}
        _hover={{ bg: buttonBgHover }}
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
            <Image src={logoImg} alt="Rick and Morty" mt={8} />
          </DrawerHeader>

          <DrawerBody p={0}>
            {routes.map(route => (
              <Link
                key={route.name}
                onClick={onClose}
                to={route.path}
                as={ReactRouter}
                fontSize={18}
                style={{
                  textDecoration: 'none',
                }}
                color={route.path === path ? linkColorHover : linkColor}
              >
                <Box
                  width="100%"
                  display="flex"
                  alignItems="center"
                  p={6}
                  textDecoration="none"
                  _hover={{
                    backgroundColor: linkBgHover,
                    color: linkColorHover,
                  }}
                  style={{
                    transition: '200ms',
                  }}
                >
                  <Icon as={route.icon} mr={2} fontSize={20} /> {route.name}
                </Box>
              </Link>
            ))}
          </DrawerBody>

          <DrawerFooter>
            <ColorModeSwitcher />
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};
