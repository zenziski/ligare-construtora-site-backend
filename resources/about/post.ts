import { Request, Response } from "express";

module.exports = (app: any) => ({
    verb: 'post',
    route: '/',
    handler: async (req: Request, res: Response) => {
        const { About } = app.models;
        const body = req.body;
        const about = await About.find();
        if (about.length > 0) {
            try {
                await About.updateOne({ _id: about[0]._id }, {
                    whoWeAre: body.whoWeAre,
                    team: body.team,
                    imagemPrincipal: body.imagemPrincipal
                });
                return res.status(200).json(true)
            } catch (error) {
                console.log(error);
                return false
            }
        }
        await About.create({
            whoWeAre: body.whoWeAre,
            team: body.team,
            imagemPrincipal: body.imagemPrincipal
        });
        return res.status(200).json(true)
    }
})