import dotenv from 'dotenv';
import { IDbConfig } from '../interfaces';

dotenv.config();

export const dbConfig: IDbConfig = {
    db_dialect: 'mssql',
    db_user: process.env.DB_USER || "",
    db_host: process.env.DB_HOST || "",
    db_password: process.env.DB_PASSWORD || "",
    db_name: process.env.DB_NAME || "",
    db_port: parseInt(process.env.DB_PORT || '1433'),
}
