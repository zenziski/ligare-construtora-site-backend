import { Request, Response } from "express";

module.exports = (app: any) => ({
    verb: 'post',
    route: '/',
    handler: async (req: Request, res: Response) => {
        const { Home } = app.models;
        const body = req.body;
        const home = await Home.find();
        if (home.length > 0) {
            await Home.updateOne({ _id: home[0]._id }, {
                description: body.description,
                construction: { ...body.construcao },
                project: { ...body.projeto },
                reform: { ...body.reforma },
                imagemPrincipal: body.imagemPrincipal
            });
            return res.status(200).json(true)
        }
        await Home.create({
            description: body.description,
            construction: { ...body.construcao },
            project: { ...body.projeto },
            reform: { ...body.reforma },
            imagemPrincipal: body.imagemPrincipal
        });
        return res.status(200).json(true)
    }
})