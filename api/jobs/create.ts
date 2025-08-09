import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
import { verifyAdminJWT } from '../security/middleware';
import { analyzeScriptAST } from '../security/astCheck';
import { db } from '../services/db';
import { generatePresignedUploadURL } from '../services/blob';
import { logAudit } from '../services/audit';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Auth check
    const adminUser = await verifyAdminJWT(req);
    if (!adminUser) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { scriptCode, jobName } = req.body || {};
    if (!scriptCode || !jobName) {
      return res.status(400).json({ error: 'Missing scriptCode or jobName' });
    }

    // Analyze script for malicious patterns before storing
    const analysisResult = analyzeScriptAST(scriptCode);
    if (!analysisResult.safe) {
      return res.status(400).json({ 
        error: 'Script failed security checks',
        details: analysisResult.issues
      });
    }

    // Store job in DB
    const jobId = crypto.randomUUID();
    await db.jobs.insert({
      id: jobId,
      name: jobName,
      ownerId: adminUser.id,
      createdAt: new Date(),
      status: 'pending'
    });

    // Generate presigned URL for optional binary payload
    const uploadURL = await generatePresignedUploadURL(`jobs/${jobId}/payload.bin`);

    // Audit log
    logAudit({
      action: 'job_create',
      actorId: adminUser.id,
      target: jobId,
      meta: { jobName }
    });

    return res.status(200).json({ jobId, uploadURL });

  } catch (err) {
    console.error('Job create error', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
