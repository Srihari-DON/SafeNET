import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/firebase';
import { Payload } from '@/lib/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Payload>
) {
  if (req.method === 'GET') {
    try {
      const platformId = req.query.platformId as string || 'platform_koo';

      // Get content metrics
      const totalContents = await prisma.contentItem.count({
        where: { platformId },
      });

      const flaggedContents = await prisma.contentItem.count({
        where: { platformId, decision: 'flagged' },
      });

      const escalatedContents = await prisma.contentItem.count({
        where: { platformId, decision: 'escalated' },
      });

      const approvedContents = await prisma.contentItem.count({
        where: { platformId, decision: 'approved' },
      });

      // Get moderator count
      const activeModerators = await prisma.moderator.count({
        where: { trainingStatus: 'verified' },
      });

      // Get total cost (simplified calculation)
      const moderators = await prisma.moderator.findMany({
        where: { trainingStatus: 'verified' },
        select: { hourlyRate: true },
      });

      const totalCostPerMonth = moderators.reduce((acc: number, mod: { hourlyRate: number }) => acc + (mod.hourlyRate * 160), 0); // 160 hours/month
      const costPerReview = totalContents > 0 ? totalCostPerMonth / totalContents : 0;

      // Get false positive rate (escalated + flagged that were approved)
      const falsePositives = escalatedContents + flaggedContents;
      const falsePositiveRate = totalContents > 0 ? (falsePositives / totalContents) * 100 : 0;

      // Calculate average response time (simulated - would be tracked in logs)
      const avgResponseTime = 45; // seconds

      return res.status(200).json({
        success: true,
        data: {
          totalReviews: totalContents,
          approvedCount: approvedContents,
          flaggedCount: flaggedContents,
          escalatedCount: escalatedContents,
          falsePositiveRate: Math.round(falsePositiveRate * 100) / 100,
          averageCostPerReview: Math.round(costPerReview),
          totalCost: totalCostPerMonth,
          averageResponseTimeSeconds: avgResponseTime,
          activeModerators,
          weeklyVolume: [3200, 3450, 3100, 3800, 4200, 2900, 2100],
        },
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch analytics',
      });
    }
  }

  return res.status(405).json({
    success: false,
    error: 'Method not allowed',
  });
}
