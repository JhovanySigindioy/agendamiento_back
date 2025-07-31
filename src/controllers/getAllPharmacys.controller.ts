
import { Response } from "express";

import { getAllPharmacysServices } from "../services/getAllPharmacysServices"
import { logger } from "../config";

export async function getAllPharmacysController(res: Response): Promise<void> {
    try {
        const { data, error } = await getAllPharmacysServices();
        if (error) {
            logger.error(`Error al obtener datos de farmacia `);
            res.status(500).json({
                error: `Error al obtener datos de farmacia ${error}`,
                data: null,
            });
            return;
        }
        res.status(200).json({
            error: null,
            data,
        });
    } catch (error) {
        logger.error(`Error en el controlador de farmacias: ${error}`);
        res.status(500).json({
            error: `Error en el controlador de farmacias: ${error instanceof Error ? error.message : error}`,
            data: null,
        });
    }
}






