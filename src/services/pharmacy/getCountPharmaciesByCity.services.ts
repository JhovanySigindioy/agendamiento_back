import { connectToDatabase } from "../../config/dbPool";
import { logger } from "../../utils/logger";

export async function getCountPharmaciesByCityServices() {
    try {
        const pool = await connectToDatabase();
        const request = pool.request();

        const query = `
            SELECT
                FP.Ciudad AS city,
                COUNT(FP.IdBatallon) AS pharmacyCount
            FROM
                FarmaciasPonal AS FP
            GROUP BY
                FP.Ciudad
            ORDER BY
                PharmacyCount DESC;
        `;

        const result = await request.query(query);
        if (result.recordset.length > 0) {
            return result.recordset;
        }
    } catch (error) {
        logger.error("Error al obtener datos de las farmacias:", error);
        return `Error al obtener datos de las farmacias: ${error instanceof Error ? error.message : error}`
    }
}