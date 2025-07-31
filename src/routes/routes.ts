import { Router } from "express";
import { getAllPharmacysController } from "../controllers/getAllPharmacys.controller";
//importar controladores
const router: Router = Router();

router.get("/", (req, res) => {
    res.status(200).json({ message: "API de autenticación en funcionamiento" });
});

router.get("/pharmacys", (req, res) => {
    getAllPharmacysController(res);
});


export default router;