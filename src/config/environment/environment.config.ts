export const configuration = () => ({
  NODE_ENV: process.env.NODE_ENV,
  PORT: parseInt(process.env.PORT, 10) || 8000,
  HOST_NAME: process.env.HOST_NAME,
  FRONTEND_URL: process.env.FRONTEND_URL,
  DATABASE_URL: process.env.POSTGRES_HOST,
})
