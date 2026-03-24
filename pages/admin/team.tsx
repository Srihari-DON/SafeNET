import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Button,
  Heading,
  Text,
  Card,
  CardBody,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Spinner,
  useToast,
} from '@chakra-ui/react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { Moderator } from '@/lib/types';

export default function TeamManagementPage() {
  const [moderators, setModerators] = useState<Moderator[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    fetchModerators();
  }, []);

  const fetchModerators = async () => {
    try {
      const response = await fetch('/api/moderators');
      const data = await response.json();
      if (data.success) {
        setModerators(data.data);
      }
    } catch (error) {
      toast({
        title: 'Error loading moderators',
        status: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'green';
      case 'in_training':
        return 'yellow';
      case 'new':
        return 'blue';
      default:
        return 'gray';
    }
  };

  if (loading) {
    return (
      <Box minH="100vh" bg="gray.50">
        <Navbar userRole="admin" />
        <Container maxW="6xl" py={8}>
          <VStack justify="center" h="400px">
            <Spinner size="xl" color="purple.500" />
          </VStack>
        </Container>
      </Box>
    );
  }

  const verifiedMods = moderators.filter(m => m.trainingStatus === 'verified');
  const trainingMods = moderators.filter(m => m.trainingStatus === 'in_training');

  return (
    <Box minH="100vh" bg="gray.50">
      <Navbar userRole="admin" userName="Koo Trust & Safety" />

      <Container maxW="6xl" py={8}>
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <HStack justify="space-between">
            <VStack align="start" spacing={1}>
              <Heading size="lg">Moderator Team Management</Heading>
              <Text color="gray.600" fontSize="sm">
                {moderators.length} total moderators ({verifiedMods.length} verified,{' '}
                {trainingMods.length} in training)
              </Text>
            </VStack>
            <Link href="/admin/dashboard">
              <Button variant="ghost">← Back to Dashboard</Button>
            </Link>
          </HStack>

          {/* Summary Cards */}
          <HStack spacing={4}>
            <Card flex={1} boxShadow="sm">
              <CardBody p={6}>
                <VStack align="start" spacing={2}>
                  <Text fontSize="sm" color="gray.600">
                    Active Moderators
                  </Text>
                  <Text fontSize="2xl" fontWeight="bold">
                    {verifiedMods.length}
                  </Text>
                  <Text fontSize="xs" color="green.600">
                    Ready for assignments
                  </Text>
                </VStack>
              </CardBody>
            </Card>

            <Card flex={1} boxShadow="sm">
              <CardBody p={6}>
                <VStack align="start" spacing={2}>
                  <Text fontSize="sm" color="gray.600">
                    In Training
                  </Text>
                  <Text fontSize="2xl" fontWeight="bold">
                    {trainingMods.length}
                  </Text>
                  <Text fontSize="xs" color="yellow.600">
                    Complete modules soon
                  </Text>
                </VStack>
              </CardBody>
            </Card>

            <Card flex={1} boxShadow="sm">
              <CardBody p={6}>
                <VStack align="start" spacing={2}>
                  <Text fontSize="sm" color="gray.600">
                    Avg Accuracy
                  </Text>
                  <Text fontSize="2xl" fontWeight="bold">
                    {(
                      moderators.reduce((acc, m) => acc + m.accuracyScore, 0) /
                      moderators.length
                    ).toFixed(0)}
                    %
                  </Text>
                  <Text fontSize="xs" color="purple.600">
                    Team performance
                  </Text>
                </VStack>
              </CardBody>
            </Card>

            <Card flex={1} boxShadow="sm">
              <CardBody p={6}>
                <VStack align="start" spacing={2}>
                  <Text fontSize="sm" color="gray.600">
                    Total Reviews
                  </Text>
                  <Text fontSize="2xl" fontWeight="bold">
                    {moderators.reduce((acc, m) => acc + m.totalReviews, 0).toLocaleString()}
                  </Text>
                  <Text fontSize="xs" color="blue.600">
                    All time
                  </Text>
                </VStack>
              </CardBody>
            </Card>
          </HStack>

          {/* Moderators Table */}
          <Card boxShadow="md">
            <CardBody p={0}>
              <Box overflowX="auto">
                <Table>
                  <Thead bg="gray.100">
                    <Tr>
                      <Th>Name</Th>
                      <Th>Language</Th>
                      <Th>Status</Th>
                      <Th>Reviews</Th>
                      <Th>Accuracy</Th>
                      <Th>Streak</Th>
                      <Th>Rate (₹/hr)</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {moderators.map((mod) => (
                      <Tr key={mod.id} _hover={{ bg: 'gray.50' }}>
                        <Td fontWeight="500">{mod.name}</Td>
                        <Td>
                          <Badge colorScheme="blue">
                            {mod.language.toUpperCase()}
                          </Badge>
                        </Td>
                        <Td>
                          <Badge colorScheme={getStatusColor(mod.trainingStatus)}>
                            {mod.trainingStatus.replace('_', ' ')}
                          </Badge>
                        </Td>
                        <Td>{mod.totalReviews.toLocaleString()}</Td>
                        <Td fontWeight="bold">{mod.accuracyScore}%</Td>
                        <Td>
                          {mod.currentStreak > 0 && (
                            <Badge colorScheme="green">
                              🔥 {mod.currentStreak} days
                            </Badge>
                          )}
                        </Td>
                        <Td>{mod.hourlyRate}</Td>
                        <Td>
                          <Button size="xs" variant="ghost">
                            View Profile
                          </Button>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            </CardBody>
          </Card>

          {/* Add Moderator CTA */}
          <Card bg="purple.50" borderLeft="4px solid #667eea">
            <CardBody p={6}>
              <HStack justify="space-between">
                <VStack align="start" spacing={1}>
                  <Heading size="sm">Expand Your Team</Heading>
                  <Text fontSize="sm" color="gray.600">
                    Onboard more moderators to increase review capacity and reduce
                    response times
                  </Text>
                </VStack>
                <Button colorScheme="purple">
                  Add Moderators →
                </Button>
              </HStack>
            </CardBody>
          </Card>

          {/* Top Performers */}
          <Card boxShadow="sm">
            <CardBody p={6}>
              <Heading size="sm" mb={4}>
                ⭐ Top Performers This Month
              </Heading>
              <VStack spacing={3} align="stretch">
                {moderators
                  .sort((a, b) => b.totalReviews - a.totalReviews)
                  .slice(0, 5)
                  .map((mod, idx) => (
                    <HStack key={mod.id} justify="space-between" pb={2} borderBottom="1px solid #e2e8f0">
                      <HStack spacing={3}>
                        <Text fontWeight="bold" fontSize="lg">
                          #{idx + 1}
                        </Text>
                        <VStack align="start" spacing={0}>
                          <Text fontWeight="500">{mod.name}</Text>
                          <Text fontSize="xs" color="gray.600">
                            {mod.totalReviews} reviews • {mod.accuracyScore}% accuracy
                          </Text>
                        </VStack>
                      </HStack>
                      <Badge colorScheme="gold">
                        +{Math.floor(Math.random() * 100)} new this week
                      </Badge>
                    </HStack>
                  ))}
              </VStack>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  );
}
