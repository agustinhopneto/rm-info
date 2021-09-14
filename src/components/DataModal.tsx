import React from 'react';
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';
import { useThemeColors } from '../hooks/themeColors';

type Props = {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  title: string;
};

export const DataModal: React.FC<Props> = ({
  children,
  isOpen,
  onClose,
  title,
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
        </ModalHeader>
        <ModalBody>{children}</ModalBody>

        <ModalFooter>
          <Button
            color={buttonColor}
            bg={buttonBg}
            mr={3}
            onClick={onClose}
            _hover={{
              bg: buttonBgHover,
            }}
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
