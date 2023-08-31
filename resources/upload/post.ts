import { Request, Response } from "express";
import { ConstructionDTO } from "../../DTO/construction.dto"
import moment from 'moment';
const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req: any, file: any, cb: any) {
        cb(null, 'uploads/');
    },
    filename: function (req: any, file: any, cb: any) {
        const uniqueSuffix = `${moment().format('YYYY_MM_DD_X')}-${file.originalname}`;
        cb(null, uniqueSuffix); // Set the filename for the uploaded file
    },
});
const upload = multer({ storage: storage });

module.exports = (app: any) => ({
    verb: "post",
    route: '/',
    middlewares: [upload.array("files", 50)],
    handler: async (req: any, res: Response) => {
        if (!req.files) {
            return res.status(422).json({ message: "INCOMPLETE_DATA" })
        }
        const acceptedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.tiff'];
        const { File } = app.models;
        for (const file of req.files) {
            const fileExtension = file.filename.substring(file.filename.lastIndexOf('.')).toLowerCase();
            if (acceptedExtensions.includes(fileExtension)) {
                await File.create({
                    name: file.filename,
                    location: `${file.destination}${file.filename}`
                })
            }
        }
        return res.status(200).json({message: "SUCCESS"})
    }
});