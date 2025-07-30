import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(cors());
//app.use('api/v1', router);

export default app;