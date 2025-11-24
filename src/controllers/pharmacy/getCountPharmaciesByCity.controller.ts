
import { Request, Response } from "express";
import { logger } from "../../utils/logger";
import { getCountPharmaciesByCityServices } from "../../services/pharmacy/getCountPharmaciesByCity.services";

export const getCountPharmaciesByCityController = async (req: Request, res: Response): Promise<any> => {
    try {

        const result = await getCountPharmaciesByCityServices();
        if (!result) {
            logger.info(`No se encontraron farmacias.`);

            return res.status(200).json({
                success: true,
                data: [],
                error: null,
            });
        }

        return res.status(200).json({
            success: true,
            data: result,
            error: null
        });
    } catch (error: unknown) {
        logger.error("Error en getCountPharmaciesByCityController:", error);

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
