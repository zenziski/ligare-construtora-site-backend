import { Request, Response } from "express";

module.exports = (app: any) => ({
    verb: 'post',
    route: '/',
    handler: async (req: Request, res: Response) => {
        const { Construction } = app.models;
        const body = req.body;
        const construction = await Construction.findOne({ slug: body.slug, type: body.type }).lean();
        if (construction) return res.status(500).json({ message: 'Já existe uma obra com esse SLUG.' });
        try {
            await Construction.create({
                slug: body.slug,
                name: body.name,
                type: body.type,
                images: body.images,
                data: body.data,
                vinculo: body.vinculo
            })
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Ocorreu um erro' });
        }
        return res.status(200).json({ message: "Obra criada com sucesso!" })
    }
})