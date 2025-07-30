import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import router from './routes';
import env from './constants/env';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middleware/error-handler';

dotenv.config();

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

app.use('/api', router);

app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`App running on port:${env.PORT}`);
});

export default app;
