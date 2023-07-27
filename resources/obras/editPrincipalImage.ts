import { Request, Response } from "express";

module.exports = (app: any) => ({
    verb: 'put',
    route: '/editMainImage',
    handler: async (req: Request, res: Response) => {
        const { Construction } = app.models;
        const { mainImage, _id } = req.body
        try {
            await Construction.updateOne({
                _id
            }, {
                mainImage
            })
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Ocorreu um erro' });
        }

        return res.status(200).json({ message: "Obra editada com sucesso!" })
    }
})