import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/firebase';
import { Payload } from '@/lib/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Payload>
) {
  if (req.method === 'GET') {
    try {
      const alerts = await prisma.alert.findMany({
        orderBy: { detectionCount: 'desc' },
        take: 20,
      });

      return res.status(200).json({
        success: true,
        data: alerts,
      });
    } catch (error) {
      console.error('Error fetching alerts:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch alerts',
      });
    }
  }

  return res.status(405).json({
    success: false,
    error: 'Method not allowed',
  });
}
