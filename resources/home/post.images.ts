import { Request, Response } from "express";

module.exports = (app: any) => ({
    verb: 'post',
    route: '/images',
    handler: async (req: Request, res: Response) => {
        const { images } = req.body
        const { HomeSlider } = app.models

        if (!images) {
            return res.status(404).json({ message: 'NO_DATA' })
        }
        const find = await HomeSlider.find()
        if (find.length === 0) {
            await HomeSlider.create({
                description: '',
                images,
                title: ''
            })
            return res.status(200).json({ message: 'SUCCESS' })
        }
        await HomeSlider.updateOne({
            _id: find[0]._id
        }, {
            images,
        })
        return res.status(200).json({ message: 'SUCCESS' })
    }
})