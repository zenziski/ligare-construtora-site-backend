import { Request, Response } from "express";

module.exports = (app: any) => ({
    verb: 'get',
    route: '/',
    anonymous: true,
    handler: async (req: Request, res: Response) => {
        const { Construction } = app.models;
        const data = await Construction.find({}).lean();

        return res.status(200).json(data)
    }
})