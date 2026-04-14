/**
 * ─────────────────────────────────────────────
 *  Vercel Serverless Function — /api/upload
 *  POST → accepts image file, converts to base64
 *         data URL, returns the path for storage
 *
 *  On Vercel we can't save files to disk, so we
 *  store images as base64 data URIs in MongoDB.
 * ─────────────────────────────────────────────
 */

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const contentType = req.headers['content-type'] || '';

    // Handle multipart/form-data (file upload from browser)
    if (contentType.includes('multipart/form-data')) {
      // Parse the multipart body manually for Vercel
      const chunks = [];
      await new Promise((resolve, reject) => {
        req.on('data', (chunk) => chunks.push(chunk));
        req.on('end', resolve);
        req.on('error', reject);
      });
      const buffer = Buffer.concat(chunks);
      const boundary = contentType.split('boundary=')[1];

      if (!boundary) {
        return res.status(400).json({ success: false, error: 'No boundary in multipart' });
      }

      // Find the file data in the multipart body
      const boundaryBuffer = Buffer.from(`--${boundary}`);
      const parts = [];
      let start = 0;

      while (true) {
        const idx = buffer.indexOf(boundaryBuffer, start);
        if (idx === -1) break;
        if (start > 0) {
          parts.push(buffer.slice(start, idx - 2)); // -2 for \r\n before boundary
        }
        start = idx + boundaryBuffer.length + 2; // +2 for \r\n after boundary
      }

      if (parts.length === 0) {
        return res.status(400).json({ success: false, error: 'No file found in upload' });
      }

      // Parse the first part (the file)
      const part = parts[0];
      const headerEnd = part.indexOf('\r\n\r\n');
      const headers = part.slice(0, headerEnd).toString();
      const fileData = part.slice(headerEnd + 4);

      // Detect mime type from headers
      const mimeMatch = headers.match(/Content-Type:\s*(\S+)/i);
      const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';

      // Convert to base64 data URL
      const base64 = fileData.toString('base64');
      const dataUrl = `data:${mime};base64,${base64}`;

      return res.status(200).json({
        success: true,
        path: dataUrl,
      });
    }

    // Handle JSON body (base64 already encoded by client)
    if (contentType.includes('application/json')) {
      const { image } = req.body;
      if (!image) {
        return res.status(400).json({ success: false, error: 'No image data' });
      }
      return res.status(200).json({
        success: true,
        path: image,
      });
    }

    return res.status(400).json({ success: false, error: 'Unsupported content type' });
  } catch (error) {
    console.error('[API /upload Error]', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
