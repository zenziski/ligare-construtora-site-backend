import { Request, Response } from "express";

module.exports = (app: any) => ({
    verb: 'post',
    route: '/',
    anonymous: true,
    handler: async (req: Request, res: Response) => {
        const { Contact } = app.models;
        const body = req.body;
        try {
            await Contact.create({
                name: body.name,
                phone: body.phone,
                description: body.description
            })
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Ocorreu um erro' });
        }
        return res.status(200).json({ message: "Enviado" })
    }
})