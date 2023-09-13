import { Request, Response } from "express";

module.exports = (app: any) => ({
    verb: 'get',
    route: '/slug',
    anonymous: true,
    handler: async (req: Request, res: Response) => { 
        console.log(req.params.id);
                       
        const { Construction } = app.models;
        const data = await Construction.find({}).select({slug: 1, _id: 0}).lean()

        return res.status(200).json(data)
    }
})