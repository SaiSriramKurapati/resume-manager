import { defineManifest } from '@crxjs/vite-plugin';

export default defineManifest({
  manifest_version: 3,
  name: 'Resume Manager',
  version: '1.0.0',
  description: 'Manage your resumes for job applications',
  permissions: ['storage', 'tabs'],
  action: {
    default_title: 'Resume Manager'
  },
  background: {
    service_worker: 'src/background.ts',
    type: 'module',
  },
  externally_connectable: {
    matches: ['http://localhost:3001/*']
  },
  content_scripts: [
    {
      matches: [
        '*://*/*jobs*',
        '*://*/*careers*',
        '*://*/*job*',
        '*://*/*career*',
        '*://jobs.ashbyhq.com/*',
        '*://boards.greenhouse.io/*',
        '*://jobs.lever.co/*',
      ],
      js: ['src/contentScript.tsx']
    },
    {
      matches: ['http://localhost:3001/*'],
      js: ['src/contentScriptMainApp.js']
    }
  ],
}); 