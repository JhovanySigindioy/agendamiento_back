import { Request, Response } from "express";
import { logger } from "../../utils/logger";
import { validatePrescriptionBelongsToPatientService } from "../../services/prescriptions";

export const validatePrescriptionBelongsToPatientController = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const { identification, prescription } = req.params;
        if (!identification || !prescription) {
            return res.status(400).json({
                success: false,
                data: null,
                error: "Los parámetros 'identification' y 'prescription' son obligatorios."
            });
        }

        const result = await validatePrescriptionBelongsToPatientService(
            identification,
            prescription
        );

        if (!result) {
            return res.status(404).json({
                success: false,
                data: null,
                error: "Fórmula o paciente no encontrado, o la fórmula no pertenece al paciente."
            });
        }

        return res.status(200).json({
            success: true,
            data: {
                idPaciente: result.idPaciente,
                formula: result.formula,
            },
            error: null
        });

    } catch (error: unknown) {
        logger.error("Error en validatePrescriptionBelongsToPatientController:", error);
        const errorMessage = error instanceof Error ? error.message : "Error interno del servidor";
        return res.status(500).json({
            success: false,
            data: null,
            error: errorMessage
        });
    }
};