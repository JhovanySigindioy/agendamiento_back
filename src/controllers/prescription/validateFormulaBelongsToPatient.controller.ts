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
                error: "Los parámetros identification y prescription son obligatorios."
            });
        }

        const record = await validatePrescriptionBelongsToPatientService(
            identification,
            prescription
        );

        if (!record) {
            return res.status(200).json({
                success: true,
                data: null,
                error: null
            });
        }

        return res.status(200).json({
            success: true,
            data: { prescription: record.formula },
            error: null
        });

    } catch (error: any) {
        logger.error("Error en validatePrescriptionBelongsToPatientController:", error);
        return res.status(500).json({
            success: false,
            data: null,
            error: "Error interno al validar la fórmula."
        });
    }
};
