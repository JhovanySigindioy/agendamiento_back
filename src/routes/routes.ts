import { Router } from "express";
import { getPrescriptionsByIdController } from "../controllers/prescription/getPrescriptions.controller";
import { validatePrescriptionBelongsToPatientController } from "../controllers/prescription/validateFormulaBelongsToPatient.controller";

//importar controladores
const router: Router = Router();

router.get("/", (req, res) => {
    res.status(200).json({ message: "API de autenticación en funcionamiento" });
});

//router.get("/pharmacies", getAllPharmacysController);
router.get("/prescriptions/:identification", getPrescriptionsByIdController);
router.get("/validate/:identification/:prescription", validatePrescriptionBelongsToPatientController);

export default router;