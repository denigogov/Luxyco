// src/config/configuration.ts
export default () => ({
  app: {
    name: 'luxyco-api',
    env: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '4000', 10),
  },
  database: {
    url: process.env.DATABASE_URL || '',
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET || 'dev-secret',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
});
