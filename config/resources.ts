import fs from 'fs';
import path from 'path';
import pluralize from 'pluralize';

interface IOptions {
    middlewares?: any;
    authentication?: boolean;
    log?: any,
    directory: string,
    pipes?: any
}

let mappedCount = 0;

let options: IOptions = {
    directory: ''
};

export default (app: any, opts: IOptions) => {
    options = opts;
    mapFolder(app, opts.directory, '');
    console.log(`${mappedCount} routes mapped`)
}

let log = (msg: string) => {
    if (options.log) options.log(msg);
}

let mapFolder = (app: { [x: string]: (arg0: any, arg1: any, arg2: any) => void; }, currentPath: string, prefix: string): void => {
    try {
        let currentResourceName: any = currentPath.split(/\W+/gi).pop();

        let actions: string[] = [];
        let folders: string[] = [];

        fs.readdirSync(currentPath).map(n => path.join(currentPath, n)).forEach(it => {
            if (it.endsWith('.ts') || it.endsWith('js')) actions.push(it);
            if (fs.lstatSync(it).isDirectory()) folders.push(it);
        });

        let routesToMap: any = [];

        actions.forEach(action => {
            let {
                verb,
                route,
                handler,
                deep,
                member,
                anonymous,
                middlewares,
                ...pipesConfig
            } = require(action)(app);

            if (!middlewares) middlewares = [];

            for (let pipe in (options.pipes || {})) {
                let pipeConfig = pipesConfig[pipe];

                if (pipeConfig) {
                    middlewares.unshift(options.pipes[pipe](pipeConfig));
                }
            }

            if (options.middlewares) middlewares.unshift(...options.middlewares);

            if (!(anonymous || false) && options.authentication) middlewares.unshift(options.authentication);

            if (deep === undefined) deep = true;
            if (member === undefined) member = true;

            let fullRoute = `/${currentResourceName}${route}`;
            

            if (deep) fullRoute = `${prefix}${route}`;

            if (!member) {
                const prefixes = prefix.split('/')
                const currentResourceIndex = prefixes.indexOf(currentResourceName)
                prefixes.splice(currentResourceIndex - 1, 1)
                const prefixWithoutMember = prefixes.join('/')

                fullRoute = `${prefixWithoutMember}${route}`;
            }
            console.log(`${verb} - ${fullRoute}`);
            routesToMap.push({
                verb: verb || 'get',
                route: fullRoute,
                middlewares: [...middlewares],
                handler: async (req: any, res: any) => {
                    try {
                        return await handler(req, res);
                    } catch (err: any) {
                        log('Err: ' + err.message);
                        return res.status(500).send({ message: err.message });
                    }
                }
            })

            log(`[${verb}] ${fullRoute}`)
            mappedCount++;
        });

        let sizesCache: any = {};
        routesToMap.sort((a: { route: any; }, b: { route: any }) => {
            let aSize: any = sizesCache[a.route as keyof typeof sizesCache]
            let bSize: any = sizesCache[b.route as keyof typeof sizesCache];

            if (!aSize) aSize = sizesCache[a.route] = a.route.split(':').length;
            if (!bSize) bSize = sizesCache[b.route] = b.route.split(':').length;

            return aSize - bSize;
        }).forEach((route: { verb: string | number; route: any; middlewares: any; handler: any; }) => {
            app[route.verb](route.route, route.middlewares, route.handler);
        });

        folders.forEach(folder => {
            let pathName = folder.split(/\W+/gi).pop();

            let newPrefix = prefix === '' ? `${prefix}/${pathName}` : `${prefix}/:${pluralize.singular(currentResourceName)}/${pathName}`;

            mapFolder(app, folder, newPrefix);
        });
    } catch (err: any) {
        log("Impossible map routes at " + currentPath);
        log(err);
    }
}