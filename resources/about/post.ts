import { Request, Response } from "express";

module.exports = (app: any) => ({
    verb: 'post',
    route: '/',
    handler: async (req: Request, res: Response) => {
        const { text, images } = req.body
        const { About } = app.models
        if (!text && !images) {
            return res.status(404).json({ message: 'NO_DATA' })
        }
        const find = await About.find()
        if (find.length === 0) {
            await About.create({
                text,
                images
            })
            return res.status(200).json({ message: 'SUCCESS' })
        }
        await About.updateOne({
            _id: find[0]._id
        }, {
            text,
            images
        })
        return res.status(200).json({ message: 'SUCCESS' })
    }
})