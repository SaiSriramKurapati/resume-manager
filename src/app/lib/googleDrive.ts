import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/drive.readonly'];

export const oauth2Client = new google.auth.OAuth2(
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
  process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI
);

export function generateAuthUrl() {
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent'
  });
}

export async function getTokens(code: string) {
  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
}

const KEYWORDS = ['education', 'experience', 'skills', 'objective', 'summary', 'professional'];

function isResumeText(text: string): boolean {
  const lower = text.toLowerCase();
  let count = 0;
  for (const word of KEYWORDS) {
    if (lower.includes(word)) count += 1;
  }
  return count >= 2;
}

export async function identifyResumeFiles(tokens: any) {
  oauth2Client.setCredentials(tokens);
  const drive = google.drive({ version: 'v3', auth: oauth2Client });
  const res = await drive.files.list({
    fields: 'files(id,name,mimeType)',
    q: "mimeType='application/pdf' or mimeType='application/vnd.openxmlformats-officedocument.wordprocessingml.document' or mimeType='application/msword'"
  });
  const files = res.data.files || [];
  const resumes: { id: string; name: string }[] = [];
  for (const f of files) {
    if (!f.id) continue;
    try {
      const resp = await drive.files.export({ fileId: f.id, mimeType: 'text/plain' }, { responseType: 'text' });
      const text = typeof resp.data === 'string' ? resp.data : '';
      if (isResumeText(text)) {
        resumes.push({ id: f.id, name: f.name || 'Unnamed' });
      }
    } catch {
      // ignore parsing errors
    }
  }
  return resumes;
}
