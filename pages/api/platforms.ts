import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/firebase';
import { Payload } from '@/lib/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Payload>
) {
  if (req.method === 'GET') {
    try {
      const platforms = await prisma.platform.findMany({
        orderBy: { monthlySpend: 'desc' },
      });

      return res.status(200).json({
        success: true,
        data: platforms,
      });
    } catch (error) {
      console.error('Error fetching platforms:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch platforms',
      });
    }
  }

  return res.status(405).json({
    success: false,
    error: 'Method not allowed',
  });
}
