import { Request, Response } from "express";

module.exports = (app: any) => ({
    verb: 'get',
    route: '/',
    anonymous: true,
    handler: async (req: Request, res: Response) => {
        const { About } = app.models;
        const [data] = await About.find({}).lean()

        return res.status(200).json({ ...data })
    }
})