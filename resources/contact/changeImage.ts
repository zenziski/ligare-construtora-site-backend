import { Request, Response } from "express";

module.exports = (app: any) => ({
    verb: 'post',
    route: '/image',
    handler: async (req: Request, res: Response) => {
        const { Contactimage } = app.models;
        const body = req.body;
        try {
            await Contactimage.create({
                name: body.name
            })
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Ocorreu um erro' });
        }
        return res.status(200).json({ message: "Enviado" })
    }
})