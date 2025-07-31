
import { Request, Response } from "express";
import { getAllPharmacysServices } from "../services/getAllPharmacysServices";

export async function getAllPharmacysController(req: Request, res: Response): Promise<void> {
    try {
        const { data, error } = await getAllPharmacysServices();
        if (error) {
            res.status(500).json({ error, data: null });
            return;
        }
        res.status(200).json({ error: null, data });
    } catch (error: any) {
        res.status(500).json({ error: error.message || error, data: null });
    }
}