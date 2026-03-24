import React from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Button,
  Heading,
  Text,
  SimpleGrid,
  Card,
  CardBody,
  CardHeader,
  Image,
  Center,
  useToast,
} from '@chakra-ui/react';
import { FiArrowRight } from 'react-icons/fi';
import Link from 'next/link';

export default function Home() {
  const toast = useToast();

  return (
    <Box bg="gradient-to-b" bgGradient="linear(to-b, purple.50, blue.50)" minH="100vh" py={16}>
      <Container maxW="6xl">
        {/* Header */}
        <VStack spacing={8} textAlign="center" mb={16}>
          <Box
            w={20}
            h={20}
            bg="gradient-to-r"
            bgGradient="linear(to-r, purple.500, pink.500)"
            borderRadius="xl"
            display="flex"
            alignItems="center"
            justifyContent="center"
            color="white"
            fontSize="4xl"
          >
            🛡️
          </Box>
          <Heading as="h1" size="2xl" fontWeight="bold">
            SafeNet: Women-Focused Safety Infrastructure for India
          </Heading>
          <Text fontSize="lg" color="gray.600" maxW="2xl">
            Prevent harm before it happens. SafeNet upgrades platform governance
            from reactive moderation to preventive safety operations.
          </Text>

          <HStack spacing={4} pt={4}>
            <Link href="/moderation/onboarding">
              <Button
                size="lg"
                colorScheme="purple"
                rightIcon={<FiArrowRight />}
              >
                Moderator Portal
              </Button>
            </Link>
            <Link href="/admin/dashboard">
              <Button
                size="lg"
                variant="outline"
                rightIcon={<FiArrowRight />}
              >
                Admin Dashboard
              </Button>
            </Link>
          </HStack>
        </VStack>

        {/* Features */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} mb={16}>
          <Card>
            <CardHeader>
              <HStack spacing={3}>
                <Box fontSize="2xl">📋</Box>
                <Heading size="md">Moderator Training</Heading>
              </HStack>
            </CardHeader>
            <CardBody>
              <Text color="gray.600">
                Comprehensive training modules covering harassment detection, grooming
                patterns, platform rules, and regional abuse lexicon.
              </Text>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <HStack spacing={3}>
                <Box fontSize="2xl">⚡</Box>
                <Heading size="md">Real-Time Moderation</Heading>
              </HStack>
            </CardHeader>
            <CardBody>
              <Text color="gray.600">
                Distributed moderator network reviews content in real-time with
                severity classification, category tagging, and escalation workflows.
              </Text>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <HStack spacing={3}>
                <Box fontSize="2xl">📊</Box>
                <Heading size="md">Analytics & Insights</Heading>
              </HStack>
            </CardHeader>
            <CardBody>
              <Text color="gray.600">
                Platform dashboards track moderation volume, cost-per-decision,
                false positive rates, and team performance metrics.
              </Text>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* How It Works */}
        <Box bg="white" borderRadius="lg" p={8} mb={16} boxShadow="sm">
          <Heading size="lg" mb={6} textAlign="center">
            How SafeNet Works
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} textAlign="center">
            <VStack spacing={3}>
              <Box fontSize="3xl">1️⃣</Box>
              <Heading size="sm">Moderators Sign Up</Heading>
              <Text color="gray.600" fontSize="sm">
                Women register with language preferences and availability hours
              </Text>
            </VStack>
            <VStack spacing={3}>
              <Box fontSize="3xl">2️⃣</Box>
              <Heading size="sm">Complete Training</Heading>
              <Text color="gray.600" fontSize="sm">
                4-module training on abuse detection and platform policies
              </Text>
            </VStack>
            <VStack spacing={3}>
              <Box fontSize="3xl">3️⃣</Box>
              <Heading size="sm">Start Moderating</Heading>
              <Text color="gray.600" fontSize="sm">
                Review flagged content and make approve/flag/escalate decisions
              </Text>
            </VStack>
          </SimpleGrid>
        </Box>

        {/* India-First Messaging */}
        <Card bg="gradient-to-r" bgGradient="linear(to-r, orange.400, red.400)" color="white">
          <CardBody p={8}>
            <VStack spacing={4} align="start">
              <Heading size="md">🇮🇳 India-First Design</Heading>
              <Text fontSize="sm">
                ✓ Multi-language support (Hindi, Tamil, Telugu, Marathi, English)
              </Text>
              <Text fontSize="sm">
                ✓ Trained on India-specific abuse patterns and regional contexts
              </Text>
              <Text fontSize="sm">
                ✓ Partnerships with Indian platforms (Koo, ShareChat, Bonanza)
              </Text>
              <Text fontSize="sm">
                ✓ Pricing in Indian Rupees (₹300-600/day per moderator)
              </Text>
            </VStack>
          </CardBody>
        </Card>

        {/* CTA */}
        <Center py={12}>
          <VStack spacing={4}>
            <Heading size="md">Ready to explore?</Heading>
            <HStack spacing={4}>
              <Link href="/moderation/onboarding">
                <Button colorScheme="purple" size="lg">
                  I'm a Moderator
                </Button>
              </Link>
              <Link href="/admin/dashboard">
                <Button variant="outline" size="lg">
                  I'm a Platform
                </Button>
              </Link>
            </HStack>
            <Text fontSize="xs" color="gray.500" pt={4}>
              This is a prototype for demonstration. All data is mock/sample.
            </Text>
          </VStack>
        </Center>
      </Container>
    </Box>
  );
}
