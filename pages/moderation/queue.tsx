import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  VStack,
  HStack,
  Button,
  Heading,
  Text,
  Spinner,
  useToast,
} from '@chakra-ui/react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import ModerationCard from '@/components/ModerationCard';
import { ContentItem } from '@/lib/types';

export default function ModerationQueuePage() {
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const toast = useToast();

  useEffect(() => {
    fetchContents();
  }, [page]);

  const fetchContents = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/contents?page=${page}`);
      const data = await response.json();
      if (data.success) {
        setContents(data.data.contents);
      }
    } catch (error) {
      toast({
        title: 'Error fetching contents',
        status: 'error',
        duration: 3,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReview = (contentId: string) => {
    window.location.href = `/moderation/review/${contentId}`;
  };

  if (loading) {
    return (
      <Box minH="100vh" bg="gray.50">
        <Navbar userRole="moderator" />
        <Container maxW="2xl" py={8}>
          <VStack justify="center" h="400px" spacing={4}>
            <Spinner size="xl" color="purple.500" />
            <Text>Loading moderation queue...</Text>
          </VStack>
        </Container>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg="gray.50">
      <Navbar userRole="moderator" />

      <Container maxW="2xl" py={8}>
        <VStack spacing={6} align="stretch">
          {/* Header */}
          <VStack spacing={2} align="start">
            <HStack justify="space-between" w="100%">
              <Heading size="lg">Moderation Queue</Heading>
              <Link href="/moderation/onboarding">
                <Button variant="ghost" size="sm">
                  ← Back to Training
                </Button>
              </Link>
            </HStack>
            <Text color="gray.600">
              {contents.length} pending items waiting for review. Keyboard shortcuts:
              A = Approve, F = Flag, E = Escalate
            </Text>
          </VStack>

          {/* Queue */}
          {contents.length > 0 ? (
            <>
              {contents.map((content) => (
                <ModerationCard
                  key={content.id}
                  content={content}
                  onReview={handleReview}
                />
              ))}

              {/* Pagination */}
              <HStack justify="center" spacing={4} py={4}>
                <Button
                  isDisabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  Previous
                </Button>
                <Text>Page {page}</Text>
                <Button onClick={() => setPage(page + 1)}>
                  Next
                </Button>
              </HStack>
            </>
          ) : (
            <Box textAlign="center" py={12} bg="white" borderRadius="lg">
              <Heading size="md" mb={2}>
                🎉 Queue Empty!
              </Heading>
              <Text color="gray.600">
                Great work! All pending items have been reviewed.
              </Text>
            </Box>
          )}
        </VStack>
      </Container>
    </Box>
  );
}
