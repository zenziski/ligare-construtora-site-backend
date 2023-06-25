import { Request, Response } from "express";

module.exports = (app: any) => ({
    verb: 'get',
    route: '/',
    handler: async (req: Request, res: Response) => {
        const { HomeSlider } = app.models;
        const data = await HomeSlider.find();

        return res.status(200).json({ data: data[0] })
    }
})