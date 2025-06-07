import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import cookieParser from 'cookie-parser';
import { router } from './routes';
import { MongoService, RedisService } from './services';
import { errorHandler } from './middleware/error';
import { corsOptions } from './utils/cors';

declare global {
  namespace Express {
    interface Request {
      tenantId?: string;
      userId?: string;
    }
  }
}

const app = express();
const port = process.env.PORT;

app.use(cookieParser());
app.use(express.json());
app.use(cors(corsOptions));

app.use(router);
app.use(errorHandler);

MongoService.connect().then(() => {
  RedisService.connect().then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  });
});
