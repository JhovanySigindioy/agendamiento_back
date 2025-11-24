import { Router } from "express";
import { getPrescriptionsByIdController } from "../controllers/prescription/getPrescriptions.controller";
import { validatePrescriptionBelongsToPatientController } from "../controllers/prescription/validateFormulaBelongsToPatient.controller";
import { getPharmaciesController } from "../controllers/pharmacy/getPharmacies.controller";
import { getCountPharmaciesByCityController } from "../controllers/pharmacy/getCountPharmaciesByCity.controller";
import { getSchedulesController } from "../controllers/pharmacy/getSchedules.controller";
import { saveAppointmentController } from "../controllers/appointment/saveAppointment.controller";

//importar controladores
const router: Router = Router();

//Consultas
router.get("/prescriptions/:identification", getPrescriptionsByIdController);
router.get("/validate/:identification/:prescription", validatePrescriptionBelongsToPatientController);
router.get("/pharmacies/count", getCountPharmaciesByCityController);
router.get("/pharmacies", getPharmaciesController);
router.get("/schedules/:IdPharmacy/:DateSelected", getSchedulesController);

//Inserciones
router.post("/appointment", saveAppointmentController);

export default router;