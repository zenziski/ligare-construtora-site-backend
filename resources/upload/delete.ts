import { Request, Response } from "express";
const fs = require('fs');
const colors = require('colors')
import moment from 'moment';


module.exports = (app: any) => ({
    verb: "delete",
    route: '/',
    handler: async (req: any, res: Response) => {
        const { File } = app.models;
        const { ids } = req.body;
        if (ids.length == 0) {
            return res.status(404).json({ message: "NOT_FOUND" });
        }
        const filesToDelete = await File.find({ _id: { $in: ids } });
        if (filesToDelete.length == 0) {
            console.log(`${colors.green("Nothing to delete...")}`)
            return res.status(200).json({ message: "NOTHING_TO_DELETE" })
        }
        for (const file of filesToDelete) {
            console.log(`${colors.red("Deleting file:")} ${colors.blue(file.name)} AT ${colors.green(moment().format("DD/MM/YYYY HH:mm:ss"))}`)
            fs.unlinkSync(file.location)
        }
        await File.deleteMany({
            _id: { $in: ids }
        });
        return res.status(200).json({ message: "SUCCESS" })
    }
});