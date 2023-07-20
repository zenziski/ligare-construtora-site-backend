import { Request, Response } from "express";

module.exports = (app: any) => ({
    verb: 'get',
    route: '/:id',
    anonymous: true,
    handler: async (req: Request, res: Response) => {
        const { Construction } = app.models;
        const data = await Construction.findOne({ slug: req.params.id }).populate('vinculo').lean();

        return res.status(200).json({ ...data })
    }
})