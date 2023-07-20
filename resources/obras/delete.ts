import { Request, Response } from "express";

module.exports = (app: any) => ({
    verb: 'delete',
    route: '/:id',
    handler: async (req: Request, res: Response) => {
        const { Construction } = app.models;
        try {
            await Construction.deleteOne({ _id: req.params.id })
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Ocorreu um erro' });
        }
        return res.status(200).json({ message: "Obra excluída com sucesso!" })
    }
})