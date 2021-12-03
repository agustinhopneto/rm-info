import React from 'react';

import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';

import { useThemeColors } from '../hooks/useThemeColors';

type Props = {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  title: string;
  actionButtonTitle?: string;
  actionButton?: () => void;
};

export const DataModal: React.FC<Props> = ({
  children,
  isOpen,
  onClose,
  title,
  actionButton,
  actionButtonTitle,
}) => {
  const {
    shape,
    buttonBg,
    buttonBgHover,
    buttonColor,
    title: titleColor,
  } = useThemeColors();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg={shape}>
        <ModalHeader color={titleColor} lineHeight={1.15}>
          {title}
          <ModalCloseButton />
        </ModalHeader>
        <ModalBody>{children}</ModalBody>

        {actionButtonTitle && actionButton && (
          <ModalFooter px={3} pb={5}>
            <Button
              color={buttonColor}
              bg={buttonBg}
              mr={3}
              onClick={actionButton}
              _hover={{
                bg: buttonBgHover,
              }}
            >
              {actionButtonTitle}
            </Button>
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
};
