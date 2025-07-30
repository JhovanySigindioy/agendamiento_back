import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import routesAuth from '../routes/routesAuth';

const appExpress = express();
appExpress.use(morgan('dev'));//Loggs HTTP requests
appExpress.use(express.json());//Respuestas en formato JSON
appExpress.use(cors());//Permite solicitudes desde otros dominios
appExpress.use('api', routesAuth);//Rutas de autenticación

export default appExpress;