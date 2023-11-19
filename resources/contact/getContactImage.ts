import { Request, Response } from "express";

module.exports = (app: any) => ({
    verb: 'get',
    route: '/image',
    anonymous: true,
    handler: async (req: Request, res: Response) => {
        const { Contactimage } = app.models;
        try {
            const data = await Contactimage.findOne({}).sort({ createdAt: -1 }).lean()

            return res.status(200).json({ data })
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Ocorreu um erro' });
        }

    }
})