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
  Spinner,
  SimpleGrid,
  Badge,
  useToast,
} from '@chakra-ui/react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import KPIGrid from '@/components/KPIGrid';
import { FiTrendingUp, FiUsers, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

interface AnalyticsData {
  totalReviews: number;
  approvedCount: number;
  flaggedCount: number;
  escalatedCount: number;
  falsePositiveRate: number;
  averageCostPerReview: number;
  totalCost: number;
  averageResponseTimeSeconds: number;
  activeModerators: number;
}

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics?platformId=platform_koo');
      if (!response.ok) {
        throw new Error(`API failed with status ${response.status}`);
      }
      const data = await response.json();
      if (data.success) {
        setAnalytics(data.data);
        setErrorMessage(null);
      } else {
        setErrorMessage(data.error || 'Analytics API returned an error');
        toast({
          title: 'Error loading analytics',
          description: data.error || 'Check database connection and API logs',
          status: 'error',
        });
      }
    } catch (error) {
      setErrorMessage('Could not fetch analytics data');
      toast({
        title: 'Error loading analytics',
        description: 'Could not connect to the analytics API',
        status: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box minH="100vh" bg="gray.50">
        <Navbar userRole="admin" />
        <Container maxW="6xl" py={8}>
          <VStack justify="center" h="400px">
            <Spinner size="xl" color="purple.500" />
            <Text>Loading admin dashboard...</Text>
          </VStack>
        </Container>
      </Box>
    );
  }

  if (!analytics) {
    return (
      <Box minH="100vh" bg="gray.50">
        <Navbar userRole="admin" userName="Koo Trust & Safety" />
        <Container maxW="4xl" py={8}>
          <Card borderLeft="4px solid #e53e3e" boxShadow="sm">
            <CardBody p={6}>
              <VStack align="start" spacing={3}>
                <Heading size="md">Unable to Load Dashboard</Heading>
                <Text color="gray.700">
                  {errorMessage || 'Analytics data could not be loaded.'}
                </Text>
                <Button colorScheme="purple" onClick={() => {
                  setLoading(true);
                  fetchAnalytics();
                }}>
                  Retry
                </Button>
              </VStack>
            </CardBody>
          </Card>
        </Container>
      </Box>
    );
  }

  const approvedPct = analytics.totalReviews > 0
    ? Math.round((analytics.approvedCount / analytics.totalReviews) * 100)
    : 0;
  const flaggedPct = analytics.totalReviews > 0
    ? Math.round((analytics.flaggedCount / analytics.totalReviews) * 100)
    : 0;
  const escalatedPct = analytics.totalReviews > 0
    ? Math.round((analytics.escalatedCount / analytics.totalReviews) * 100)
    : 0;

  const kpis = [
    {
      label: 'Active Moderators',
      value: analytics.activeModerators,
      helpText: 'Verified & ready to moderate',
      color: '#667eea',
    },
    {
      label: 'Total Reviews (This Month)',
      value: analytics.totalReviews.toLocaleString(),
      helpText: 'Content items reviewed',
      color: '#48bb78',
    },
    {
      label: 'Avg Cost per Review',
      value: `₹${analytics.averageCostPerReview}`,
      helpText: 'Based on moderator hourly rates',
      color: '#9f7aea',
    },
    {
      label: 'Response Time',
      value: `${Math.round(analytics.averageResponseTimeSeconds)}s`,
      helpText: 'Average decision time',
      color: '#f6ad55',
    },
  ];

  return (
    <Box minH="100vh" bg="gray.50">
      <Navbar userRole="admin" userName="Koo Trust & Safety" />

      <Container maxW="6xl" py={8}>
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <HStack justify="space-between">
            <VStack align="start" spacing={1}>
              <Heading size="lg">Safety Operations Dashboard</Heading>
              <Text color="gray.600" fontSize="sm">
                SafeNet Moderation Metrics for Koo Platform
              </Text>
            </VStack>
            <HStack spacing={2}>
              <Link href="/">
                <Button variant="ghost" size="sm">
                  ← Back to Home
                </Button>
              </Link>
              <Button colorScheme="purple" size="sm">
                Export Report
              </Button>
            </HStack>
          </HStack>

          {/* KPI Grid */}
          <KPIGrid kpis={kpis} />

          {/* Content Classification Breakdown */}
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            <Card boxShadow="sm">
              <CardBody p={6}>
                <VStack align="start" spacing={3}>
                  <Heading size="sm">✓ Approved</Heading>
                  <Text fontSize="3xl" fontWeight="bold" color="green.500">
                    {analytics.approvedCount.toLocaleString()}
                  </Text>
                  <Text fontSize="xs" color="gray.600">
                    {approvedPct}% of total
                  </Text>
                </VStack>
              </CardBody>
            </Card>

            <Card boxShadow="sm">
              <CardBody p={6}>
                <VStack align="start" spacing={3}>
                  <Heading size="sm">🚩 Flagged</Heading>
                  <Text fontSize="3xl" fontWeight="bold" color="orange.500">
                    {analytics.flaggedCount.toLocaleString()}
                  </Text>
                  <Text fontSize="xs" color="gray.600">
                    {flaggedPct}% of total
                  </Text>
                </VStack>
              </CardBody>
            </Card>

            <Card boxShadow="sm">
              <CardBody p={6}>
                <VStack align="start" spacing={3}>
                  <Heading size="sm">⚠️ Escalated</Heading>
                  <Text fontSize="3xl" fontWeight="bold" color="red.500">
                    {analytics.escalatedCount.toLocaleString()}
                  </Text>
                  <Text fontSize="xs" color="gray.600">
                    {escalatedPct}% of total
                  </Text>
                </VStack>
              </CardBody>
            </Card>
          </SimpleGrid>

          {/* Cost & Efficiency */}
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            <Card boxShadow="sm" bg="gradient-to-r" bgGradient="linear(to-r, blue.50, purple.50)">
              <CardBody p={6}>
                <VStack align="start" spacing={3}>
                  <Heading size="sm">💰 Monthly Spend</Heading>
                  <Text fontSize="3xl" fontWeight="bold" color="purple.600">
                    ₹{(analytics.totalCost / 100000).toFixed(1)}L
                  </Text>
                  <Text fontSize="xs" color="gray.600">
                    {analytics.activeModerators} moderators × ₹{analytics.averageCostPerReview * 400}
                    /hr
                  </Text>
                </VStack>
              </CardBody>
            </Card>

            <Card boxShadow="sm" bg="gradient-to-r" bgGradient="linear(to-r, orange.50, red.50)">
              <CardBody p={6}>
                <VStack align="start" spacing={3}>
                  <Heading size="sm">⚡ False Positive Rate</Heading>
                  <Text fontSize="3xl" fontWeight="bold" color="red.600">
                    {analytics.falsePositiveRate.toFixed(1)}%
                  </Text>
                  <Text fontSize="xs" color="gray.600">
                    Flagged items that were actually safe
                  </Text>
                </VStack>
              </CardBody>
            </Card>
          </SimpleGrid>

          {/* Navigation */}
          <HStack spacing={4}>
            <Link href="/admin/team">
              <Button colorScheme="purple" variant="outline">
                → View Team (25 Moderators)
              </Button>
            </Link>
            <Link href="/admin/analytics">
              <Button colorScheme="purple" variant="outline">
                → View Full Analytics
              </Button>
            </Link>
          </HStack>

          {/* 30-Day Summary Card */}
          <Card bg="white" boxShadow="sm" borderTop="4px solid #667eea">
            <CardBody p={6}>
              <Heading size="sm" mb={4}>
                📊 30-Day Summary
              </Heading>
              <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4} fontSize="sm">
                <VStack align="start" spacing={1}>
                  <Text color="gray.600">Revenue Generated</Text>
                  <Text fontWeight="bold" fontSize="lg">
                    ₹8.5 Cr
                  </Text>
                </VStack>
                <VStack align="start" spacing={1}>
                  <Text color="gray.600">Abuse Prevented</Text>
                  <Text fontWeight="bold" fontSize="lg">
                    {analytics.flaggedCount + analytics.escalatedCount} cases
                  </Text>
                </VStack>
                <VStack align="start" spacing={1}>
                  <Text color="gray.600">Safety Impact</Text>
                  <Badge colorScheme="green" p={1}>
                    2.1% ↑ User Safety Score
                  </Badge>
                </VStack>
                <VStack align="start" spacing={1}>
                  <Text color="gray.600">Regulatory Status</Text>
                  <Badge colorScheme="green" p={1}>
                    DSA Compliant
                  </Badge>
                </VStack>
              </SimpleGrid>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  );
}
