import { Request, Response } from "express";
import { saveAppointmentService } from "../../services/appointment/saveAppointment.service";
import { logger } from "../../utils/logger";
import { IAppointmentRequest } from "../../interfaces/appointment/IAppointment";

export const saveAppointmentController = async (req: Request, res: Response): Promise<any> => {
    try {
        const appointment = req.body as IAppointmentRequest;

        if (!appointment) {
            return res.status(400).json({
                success: false,
                error: "No se encontró información de la cita",
                data: null,
            });
        }

        if (!appointment.costCenter || !appointment.company || !appointment.city) {
            return res.status(400).json({
                success: false,
                error: "Faltan datos obligatorios",
                data: null,
            });
        }

        const savedAppointment = await saveAppointmentService(appointment);

        if (!savedAppointment) {
            return res.status(500).json({
                success: false,
                error: "No fue posible agendar la cita, intentalo más tarde",
                data: null,
            });
        }

   
        return res.status(201).json({
            success: true,
            data: savedAppointment,
            error: null,
        });

    } catch (error: unknown) {
        logger.error("Error en saveAppointmentController:", error);

        const message =
            error instanceof Error ? error.message : "Error desconocido al guardar la cita.";

        return res.status(500).json({
            success: false,
            data: null,
            error: message,
        });
    }
};