import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/firebase';
import { Payload } from '@/lib/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Payload>
) {
  if (req.method === 'GET') {
    try {
      // Get paginated contents
      const page = parseInt(req.query.page as string) || 1;
      const limit = 10;
      const skip = (page - 1) * limit;

      const contents = await prisma.contentItem.findMany({
        skip,
        take: limit,
        include: {
          moderator: {
            select: { id: true, name: true, email: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      const total = await prisma.contentItem.count();

      return res.status(200).json({
        success: true,
        data: {
          contents,
          total,
          page,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error('Error fetching contents:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch contents',
      });
    }
  }

  if (req.method === 'POST') {
    try {
      const { platformId, text, authorId, contextUrl } = req.body;

      const content = await prisma.contentItem.create({
        data: {
          platformId,
          text,
          authorId,
          contextUrl,
          decision: 'pending',
        },
      });

      return res.status(201).json({
        success: true,
        data: content,
      });
    } catch (error: any) {
      console.error('Error creating content:', error);
      return res.status(400).json({
        success: false,
        error: error.message || 'Failed to create content',
      });
    }
  }

  return res.status(405).json({
    success: false,
    error: 'Method not allowed',
  });
}
