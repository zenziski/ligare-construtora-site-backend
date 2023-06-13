import { Request, Response } from "express";
import { ConstructionDTO } from "../../DTO/construction.dto"
const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req: any, file: any, cb: any) {
        cb(null, 'uploads/');
    },
    filename: function (req: any, file: any, cb: any) {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });

module.exports = (app: any) => ({
    verb: "post",
    route: '/',
    handler: async (req: Request, res: Response) => {
        const { Construction } = app.models;
        const constructionData: ConstructionDTO = req.body
        if (!constructionData.name || !constructionData.images) return res.status(500).json({ message: "INCOMPLETE_DATA" })
        return true
    }
});