import React from 'react';
import { Box, Container, Heading, Text, Button, Center, VStack } from '@chakra-ui/react';
import Link from 'next/link';

export default function Custom404() {
  return (
    <Box minH="100vh" bg="gray.50" display="flex" alignItems="center">
      <Container maxW="sm" py={16} textAlign="center">
        <Center>
          <VStack spacing={6}>
            <Box fontSize="6xl">😕</Box>
            <Heading size="lg">Page Not Found</Heading>
            <Text color="gray.600">
              The page you're looking for doesn't exist or has been moved.
            </Text>
            <Link href="/">
              <Button colorScheme="purple" size="lg">
                Go Home
              </Button>
            </Link>
          </VStack>
        </Center>
      </Container>
    </Box>
  );
}
