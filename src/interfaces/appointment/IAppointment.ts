interface IAppointment {
    id: string;
    costCenter: string;
    company: string;
    day: string;
    windowNumber: string;
    turnNumber: string;
    patientId: string;
    patientName: string;
    prescription: string;
    processDate: string;
    attentionDateTime: string;
    appointmentStatus: string;
    statusReason: string;
    userName: string;
    attachment: string;
    city: string;
}

export type IAppointmentRequest = Omit<IAppointment, "id">;

export type IAppointmentResponse = IAppointment;
