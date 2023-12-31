import { Request, Response } from "express";

module.exports = (app: any) => ({
    verb: 'get',
    route: '/',
    anonymous: true,
    handler: async (req: Request, res: Response) => {
        const { Home } = app.models;
        const [data] = await Home.find({}).populate('construction').populate('project').populate('reform').lean();

        return res.status(200).json({ ...data })
    }
})