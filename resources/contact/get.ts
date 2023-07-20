import { Request, Response } from "express";

module.exports = (app: any) => ({
    verb: 'get',
    route: '/',
    handler: async (req: Request, res: Response) => {
        const { Contact } = app.models;
        const data = await Contact.find({}).lean()

        return res.status(200).json(data)
    }
})