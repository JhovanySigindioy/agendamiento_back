import { connectToDatabase } from "../../config/dbPool";
import {
  IAppointmentRequest,
  IAppointmentResponse
} from "../../interfaces/appointment/IAppointment";
import { logger } from "../../utils/logger";
import * as sql from "mssql";

export async function saveAppointmentServiceCopy(
  appointment: IAppointmentRequest
): Promise<IAppointmentResponse | null> {

  const pool = await connectToDatabase();
  let attempts = 0;

  while (attempts < 2) {
    attempts++;

    const transaction = new sql.Transaction(pool);

    try {
      await transaction.begin(sql.ISOLATION_LEVEL.SERIALIZABLE);
      const request = new sql.Request(transaction);
      request.input("centrocosto", sql.VarChar(10), appointment.costCenter);
      request.input("dia", sql.Date, appointment.day);
      request.input("turno", sql.Int, appointment.turnNumber);

      //  OBTENER TODAS LAS VENTANILLAS DEL CENTRO DE COSTO
      const windowsQuery = `
        SELECT ventanilla
        FROM ventanillasAgendamientoCitas
        WHERE centrocosto = @centrocosto
        ORDER BY ventanilla;
      `;

      const windowsResult = await request.query(windowsQuery);
      const allWindows = windowsResult.recordset.map(w => w.ventanilla);

      // OBTENER VENTANILLAS OCUPADAS PARA ESE TURNO
      const occupiedQuery = `
        SELECT ventanilla
        FROM agendamientoCitas WITH (UPDLOCK, HOLDLOCK)
        WHERE centrocosto = @centrocosto
          AND turno = @turno
          AND dia = @dia;
      `;

      const occupiedResult = await request.query(occupiedQuery);
      const occupiedWindows = occupiedResult.recordset.map(w => w.ventanilla);

      // BUSCAR LA PRIMERA VENTANILLA LIBRE

      const freeWindows = allWindows.filter(w => !occupiedWindows.includes(w));

      if (freeWindows.length === 0) {
        await transaction.rollback();
        return {
          success: false,
          message: "Todas las ventanillas ya están ocupadas para este turno"
        } as any;
      }

      const assignedWindow = freeWindows[0];

      // INSERTAR LA CITA CON ESA VENTANILLA ASIGNADA

      const insertRequest = new sql.Request(transaction);

      // Inputs para el INSERT
      insertRequest.input("centrocosto", sql.VarChar(10), appointment.costCenter);
      insertRequest.input("empresa", sql.VarChar(50), appointment.company);
      insertRequest.input("dia", sql.Date, appointment.day);
      insertRequest.input("ventanilla", sql.SmallInt, assignedWindow);
      insertRequest.input("turno", sql.Int, appointment.turnNumber);
      insertRequest.input("idpaciente", sql.NVarChar(20), appointment.patientId);
      insertRequest.input("nombrepaciente", sql.VarChar(200), appointment.patientName);
      insertRequest.input("formula", sql.VarChar(sql.MAX), appointment.prescription);
      insertRequest.input("fechaproceso", sql.DateTime, appointment.processDate);
      insertRequest.input("fechahoraatencion", sql.DateTime, appointment.attentionDateTime);
      insertRequest.input("estadocita", sql.VarChar(1), appointment.appointmentStatus);
      insertRequest.input("razonestado", sql.VarChar(200), appointment.statusReason);
      insertRequest.input("usuario", sql.VarChar(50), appointment.userName);
      insertRequest.input("anexo", sql.VarChar(sql.MAX), appointment.attachment);
      insertRequest.input("ciudad", sql.VarChar(10), appointment.city);

      const insertQuery = `
        INSERT INTO agendamientoCitas (
          centrocosto, empresa, dia, ventanilla, turno,
          idpaciente, nombrepaciente, formula, fechaproceso,
          fechahoraatencion, estadocita, razonestado,
          usuario, anexo, ciudad
        )
        OUTPUT
          INSERTED.id                      AS id,
          INSERTED.centrocosto             AS costCenter,
          INSERTED.empresa                 AS company,
          INSERTED.dia                     AS day,
          INSERTED.ventanilla              AS windowNumber,
          INSERTED.turno                   AS turnNumber,
          INSERTED.idpaciente              AS patientId,
          INSERTED.nombrepaciente          AS patientName,
          INSERTED.formula                 AS prescription,
          INSERTED.fechaproceso            AS processDate,
          INSERTED.fechahoraatencion       AS attentionDateTime,
          INSERTED.estadocita              AS appointmentStatus,
          INSERTED.razonestado             AS statusReason,
          INSERTED.usuario                 AS userName,
          INSERTED.anexo                   AS attachment,
          INSERTED.ciudad                  AS city
        VALUES (
          @centrocosto, @empresa, @dia, @ventanilla, @turno,
          @idpaciente, @nombrepaciente, @formula, @fechaproceso,
          @fechahoraatencion, @estadocita, @razonestado,
          @usuario, @anexo, @ciudad
        );
      `;

      const result = await insertRequest.query(insertQuery);
      await transaction.commit();

      const appointmentResult = result.recordset[0] as IAppointmentResponse;
      appointmentResult.windowNumber = assignedWindow;

      return appointmentResult;

    } catch (error) {
      if (attempts < 2) continue;
      logger.error("Error al guardar la cita:", error);
      throw error;
    }
  }

  return null;
}
