import { Request, Response } from "express";

module.exports = (app: any) => ({
    verb: "get",
    route: '/',
    handler: async (req: any, res: Response) => {
        const { File } = app.models;
        const files = await File.find({}).lean();
        let mappedFiles = files.map((file: any) => {
            return {
                ...file,
                location: `${process.env.URL_BACKEND}/${file.location}`
            }
        })
        return res.status(200).json({ files: mappedFiles })
    }
});