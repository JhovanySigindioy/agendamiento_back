import { connectToDatabase } from "../../config/dbPool";
import { ISchedulePharmacy } from "../../interfaces/pharmacy/ISchedule";
import { logger } from "../../utils/logger";
import * as sql from "mssql";

export async function getSchedulesServices(IdPharmacy: string, DateSelected: string): Promise<ISchedulePharmacy[] | null> {
    try {
        const pool = await connectToDatabase();
        const request = pool.request();

        request.input("bodega", sql.VarChar(10), IdPharmacy);
        request.input("fecha", sql.DateTime2, DateSelected);

        const query = `
            SELECT 
                t.centrocosto AS PharmacyId,
                t.turnodia AS TurnNumber,
                CONVERT(VARCHAR(5), t.desde, 108) AS StartTime,
                CONVERT(VARCHAR(5), t.hasta, 108) AS EndTime,

                CASE 
                    WHEN (
                        SELECT COUNT(*) 
                        FROM agendamientoCitas a
                        WHERE a.centrocosto = t.centrocosto
                        AND a.turno = t.turnodia
                        AND a.dia = @fecha
                    ) >= (
                        SELECT COUNT(*) 
                        FROM ventanillasAgendamientoCitas v
                        WHERE v.centrocosto = t.centrocosto
                    )
                    THEN 0    -- No disponible: todas las ventanillas ocupadas
                    ELSE 1    -- Disponible: aún hay ventanillas libres
                END AS AvailableShift

            FROM turnosagendamientoCitas t
            WHERE t.centrocosto = @bodega;

        `;

        const result = await request.query(query);

        return result.recordset.length > 0 ? result.recordset : null;

    } catch (error: unknown) {
        logger.error("Error al obtener los turnos de la farmacia:", error);
        throw error;
    }
}