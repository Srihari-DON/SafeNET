import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/firebase';
import { Payload } from '@/lib/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Payload>
) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Invalid content ID',
    });
  }

  if (req.method === 'GET') {
    try {
      const content = await prisma.contentItem.findUnique({
        where: { id },
        include: {
          moderator: {
            select: { id: true, name: true, email: true, language: true },
          },
        },
      });

      if (!content) {
        return res.status(404).json({
          success: false,
          error: 'Content not found',
        });
      }

      return res.status(200).json({
        success: true,
        data: content,
      });
    } catch (error) {
      console.error('Error fetching content:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch content',
      });
    }
  }

  if (req.method === 'PATCH') {
    try {
      const { moderatorId, decision, severity, category, reason } = req.body;

      const content = await prisma.contentItem.update({
        where: { id },
        data: {
          moderatorId,
          decision,
          severity,
          category,
          reason,
          flaggedAt: new Date(),
        },
      });

      // Log the moderation action
      await prisma.moderationLog.create({
        data: {
          contentId: id,
          moderatorId,
          decision,
          category,
          reason,
          timeSpent: 0, // Would be calculated on frontend
        },
      });

      // Update moderator stats
      await prisma.moderator.update({
        where: { id: moderatorId },
        data: {
          totalReviews: { increment: 1 },
        },
      });

      return res.status(200).json({
        success: true,
        data: content,
      });
    } catch (error: any) {
      console.error('Error updating content:', error);
      return res.status(400).json({
        success: false,
        error: error.message || 'Failed to update content',
      });
    }
  }

  return res.status(405).json({
    success: false,
    error: 'Method not allowed',
  });
}
