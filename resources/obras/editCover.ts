import { Request, Response } from "express";

module.exports = (app: any) => ({
    verb: 'post',
    route: '/editCover',
    handler: async (req: Request, res: Response) => {
        const { Home } = app.models;
        const body = req.body;
        const home = await Home.find();
        if (home.length > 0) {
            try {
                await Home.updateOne({ _id: home[0]._id }, {
                    capaObras: body.coverImage
                });
                return res.status(200).json(true)
            } catch (error) {
                console.log(error);
                return false
            }
        }
        return res.status(200).json({ message: "Capa editada com sucesso!" })
    }
})