import { Request, Response } from "express";
const util = require('util')
const colors = require('colors')

module.exports = (app: any) => {
    return async (req: Request, res: any, next: () => void) => {
        console.log(`[${colors.green(req.method)}] - ${req.path} \n${colors.blue("Body")}: ${util.inspect(req.body)}`);
        const originalStatus = res.status;
        res.status = function (body: any) {
            let errorStatus = body >= 400
            console.log(`[${colors.green(req.method)}] - ${req.path} - ${errorStatus ? colors.red(body) : colors.green(body)}`);
            originalStatus.call(this, body);
            return res
        };
        next();
    }
};