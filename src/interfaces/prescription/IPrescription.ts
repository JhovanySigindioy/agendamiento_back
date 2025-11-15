import { IMedication } from "./IMedication";

export interface IPrescription {
    prescription: string;
    creationDate: Date;
    doctor: string;
    medications: IMedication[];
}