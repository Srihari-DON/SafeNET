import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/firebase';
import { Payload } from '@/lib/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Payload>
) {
  if (req.method === 'GET') {
    try {
      const moderators = await prisma.moderator.findMany({
        take: 50,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          language: true,
          hoursAvailable: true,
          hourlyRate: true,
          trainingStatus: true,
          trainedModules: true,
          totalReviews: true,
          accuracyScore: true,
          currentStreak: true,
        },
      });
      return res.status(200).json({
        success: true,
        data: moderators,
      });
    } catch (error) {
      console.error('Error fetching moderators:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch moderators',
      });
    }
  }

  if (req.method === 'POST') {
    try {
      const {
        name,
        email,
        phone,
        language,
        hoursAvailable,
        hourlyRate,
      } = req.body;

      const moderator = await prisma.moderator.create({
        data: {
          name,
          email,
          phone,
          language,
          hoursAvailable,
          hourlyRate,
          trainingStatus: 'new',
          trainedModules: [],
        },
      });

      return res.status(201).json({
        success: true,
        data: moderator,
      });
    } catch (error: any) {
      console.error('Error creating moderator:', error);
      return res.status(400).json({
        success: false,
        error: error.message || 'Failed to create moderator',
      });
    }
  }

  return res.status(405).json({
    success: false,
    error: 'Method not allowed',
  });
}
