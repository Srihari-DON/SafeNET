import React from 'react';
import {
  Box,
  Flex,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Icon,
  Tooltip,
} from '@chakra-ui/react';
import { FiUser, FiCheckCircle, FiAlertCircle, FiTrendingUp } from 'react-icons/fi';

interface KPIItem {
  label: string;
  value: string | number;
  helpText?: string;
  icon?: React.ReactNode;
  color?: string;
}

interface KPIGridProps {
  kpis: KPIItem[];
}

export default function KPIGrid({ kpis }: KPIGridProps) {
  return (
    <SimpleGrid
      columns={{ base: 1, md: 2, lg: 4 }}
      spacing={6}
      mb={8}
    >
      {kpis.map((kpi, idx) => (
        <Box
          key={idx}
          p={6}
          bg="white"
          borderRadius="lg"
          boxShadow="sm"
          borderLeft={`4px solid ${kpi.color || '#3182ce'}`}
        >
          <Stat>
            <Flex justifyContent="space-between" alignItems="flex-start">
              <Box>
                <StatLabel fontSize="sm" fontWeight="600" color="gray.600">
                  {kpi.label}
                </StatLabel>
                <StatNumber fontSize="2xl" fontWeight="bold" mt={2}>
                  {kpi.value}
                </StatNumber>
                {kpi.helpText && (
                  <StatHelpText fontSize="xs" mt={1}>
                    {kpi.helpText}
                  </StatHelpText>
                )}
              </Box>
              {kpi.icon && (
                <Icon as={FiTrendingUp} w={5} h={5} color="gray.400" />
              )}
            </Flex>
          </Stat>
        </Box>
      ))}
    </SimpleGrid>
  );
}
