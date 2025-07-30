import { Router } from "express";
//importar controladores
const router: Router = Router();

router.get("/", (req, res) => {
    res.status(200).json({ message: "API de autenticación en funcionamiento" });
});

router.get("/auth", ()=>{});


export default router;