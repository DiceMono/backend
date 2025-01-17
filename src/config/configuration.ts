export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  els: {
    host: process.env.ELS_HOST || 'localhost',
  },
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10),
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    name: process.env.DATABASE_NAME,
  },
  client: {
    id: process.env.CLIENT_ID,
    secret: process.env.CLIENT_SECRET,
    redirect_url: process.env.REDIRECT_URL,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  auth: {
    url: process.env.AUTH_URL,
    callbackUrl: process.env.CALLBACK_URL,
    callbackFailUrl: process.env.CALLBACKFAIL_URL,
  },
  slack: {
    client_id: process.env.SLACK_CLIENT_ID,
    client_secret: process.env.SLACK_CLIENT_SECRET,
    sign_secret: process.env.SIGNING_SECRET,
    access_token: process.env.BOT_USER_OAUTH_ACCESS_TOKEN,
  },
});
