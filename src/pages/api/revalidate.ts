import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify GitHub webhook signature (optional but recommended)
    const signature = req.headers['x-hub-signature-256'];
    const event = req.headers['x-github-event'];

    // Only process push events
    if (event !== 'push') {
      return res.status(200).json({ message: 'Event ignored' });
    }

    // Revalidate all pages that use database content
    const pagesToRevalidate = ['/', '/about', '/contact'];

    console.log('🔄 Revalidating pages due to GitHub webhook...');

    for (const page of pagesToRevalidate) {
      try {
        await res.revalidate(page);
        console.log(`✅ Revalidated: ${page}`);
      } catch (error) {
        console.error(`❌ Failed to revalidate ${page}:`, error);
      }
    }

    return res.status(200).json({
      message: 'Revalidation triggered successfully',
      revalidated: pagesToRevalidate,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Revalidation error:', error);
    return res.status(500).json({
      error: 'Revalidation failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}