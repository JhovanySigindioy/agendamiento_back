// src/services/prescriptions/validateFormulaBelongsToPatient.service.ts
import { connectToDatabase } from "../../config";
import { logger } from "../../utils/logger";

export const validatePrescriptionBelongsToPatientService = async (idPaciente: string, formula: string) => {
    try {
        const pool = await connectToDatabase();
        const request = pool.request();

        request.input("idPaciente", idPaciente);
        request.input("formula", formula);

        const query = `
            SELECT TOP 1 *
            FROM ponalFormulas
            WHERE idPaciente = @idPaciente
              AND formula = @formula;
        `;

        const result = await request.query(query);

        // Si no existe, retornamos null para que el controller lo interprete
        return result.recordset.length > 0 ? result.recordset[0] : null;

    } catch (error: any) {
        logger.error("Error en validateFormulaBelongsToPatientService:", error);
        throw new Error("Error al validar la fórmula del paciente.");
    }
};
