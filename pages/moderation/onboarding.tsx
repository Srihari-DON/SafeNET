import React, { useState } from 'react';
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
  Input,
  Select,
  Progress,
  Badge,
  Checkbox,
  useToast,
} from '@chakra-ui/react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

interface TrainingModule {
  id: string;
  title: string;
  description: string;
  duration: string;
  completed: boolean;
}

export default function OnboardingPage() {
  const [step, setStep] = useState<'signup' | 'training' | 'complete'>('signup');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    language: 'hindi',
    hoursAvailable: '40',
  });
  const [trainedModules, setTrainedModules] = useState<string[]>([]);
  const toast = useToast();

  const modules: TrainingModule[] = [
    {
      id: 'harassment',
      title: 'Harassment Detection',
      description: 'Learn to identify harassment, bullying, and targeted abuse patterns',
      duration: '45 mins',
      completed: trainedModules.includes('harassment'),
    },
    {
      id: 'grooming',
      title: 'Grooming Patterns',
      description: 'Recognize and escalate child safety threats and grooming behaviors',
      duration: '60 mins',
      completed: trainedModules.includes('grooming'),
    },
    {
      id: 'platform',
      title: 'Platform Rules',
      description: 'Understand this platform\'s content policies and enforcement procedures',
      duration: '30 mins',
      completed: trainedModules.includes('platform'),
    },
    {
      id: 'lexicon',
      title: 'Hindi Abuse Lexicon',
      description: 'Master regional language abuse patterns and localized terms',
      duration: '90 mins',
      completed: trainedModules.includes('lexicon'),
    },
  ];

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/moderators', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          hoursAvailable: parseInt(formData.hoursAvailable),
          hourlyRate: 400,
        }),
      });
      if (response.ok) {
        toast({
          title: 'Signup successful!',
          description: `Welcome ${formData.name}! Start your training.`,
          status: 'success',
          duration: 3,
          isClosable: true,
        });
        setStep('training');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to sign up',
        status: 'error',
        duration: 3,
        isClosable: true,
      });
    }
  };

  const completeModule = (moduleId: string) => {
    setTrainedModules([...trainedModules, moduleId]);
    toast({
      title: '✅ Module Complete!',
      description: `Completed: ${modules.find(m => m.id === moduleId)?.title}`,
      status: 'success',
      duration: 2,
      isClosable: true,
    });
  };

  const handleTrainingComplete = () => {
    if (trainedModules.length >= 4) {
      setStep('complete');
      toast({
        title: '🎉 Training Complete!',
        description: 'You are now a verified SafeNet moderator',
        status: 'success',
        duration: 3,
        isClosable: true,
      });
    } else {
      toast({
        title: 'Complete all modules',
        description: 'You need to complete all 4 modules',
        status: 'warning',
        duration: 3,
        isClosable: true,
      });
    }
  };

  return (
    <Box minH="100vh" bg="gray.50">
      <Navbar userRole="moderator" userName={formData.name || 'Moderator'} />

      <Container maxW="2xl" py={8}>
        {/* Signup Step */}
        {step === 'signup' && (
          <Card boxShadow="md">
            <CardBody p={8}>
              <VStack spacing={6} align="stretch">
                <VStack spacing={2}>
                  <Heading size="lg">Join SafeNet</Heading>
                  <Text color="gray.600">
                    Become a trained content moderator and help create safer digital spaces
                  </Text>
                </VStack>

                <form onSubmit={handleSignup}>
                  <VStack spacing={4}>
                    <FormControl isRequired>
                      <FormLabel>Full Name</FormLabel>
                      <Input
                        placeholder="e.g., Priya Singh"
                        value={formData.name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Email</FormLabel>
                      <Input
                        type="email"
                        placeholder="your.email@safenet.in"
                        value={formData.email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Phone Number</FormLabel>
                      <Input
                        placeholder="+91-98765-43210"
                        value={formData.phone}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Primary Language</FormLabel>
                      <Select
                        value={formData.language}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                          setFormData({ ...formData, language: e.target.value })
                        }
                      >
                        <option value="hindi">Hindi</option>
                        <option value="tamil">Tamil</option>
                        <option value="telugu">Telugu</option>
                        <option value="marathi">Marathi</option>
                        <option value="english">English</option>
                      </Select>
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Hours Available per Week</FormLabel>
                      <Select
                        value={formData.hoursAvailable}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                          setFormData({
                            ...formData,
                            hoursAvailable: e.target.value,
                          })
                        }
                      >
                        <option value="20">20 hours</option>
                        <option value="30">30 hours</option>
                        <option value="40">40 hours (Full-time)</option>
                      </Select>
                    </FormControl>

                    <Button
                      type="submit"
                      colorScheme="purple"
                      w="100%"
                      size="lg"
                    >
                      Continue to Training
                    </Button>
                  </VStack>
                </form>
              </VStack>
            </CardBody>
          </Card>
        )}

        {/* Training Step */}
        {step === 'training' && (
          <VStack spacing={6}>
            <Card w="100%" boxShadow="md">
              <CardBody p={8}>
                <VStack spacing={4} align="stretch">
                  <VStack spacing={2}>
                    <Heading size="lg">Training Modules</Heading>
                    <Text color="gray.600">
                      Complete all 4 modules to become a verified moderator
                    </Text>
                  </VStack>

                  <Progress
                    value={(trainedModules.length / modules.length) * 100}
                    borderRadius="full"
                    h="8px"
                  />
                  <Text fontSize="sm" color="gray.600">
                    {trainedModules.length} of {modules.length} modules completed
                  </Text>
                </VStack>
              </CardBody>
            </Card>

            {modules.map((module) => (
              <Card
                key={module.id}
                w="100%"
                boxShadow="sm"
                opacity={module.completed ? 0.7 : 1}
                borderLeft={module.completed ? '4px solid #48bb78' : '1px solid #e2e8f0'}
              >
                <CardBody p={6}>
                  <HStack justify="space-between" align="start">
                    <VStack align="start" spacing={2} flex={1}>
                      <HStack spacing={2}>
                        <Heading size="sm">{module.title}</Heading>
                        {module.completed && (
                          <Badge colorScheme="green">✓ Complete</Badge>
                        )}
                      </HStack>
                      <Text color="gray.600" fontSize="sm">
                        {module.description}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        Duration: {module.duration}
                      </Text>
                    </VStack>
                    {!module.completed && (
                      <Button
                        colorScheme="purple"
                        size="sm"
                        onClick={() => completeModule(module.id)}
                      >
                        Start Module →
                      </Button>
                    )}
                    {module.completed && (
                      <Badge colorScheme="green" p={2}>
                        Completed
                      </Badge>
                    )}
                  </HStack>
                </CardBody>
              </Card>
            ))}

            <Card w="100%" bg="purple.50" boxShadow="sm">
              <CardBody p={6}>
                <Text fontSize="sm" color="purple.900" mb={4}>
                  ✓ All modules completed? Get your verification certificate and
                  start accepting moderation assignments.
                </Text>
                <Button
                  colorScheme="purple"
                  onClick={handleTrainingComplete}
                  isDisabled={trainedModules.length < 4}
                  w="100%"
                >
                  Get Verified & Complete Training
                </Button>
              </CardBody>
            </Card>
          </VStack>
        )}

        {/* Completion Step */}
        {step === 'complete' && (
          <Card boxShadow="lg" bg="gradient-to-b" bgGradient="linear(to-b, green.50, blue.50)">
            <CardBody p={12} textAlign="center">
              <VStack spacing={6}>
                <Box fontSize="6xl">🎉</Box>
                <Heading size="lg">Training Complete!</Heading>
                <Text fontSize="lg" color="gray.700">
                  Congratulations, {formData.name}!
                </Text>
                <Text color="gray.600" maxW="md">
                  You are now a verified SafeNet moderator. Your training certificate
                  is valid and you can start accepting moderation assignments immediately.
                </Text>

                <Card bg="white" w="100%" mt={4}>
                  <CardBody p={4}>
                    <VStack spacing={2} align="start" fontSize="sm">
                      <Text>
                        <strong>Name:</strong> {formData.name}
                      </Text>
                      <Text>
                        <strong>Email:</strong> {formData.email}
                      </Text>
                      <Text>
                        <strong>Language:</strong> {formData.language}
                      </Text>
                      <Text>
                        <strong>Status:</strong>
                        <Badge colorScheme="green" ml={2}>
                          Verified
                        </Badge>
                      </Text>
                      <Text>
                        <strong>Training Modules:</strong> 4/4 ✓
                      </Text>
                    </VStack>
                  </CardBody>
                </Card>

                <Link href="/moderation/queue">
                  <Button colorScheme="purple" size="lg" w="100%">
                    Start Moderating →
                  </Button>
                </Link>

                <Text fontSize="xs" color="gray.500">
                  Hourly Rate: ₹{400} | Hours/Week: {formData.hoursAvailable}
                </Text>
              </VStack>
            </CardBody>
          </Card>
        )}
      </Container>
    </Box>
  );
}
