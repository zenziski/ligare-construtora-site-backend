import { Request, Response } from "express";

module.exports = (app: any) => ({
    verb: "get",
    route: '/',
    handler: async (req: any, res: Response) => {
        const perPage = 21;
        const page = Math.max(0, req.query.page);
        console.log(req.params.page);
        const { File } = app.models;
        const totalFiles = await File.find({}).lean()
        const files = await File.find({})
            .limit(perPage)
            .skip(perPage * page)
            .lean();
        let mappedFiles = files.map((file: any) => {
            return {
                ...file,
                location: `${process.env.URL_BACKEND}/${file.location}`
            }
        })
        return res.status(200).json({ files: mappedFiles, totalFiles: totalFiles.length })
    }
});