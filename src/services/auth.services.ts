import { connectToDatabase } from "../config/dbPool";
import { logger } from "../utils/logger";
import { IUserAuthenticated } from "../interfaces/res/IUserAutehticated";

export async function authenticateUser(username: string, password: string): Promise<IUserAuthenticated | []> {
    try {
        const pool = await connectToDatabase();
        const request = pool.request();
        //const query = `SELECT username, email, roles, token FROM Usuarios WHERE Usuario = ${username} AND Contraseña = ${password}`;

        const query = `SELECT Nombres, Apellidos  FROM Usuarios WHERE Usuario = ${username} AND Contraseña = ${password}`;
        const result = await request.query(query);

        if (result.recordset.length > 0) {
            return result.recordset[0] as IUserAuthenticated;
        }
        return [];
    } catch (error) {
        logger.error("Error al autenticar usuario:", error);
        throw new Error("Error de conexión a la base de datos");
    }
}