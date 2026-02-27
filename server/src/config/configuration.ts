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
    jwtSecret: process.env.JWT_ACCESS_SECRET || 'dev-secret',
    jwtExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '1d',

    jwtRefreshToken: process.env.JWT_REFRESH_SECRET || 'dev-super-secret',
    jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '1d',
  },

  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },
});
