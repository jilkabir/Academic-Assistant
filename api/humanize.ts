import type { VercelRequest, VercelResponse } from '@vercel/node';
import { analyzeAndHumanize } from '../src/services/geminiService';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  const { text, intensity } = request.body;

  if (!text) {
    return response.status(400).json({ error: 'Text is required' });
  }

  try {
    const result = await analyzeAndHumanize(text, intensity);
    return response.status(200).json(result);
  } catch (error: any) {
    console.error('API Error:', error);
    return response.status(500).json({ 
      error: error.message || 'Failed to process text',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
