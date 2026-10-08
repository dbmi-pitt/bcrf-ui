const ENVS = {
  app: {
    name: process.env.NEXT_PUBLIC_APP_NAME,
  },
  gtm: process.env.NEXT_PUBLIC_GTM,
};

export const getLogLevel = () => {
  const key = 'NEXT_PUBLIC_LOG_LEVEL';
  return process.env[key] || 'error';
};

export const getAppBaseUrl = () => {
  // Dynamic key prevents Next.js from inlining the value at build time.
  const key = 'NEXT_PUBLIC_APP_BASE_URL';
  return process.env[key];
};

export const getContentBannerUrl = () => {
  const key = 'NEXT_PUBLIC_CONTENT_BANNER_URL';
  return process.env[key];
};

export default ENVS;
