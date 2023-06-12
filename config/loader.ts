import fs from 'fs';
import path from 'path';

function capitalizeFirstLetter(string: string) {
    let slices = string.split('_');
    let finalString = "";

    slices.forEach((slice: string) => {
        slice = slice.replace('_', '');
        finalString += slice.charAt(0).toUpperCase() + slice.slice(1).toLowerCase();
    });

    return finalString;
}

export default (modelsPath: string, loaderParam?: any) => {
    let ret: any = {};

    fs.readdirSync(modelsPath).forEach(n => {
        let resourceName = capitalizeFirstLetter(n.replace('.ts', ''));
        let item = require(path.join(modelsPath, n));

        if (loaderParam) {
            ret[resourceName as keyof typeof ret] = item(loaderParam);
        } else {
            ret[resourceName as keyof typeof ret] = item;
        }
    });

    return ret;
};