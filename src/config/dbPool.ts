import dbClient from 'mssql'
import { dbConfig } from './dbConfig';
import { logger } from '../utils/logger';

logger.info("Configuración de la base de datos:", JSON.stringify(dbConfig, null, 2));

export const connectToDatabase = async () => {
    try {
        const pool = await dbClient.connect({
            user: dbConfig.db_user,
            password: dbConfig.db_password,
            server: dbConfig.db_host,
            database: dbConfig.db_name,
            port: dbConfig.db_port,
            options: {
                encrypt: true,
                trustServerCertificate: true,
            }
        });
        logger.info("Conexión a la base de datos exitosa");
        return pool;
    } catch (error: unknown) {
        logger.error("Error al intentar conectar a la base de datos:", error);
        throw error;
    }
}