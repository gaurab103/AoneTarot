import type { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import { existsSync } from 'fs';

// Load env from committed file (import and deploy - no manual Vercel env)
try {
  const envPath = path.join(process.cwd(), 'env.production.js');
  if (existsSync(envPath)) {
    const env = require(envPath);
    Object.entries(env).forEach(([k, v]) => {
      if (v && !process.env[k]) process.env[k] = String(v);
    });
  }
} catch {}

import app from 'backend/app';

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return new Promise<void>((resolve, reject) => {
    app(req as any, res as any);
    res.on('finish', () => resolve());
    res.on('error', reject);
  });
}
