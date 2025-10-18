import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './config/schema.tsx',
  dialect: 'postgresql',
  dbCredentials: {
    url: "postgresql://neondb_owner:npg_zWIyGVxLd8Y6@ep-plain-cloud-a8y9pe1d-pooler.eastus2.azure.neon.tech/neondb?sslmode=require&channel_binding=require" || DATABASE_URL,
  },
});
