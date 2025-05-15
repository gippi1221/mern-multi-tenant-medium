import 'dotenv/config';
import express from 'express';
import { router } from './routes';
import { MongoService, RedisService } from './services';
import { errorHandler } from './middleware/error';

declare global {
  namespace Express {
    interface Request {
      tenantId?: string;
    }
  }
}

const app = express();
const port = process.env.PORT;

app.use(express.json());

app.use(router);
app.use(errorHandler)

MongoService.connect().then(() => {
  RedisService.connect().then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  });
});
