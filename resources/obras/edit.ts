import { Request, Response } from "express";

module.exports = (app: any) => ({
    verb: 'post',
    route: '/edit',
    handler: async (req: Request, res: Response) => {
        const { Construction } = app.models;
        const body = req.body;
        try {
            await Construction.updateOne({ _id: body._id }, {
                slug: body.slug,
                name: body.name,
                type: body.type,
                images: body.images,
                data: body.data,
                vinculo: body.vinculo,
                ordem: body.ordem
            })
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Ocorreu um erro' });
        }
        return res.status(200).json({ message: "Obra editada com sucesso!" })
    }
})