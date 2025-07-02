// src/config.ts
type EnvSpec = {
  key: string;
  public: boolean;
  validate: (val: string) => boolean;
  description: string;
};

const SPECS: EnvSpec[] = [
  {
    key: 'NEXT_PUBLIC_SUPABASE_URL',
    public: true,
    validate: (v) => v.startsWith('https://'),
    description: 'Your Supabase project URL',
  },
  {
    key: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    public: true,
    validate: (v) => v.length > 20 && v.startsWith('sb_'),
    description: 'Your Supabase anon/public key',
  },
  {
    key: 'AGENT_LOGGING_WEBHOOK_URL',
    public: false,
    validate: (v) => v.startsWith('https://'),
    description: 'Public webhook URL for agent logs',
  },
  {
    key: 'YOUR_AGENT_ANALYTICS_WEBHOOK_URL',
    public: false,
    validate: (v) => v.startsWith('https://'),
    description: 'Public webhook URL for analytics dashboard',
  },
];

const missing: string[] = [];
const invalid: string[] = [];

// Note: This validation runs on both server and client.
// Server-only variables will be undefined on the client, so we must
// guard against validating them on the client.
for (const spec of SPECS) {
  // Only validate non-public variables on the server
  if (!spec.public && typeof window !== 'undefined') {
    continue;
  }
  
  const val = process.env[spec.key];
  if (!val) {
    missing.push(`${spec.key}: ${spec.description}`);
  } else if (!spec.validate(val)) {
    invalid.push(`${spec.key}: ${spec.description}`);
  }
}

if (missing.length || invalid.length) {
  console.error('\n🛑 Environment configuration errors:\n');
  if (missing.length) {
    console.error('🔸 Missing vars:\n', missing.map(m => `  • ${m}`).join('\n'));
  }
  if (invalid.length) {
    console.error('🔸 Invalid format:\n', invalid.map(i => `  • ${i}`).join('\n'));
  }
  console.error('\nPlease fix your .env file and restart the dev server.\n');
  throw new Error('Invalid environment configuration');
}

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
export const AGENT_LOGGING_WEBHOOK_URL = process.env.AGENT_LOGGING_WEBHOOK_URL!;
export const ANALYTICS_WEBHOOK_URL = process.env.YOUR_AGENT_ANALYTICS_WEBHOOK_URL!;
