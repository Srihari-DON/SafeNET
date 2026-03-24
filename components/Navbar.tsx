import React from 'react';
import {
  Box,
  Flex,
  Button,
  HStack,
  VStack,
  Text,
  Image,
  useColorMode,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import Link from 'next/link';
import { FiMenu, FiUser, FiLogOut, FiMoon, FiSun } from 'react-icons/fi';

interface NavbarProps {
  userRole?: 'moderator' | 'admin';
  userName?: string;
}

export default function Navbar({ userRole = 'moderator', userName }: NavbarProps) {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box
      as="nav"
      bg="white"
      boxShadow="sm"
      borderBottom="1px solid"
      borderColor="gray.200"
      py={4}
      px={8}
      mb={8}
    >
      <Flex justify="space-between" align="center">
        {/* Logo */}
        <Link href="/">
          <HStack cursor="pointer" spacing={2}>
            <Box
              w={10}
              h={10}
              bg="gradient-to-r"
              bgGradient="linear(to-r, purple.500, pink.500)"
              borderRadius="md"
              display="flex"
              alignItems="center"
              justifyContent="center"
              color="white"
              fontWeight="bold"
              fontSize="lg"
            >
              S
            </Box>
            <Text fontSize="lg" fontWeight="bold">
              SafeNet
            </Text>
          </HStack>
        </Link>

        {/* Nav Links */}
        {userRole === 'moderator' && (
          <HStack spacing={6}>
            <Link href="/moderation/onboarding">
              <Text
                cursor="pointer"
                _hover={{ color: 'purple.500' }}
                fontWeight="500"
              >
                Training
              </Text>
            </Link>
            <Link href="/moderation/queue">
              <Text
                cursor="pointer"
                _hover={{ color: 'purple.500' }}
                fontWeight="500"
              >
                Queue
              </Text>
            </Link>
          </HStack>
        )}

        {userRole === 'admin' && (
          <HStack spacing={6}>
            <Link href="/admin/dashboard">
              <Text
                cursor="pointer"
                _hover={{ color: 'purple.500' }}
                fontWeight="500"
              >
                Dashboard
              </Text>
            </Link>
            <Link href="/admin/team">
              <Text
                cursor="pointer"
                _hover={{ color: 'purple.500' }}
                fontWeight="500"
              >
                Team
              </Text>
            </Link>
            <Link href="/admin/analytics">
              <Text
                cursor="pointer"
                _hover={{ color: 'purple.500' }}
                fontWeight="500"
              >
                Analytics
              </Text>
            </Link>
          </HStack>
        )}

        {/* Right Controls */}
        <HStack spacing={4}>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleColorMode}
            leftIcon={colorMode === 'light' ? <FiMoon /> : <FiSun />}
          >
            {colorMode === 'light' ? 'Dark' : 'Light'}
          </Button>

          <Menu>
            <MenuButton
              as={Button}
              variant="ghost"
              size="sm"
              leftIcon={<FiUser />}
            >
              {userName || 'Account'}
            </MenuButton>
            <MenuList>
              <MenuItem>Profile</MenuItem>
              <MenuItem>Settings</MenuItem>
              <MenuItem>Help</MenuItem>
              <MenuItem icon={<FiLogOut />}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Flex>
    </Box>
  );
}
