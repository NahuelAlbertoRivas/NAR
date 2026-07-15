import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: Number(process.env.PORT ?? 3000),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  supabaseUrl: process.env.SUPABASE_URL ?? '',
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
  adminApiKey: process.env.ADMIN_API_KEY ?? process.env.ADMIN_KEY ?? 'portfolio-admin-key',
  corsOrigin: process.env.CORS_ORIGIN ?? '',
};
