const ENVS = {
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME,
  },
  logLevel: process.env.NEXT_PUBLIC_LOG_LEVEL || 'error',
  gtm: process.env.NEXT_PUBLIC_GTM,
};

export default ENVS;
