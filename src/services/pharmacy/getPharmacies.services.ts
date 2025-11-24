import { connectToDatabase } from "../../config/dbPool";
import { logger } from "../../utils/logger";

export async function getPharmaciesServices() {
    try {
        const pool = await connectToDatabase();
        const request = pool.request();

        // const query = `
        //    SELECT
        //         FP.IdBatallon                           AS IdPharmacy,
        //         FP.Departamento                         AS Department,
        //         FP.Ciudad                               AS City,
        //         FP.Nombre                               AS Name,
        //         DPP.horario_dias_habiles_drogueria      AS BusinessDaySchedule,
        //         DPP.horario_dias_Festivos_drogueria     AS HolidaySchedule,
        //         DPP.direccion_drogueria                 AS Address,
        //         DPP.telefonos_drogueria                 AS Phone
        //     FROM
        //         FarmaciasPonal AS FP
        //     INNER JOIN
        //         dw__dim_pos AS DPP 
        //     ON
        //         FP.IdBatallon = DPP.pos;
        // `;

        const query = `
            SELECT
                    FP.IdBatallon                           AS IdPharmacy,
                    FP.Departamento                         AS Department,
                    FP.Ciudad                               AS City,
                    DPP.codigo_ciudad                       AS CityCode,
                    FP.Nombre                               AS Name,
                    DPP.horario_dias_habiles_drogueria      AS BusinessDaySchedule,
                    DPP.horario_dias_Festivos_drogueria     AS HolidaySchedule,
                    DPP.direccion_drogueria                 AS Address,
                    DPP.telefonos_drogueria                 AS Phone
                FROM
                    FarmaciasPonal AS FP
                INNER JOIN
                    dw__dim_pos AS DPP 
                ON
                    FP.IdBatallon = DPP.pos;
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