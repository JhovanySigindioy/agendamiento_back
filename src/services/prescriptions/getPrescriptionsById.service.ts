import { connectToDatabase } from "../../config";
import { IPrescription } from "../../interfaces";
import { logger } from "../../utils/logger";

export const getPrescriptionsByIdService = async (idPaciente: string): Promise<IPrescription[]> => {
    try {
        const pool = await connectToDatabase();
        const request = pool.request();
        request.input("idPaciente", idPaciente);

        const query = `
            SELECT 
                formula             AS prescription,
                fechaEvolucion      AS creationDate,
                loginProfesional    AS doctor,
                codigoMolecula      AS moleculeCode,
                descripcionInsumos  AS medicine,
                detalleDosis        AS dosage,
                cantidad            AS quantity
            FROM ponalFormulas
            WHERE idPaciente = @idPaciente
              AND DATEDIFF(DAY, fechaEvolucion, GETDATE()) < 30
            ORDER BY formula;
        `;

        const result = await request.query(query);
        const rows = result.recordset;

        if (!rows || rows.length === 0) return [];

        const map: Record<string, IPrescription> = {};

        rows.forEach(row => {
            if (!map[row.prescription]) {
                map[row.prescription] = {
                    prescription: row.prescription,
                    creationDate: row.creationDate,
                    doctor: row.doctor,
                    medications: []
                };
            }

            map[row.prescription].medications.push({
                moleculeCode: row.moleculeCode,
                medicine: row.medicine,
                dosage: row.dosage,
                quantity: row.quantity
            });
        });

        return Object.values(map);

    } catch (error: any) {
        logger.error("Error en getPrescriptionsByIdService:", error);
        throw new Error("No se pudieron obtener las prescripciones.");
    }
};
