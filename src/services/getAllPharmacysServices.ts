import { connectToDatabase } from "../config/dbPool";
import { IDataPharmacy } from "../interfaces/IDataPharmacy";
import { IResponseService } from "../interfaces/IResponseService";
import { logger } from "../utils/logger";

export async function getAllPharmacysServices(): Promise<IResponseService> {
    try {
        const pool = await connectToDatabase();
        const request = pool.request();

        const query = `SELECT IdBatallon, Departamento, Ciudad, Nombre FROM FarmaciasPonal`;
        const result = await request.query(query);

        if (result.recordset.length > 0) {
            return {
                data: result.recordset[0] as IDataPharmacy,
                error: null
            };
        }
        return {
            data: null,
            error: "No se encontraron registros de farmacias"
        };
    } catch (error) {
        logger.error("Error al obtener datos de las farmacias:", error);
        return {
            data: null,
            error: `Error al obtener datos de las farmacias: ${error instanceof Error ? error.message : error}`
        }
    }
}