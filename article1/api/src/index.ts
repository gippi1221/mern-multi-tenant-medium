import 'dotenv/config';
import express from 'express';
import { router } from './routes';
import { MongoService } from './services';

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

MongoService.connect().then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
})