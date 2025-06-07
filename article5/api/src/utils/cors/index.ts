import cors from 'cors';

const isOriginAllowed = (origin: string | undefined): boolean => {
  if (!origin) return false;

  try {
    const { hostname } = new URL(origin);
    return hostname.endsWith('.yourproductiondomain.com') || hostname.endsWith('.localhost.test');
  } catch {
    return false;
  }
};

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }

    if (isOriginAllowed(origin)) {
      callback(null, origin);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

export { corsOptions };
