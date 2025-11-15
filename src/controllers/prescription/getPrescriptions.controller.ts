
import { Request, Response } from "express";
import { getPrescriptionsByIdService } from "../../services/prescriptions/getPrescriptionsById.service";
import { logger } from "../../utils/logger";

export const getPrescriptionsByIdController = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { identification } = req.params;

        if (!identification || identification.trim().length === 0) {
            logger.warn("Solicitud inválida: identification faltante.");
            return res.status(400).json({
                success: false,
                data: null,
                error: "El parámetro identification es obligatorio."
            });
        }

        const formulas = await getPrescriptionsByIdService(identification);

        if (formulas.length === 0) {
            logger.info(`No se encontraron fórmulas para el paciente ${identification}.`);

            return res.status(200).json({
                success: true,
                data: [],
                error: null,
            });
        }

        return res.status(200).json({
            success: true,
            data: formulas,
            error: null
        });

    } catch (error: unknown) {
        logger.error("Error en getPrescriptionsByIdController:", error);

        const message =
            error instanceof Error
                ? error.message
                : "Error desconocido al obtener las prescripciones.";

        return res.status(500).json({
            success: false,
            data: null,
            error: `Error al obtener las prescripciones: ${message}`
        });
    }
};
