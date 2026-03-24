import React from 'react';
import {
  Box,
  Card,
  CardBody,
  Flex,
  Badge,
  Text,
  Button,
  HStack,
  VStack,
  Heading,
} from '@chakra-ui/react';
import { FiFlag, FiCheck, FiAlertTriangle } from 'react-icons/fi';

interface ModerationCardProps {
  content: {
    id: string;
    text: string;
    authorId: string;
    platformId: string;
    createdAt: string;
    severity?: string;
    category?: string;
  };
  onReview: (contentId: string) => void;
  isSelected?: boolean;
}

const getSeverityColor = (severity?: string) => {
  switch (severity) {
    case 'critical':
      return 'red';
    case 'high':
      return 'orange';
    case 'medium':
      return 'yellow';
    default:
      return 'blue';
  }
};

const getCategoryIcon = (category?: string) => {
  switch (category) {
    case 'harassment':
      return '👤';
    case 'grooming':
      return '⚠️';
    case 'hate_speech':
      return '🔥';
    default:
      return '📝';
  }
};

export default function ModerationCard({
  content,
  onReview,
  isSelected = false,
}: ModerationCardProps) {
  const timeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const hours = Math.floor(diffMins / 60);
    return `${hours}h ago`;
  };

  return (
    <Card
      variant="outline"
      mb={3}
      borderLeft={isSelected ? '4px solid #3182ce' : '1px solid #e2e8f0'}
      bg={isSelected ? 'blue.50' : 'white'}
      cursor="pointer"
      onClick={() => onReview(content.id)}
      _hover={{ boxShadow: 'md' }}
      transition="all 0.2s"
    >
      <CardBody>
        <VStack align="start" spacing={3}>
          <HStack justify="space-between" w="100%">
            <HStack spacing={2}>
              <Text fontSize="lg" fontWeight="bold">
                {getCategoryIcon(content.category)}
              </Text>
              {content.category && (
                <Badge colorScheme="purple" fontSize="xs">
                  {content.category.replace('_', ' ')}
                </Badge>
              )}
              {content.severity && (
                <Badge
                  colorScheme={getSeverityColor(content.severity)}
                  fontSize="xs"
                >
                  {content.severity.toUpperCase()}
                </Badge>
              )}
            </HStack>
            <Text fontSize="xs" color="gray.500">
              {timeAgo(content.createdAt)}
            </Text>
          </HStack>

          <Box
            p={3}
            bg="gray.50"
            borderRadius="md"
            w="100%"
            maxH="80px"
            overflowY="auto"
          >
            <Text fontSize="sm" color="gray.800" fontFamily="mono">
              "{content.text.substring(0, 150)}
              {content.text.length > 150 ? '..." ' : '" '}
            </Text>
          </Box>

          <Flex justify="space-between" w="100%" fontSize="xs" color="gray.500">
            <Text>
              By: <strong>{content.authorId}</strong>
            </Text>
            <Text>from {content.platformId}</Text>
          </Flex>

          <Button
            size="sm"
            colorScheme="blue"
            onClick={() => onReview(content.id)}
            w="100%"
          >
            Review This Content →
          </Button>
        </VStack>
      </CardBody>
    </Card>
  );
}
