// TypeScript types for SafeNet

export type ModeratorStatus = 'new' | 'in_training' | 'verified' | 'inactive';
export type ContentDecision = 'approved' | 'flagged' | 'escalated' | 'pending';
export type SeverityLevel = 'low' | 'medium' | 'high' | 'critical';
export type SubscriptionTier = 'starter' | 'growth' | 'enterprise';

export interface Moderator {
  id: string;
  name: string;
  email: string;
  phone: string;
  language: string; // e.g., 'hindi', 'english', 'tamil'
  hoursAvailable: number; // hours per week
  hourlyRate: number; // in INR
  trainingStatus: ModeratorStatus;
  trainedModules: string[]; // completed training modules
  verifiedAt?: string; // ISO date
  joinedAt: string;
  totalReviews: number;
  accuracyScore: number; // 0-100
  currentStreak: number; // days
}

export interface ContentItem {
  id: string;
  platformId: string;
  text: string;
  authorId: string;
  createdAt: string;
  flaggedAt?: string;
  moderatorId?: string;
  decision?: ContentDecision;
  severity?: SeverityLevel;
  category?: string; // 'harassment', 'grooming', 'hate_speech', 'spam'
  reason?: string;
  contextUrl?: string;
}

export interface Platform {
  id: string;
  name: string;
  subscriptionTier: SubscriptionTier;
  monthlySpend: number; // in INR
  activeModeratorCount: number;
  monthlyReviewVolume: number;
  createdAt: string;
  contactEmail: string;
}

export interface Alert {
  id: string;
  pattern: string; // emerging abuse pattern or slur
  detectionCount: number;
  region: string; // 'north_india', 'south_india', etc.
  severity: SeverityLevel;
  firstDetectedAt: string;
  description: string;
}

export interface ModerationMetrics {
  totalReviews: number;
  approvedCount: number;
  flaggedCount: number;
  escalatedCount: number;
  falsePositiveRate: number; // percentage
  averageCostPerReview: number; // INR
  totalCost: number; // INR
  averageResponseTimeSeconds: number;
}

export interface PlatformMetrics extends ModerationMetrics {
  platformId: string;
  activeModerators: number;
  weeklyVolume: number[];
  accuracyByCategory: { [key: string]: number };
}

export interface Payload {
  success: boolean;
  data?: any;
  error?: string;
}
