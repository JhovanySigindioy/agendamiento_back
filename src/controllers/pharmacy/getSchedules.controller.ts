
import { Request, Response } from "express";
import { logger } from "../../utils/logger";
import { getSchedulesServices } from "../../services/pharmacy/getSchedules.services";
import { toAmPm } from "../../utils/toAmPm";
import { ISchedulePharmacy } from "../../interfaces/pharmacy/ISchedule";

export const getSchedulesController = async (req: Request, res: Response): Promise<any> => {
    try {
        const { IdPharmacy, DateSelected } = req.params;

        if (!IdPharmacy) {
            return res.status(400).json({
                success: false,
                data: null,
                error: "El identificador de la farmacia es obligatorio."
            });
        }

        const result: ISchedulePharmacy[] | null = await getSchedulesServices(IdPharmacy, DateSelected);

        if (!result) {
            logger.info(`No se encontraron turnos registrados para la farmacia.`);
            return res.status(200).json({
                success: true,
                data: [],
                error: null,
            });
        }

        const formatted: ISchedulePharmacy[] = result.map((item) => ({
            ...item,
            StartTime: toAmPm(item.StartTime) || "",
            EndTime: toAmPm(item.EndTime) || "",
        }));

        return res.status(200).json({
            success: true,
            data: formatted,
            error: null
        });

    } catch (error: unknown) {
        logger.error("Error en getSchedulesController:", error);

        const message =
            error instanceof Error
                ? error.message
                : "Error desconocido al obtener los turnos de la farmacia.";

        return res.status(500).json({
            success: false,
            data: null,
            error: message
        });
    }
};
