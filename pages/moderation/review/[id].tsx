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
  FormControl,
  FormLabel,
  Select,
  Spinner,
  Badge,
  Divider,
  useToast,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { ContentItem } from '@/lib/types';

export default function ContentReviewPage() {
  const router = useRouter();
  const { id } = router.query;
  const [content, setContent] = useState<ContentItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [decision, setDecision] = useState<'approved' | 'flagged' | 'escalated'>('flagged');
  const [category, setCategory] = useState('harassment');
  const [reason, setReason] = useState('');
  const toast = useToast();

  useEffect(() => {
    if (id) {
      fetchContent();
    }
  }, [id]);

  const fetchContent = async () => {
    try {
      const response = await fetch(`/api/contents/${id}`);
      const data = await response.json();
      if (data.success) {
        setContent(data.data);
      }
    } catch (error) {
      toast({
        title: 'Error loading content',
        status: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitDecision = async () => {
    if (!content) return;

    try {
      setSubmitting(true);
      const response = await fetch(`/api/contents/${content.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          moderatorId: 'mod_001', // Would be current user ID
          decision,
          severity: decision === 'approved' ? 'low' : 'high',
          category: decision === 'approved' ? undefined : category,
          reason: decision === 'approved' ? undefined : reason,
        }),
      });

      if (response.ok) {
        toast({
          title: '✅ Decision submitted!',
          status: 'success',
          duration: 2,
        });
        setTimeout(() => router.push('/moderation/queue'), 1500);
      }
    } catch (error) {
      toast({
        title: 'Error submitting decision',
        status: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box minH="100vh" bg="gray.50">
        <Navbar userRole="moderator" />
        <Container maxW="3xl" py={8}>
          <VStack justify="center" h="400px">
            <Spinner size="xl" color="purple.500" />
          </VStack>
        </Container>
      </Box>
    );
  }

  if (!content) {
    return (
      <Box minH="100vh" bg="gray.50">
        <Navbar userRole="moderator" />
        <Container maxW="3xl" py={8}>
          <Text>Content not found</Text>
        </Container>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg="gray.50">
      <Navbar userRole="moderator" />

      <Container maxW="3xl" py={8}>
        <VStack spacing={6} align="stretch">
          {/* Header */}
          <HStack justify="space-between">
            <Heading size="lg">Content Review</Heading>
            <Link href="/moderation/queue">
              <Button variant="ghost">← Back to Queue</Button>
            </Link>
          </HStack>

          {/* Content Display */}
          <Card boxShadow="md">
            <CardBody p={6}>
              <VStack spacing={4} align="start">
                <HStack spacing={2} w="100%">
                  <Heading size="sm">Content from {content.platformId}</Heading>
                  <Badge colorScheme="blue">{content.authorId}</Badge>
                </HStack>

                <Box
                  p={6}
                  bg="gray.100"
                  borderRadius="md"
                  w="100%"
                  minH="120px"
                  fontFamily="mono"
                  fontSize="sm"
                  whiteSpace="pre-wrap"
                  overflowY="auto"
                  maxH="300px"
                >
                  {content.text}
                </Box>

                <HStack fontSize="xs" color="gray.500">
                  <Text>Created: {new Date(content.createdAt).toLocaleString()}</Text>
                  <Text>•</Text>
                  <Text>
                    Context: <Link href={content.contextUrl || '#'}>{content.contextUrl}</Link>
                  </Text>
                </HStack>
              </VStack>
            </CardBody>
          </Card>

          {/* Policy Guidelines */}
          <Card bg="blue.50" boxShadow="sm">
            <CardBody p={6}>
              <Heading size="sm" mb={3}>
                📋 Review Guidelines
              </Heading>
              <VStack spacing={2} align="start" fontSize="sm">
                <Text>
                  <strong>Harassment:</strong> Personal attacks, bullying, targeted abuse
                </Text>
                <Text>
                  <strong>Grooming:</strong> Sexual advances, inappropriate contact attempts
                </Text>
                <Text>
                  <strong>Hate Speech:</strong> Slurs, discrimination, dehumanizing language
                </Text>
                <Text>
                  <strong>Spam:</strong> Commercial promotion, scams, off-topic content
                </Text>
              </VStack>
            </CardBody>
          </Card>

          {/* Decision Form */}
          <Card boxShadow="md">
            <CardBody p={6}>
              <VStack spacing={4} align="stretch">
                <Heading size="sm">Your Decision</Heading>

                <FormControl>
                  <FormLabel fontWeight="600">Action</FormLabel>
                  <HStack spacing={3}>
                    <Button
                      colorScheme={decision === 'approved' ? 'green' : 'gray'}
                      variant={decision === 'approved' ? 'solid' : 'outline'}
                      onClick={() => setDecision('approved')}
                    >
                      ✓ Approve (A)
                    </Button>
                    <Button
                      colorScheme={decision === 'flagged' ? 'yellow' : 'gray'}
                      variant={decision === 'flagged' ? 'solid' : 'outline'}
                      onClick={() => setDecision('flagged')}
                    >
                      🚩 Flag (F)
                    </Button>
                    <Button
                      colorScheme={decision === 'escalated' ? 'red' : 'gray'}
                      variant={decision === 'escalated' ? 'solid' : 'outline'}
                      onClick={() => setDecision('escalated')}
                    >
                      ⚠️ Escalate (E)
                    </Button>
                  </HStack>
                </FormControl>

                {decision !== 'approved' && (
                  <>
                    <FormControl>
                      <FormLabel fontWeight="600">Category</FormLabel>
                      <Select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                      >
                        <option value="harassment">Harassment</option>
                        <option value="grooming">Grooming</option>
                        <option value="hate_speech">Hate Speech</option>
                        <option value="spam">Spam</option>
                      </Select>
                    </FormControl>

                    <FormControl>
                      <FormLabel fontWeight="600">Reason</FormLabel>
                      <Select
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                      >
                        <option value="">Select a reason...</option>
                        <option value="Direct death threats">Direct death threats</option>
                        <option value="Gender-based discrimination">Gender-based discrimination</option>
                        <option value="Unwanted romantic advances">Unwanted romantic advances</option>
                        <option value="Commercial spam">Commercial spam</option>
                        <option value="Slurs and dehumanizing language">Slurs and dehumanizing language</option>
                        <option value="Potential child safety threat">Potential child safety threat</option>
                        <option value="Coordinated harassment">Coordinated harassment</option>
                        <option value="Other">Other</option>
                      </Select>
                    </FormControl>
                  </>
                )}

                <Divider />

                <Button
                  colorScheme="purple"
                  size="lg"
                  onClick={handleSubmitDecision}
                  isLoading={submitting}
                  w="100%"
                >
                  Submit Decision
                </Button>
              </VStack>
            </CardBody>
          </Card>

          {/* Quick Stats */}
          <HStack
            bg="gray.100"
            p={4}
            borderRadius="md"
            fontSize="xs"
            color="gray.600"
            justify="space-around"
          >
            <Text>⏱️ Your decisions help train the system</Text>
            <Text>📊 You've reviewed: 142 items</Text>
            <Text>⭐ Accuracy: 94%</Text>
          </HStack>
        </VStack>
      </Container>
    </Box>
  );
}
