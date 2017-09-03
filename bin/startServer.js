#!/usr/bin/env node

/**
 * YJC <yangjiecong@live.com> @2017-08-25
 */

'use strict';

const fs = require('fs');
const path = require('path');
const promisify = require('util').promisify;

const CMDS = {
    start: 'start',
    create: 'create'
};

function usage() {
    console.log(`Usage

    cd your-server-root-directory
    server-k ${CMDS.start} [router-directory] [--listen=port-or-sock-file] [--name=serverName]

or

    server-k ${CMDS.create} your-server-root-directory [--listen=port-or-sock-file] [--name=serverName]`);
}

async function resolveServerPath(basePath) {
    let stat;
    basePath = path.resolve(basePath);
    let p = path.resolve(basePath, 'node_modules/@yjc/server-k/lib/Server.js');
    try {
        stat = await promisify(fs.stat)(p);
    } catch (e) {}
    if (stat && stat.isFile()) {
        return p;
    }
    if (path.resolve(basePath, '/') === basePath) {
        return;
    }
    return await resolveServerPath(path.resolve(basePath, '..'));
}

async function start(rootDir, argv) {
    const configFile = path.resolve(rootDir, 'server-k.config.js');

    let startOptions;
    let cStat;
    let sBasePath;
    try {
        cStat = await promisify(fs.stat)(configFile);
    } catch (e) {}
    if (cStat && cStat.isFile()) {
        startOptions = configFile;
        sBasePath = path.dirname(configFile);
    } else {
        startOptions = {
            serverName: argv.name || `server-k@${new Date().toJSON()}`,
            listen: argv.listen || 3080,
            dir: {
                base: rootDir,
                router: argv._[1] || '.'
            }
        };
        sBasePath = path.resolve(rootDir, startOptions.dir.router);
    }

    let libServerPath = await resolveServerPath(sBasePath);

    if (!libServerPath) {
        throw new Error(`Can't find local @yjc/server-k codes. Run \`npm i @yjc/server-k\` to install locally.`);
    }

    const Server = require(libServerPath);
    await new Server().start(startOptions);

}

async function create(cwd, argv) {
    let rootDir = argv._[1];
    if (!rootDir) {
        return console.error(`undefined server-root-directory\ndo nothing`);
    }
    rootDir = path.resolve(cwd, rootDir);
    let stat;
    try {
        stat = await promisify(fs.stat)(rootDir);
    } catch (e) {}
    if (stat && stat.isDirectory()) {
        return console.error(`directory exists: ${rootDir}\ndo nothing`);
    }

    const {Router, Controller} = require('@yjc/server-k');

    class Demo extends Controller {

        async helloWorld(ctx) {
            ctx.body = await this.render({
                title: 'DEMO',
                mainContainer: 'Hello World!'
            }, 'demo');
        }

    }

    class Index extends Router {

        constructor(r) {
            super(r);
            this.demo = new Demo(r);
        }

        main() {
            return this.GET(false, this.demo.helloWorld);
        }

    }

    const statementRouter = `const {Router} = require('@yjc/server-k');\n`;
    const statementController = `const {Controller} = require('@yjc/server-k');\n`;
    const statementCDemo = `const Demo = require('../controller/Demo');\n`;

    const printComment = function (comment) {
        return `/*
 * ${comment}
 */

'use strict';

`;
    };

    const exportClass = function (c) {
        return `${c.toString().replace(/\n    /g, '\n')}\n\nmodule.exports = ${c.name};\n`;
    };

    const dirs = {
        router: {
            'Index.js': `${printComment('Router Class')}${statementRouter}${statementCDemo}\n${exportClass(Index)}`
        },
        controller: {
            'Demo.js': `${printComment('Controller Class')}${statementController}\n${exportClass(Demo)}`
        },
        model: {},
        template: {
            'demo.mustache': await promisify(fs.readFile)(`${__dirname}/../demo/template/index.mustache`)
        },
        config: {},
        static: {},
        log: {},
        node_modules: {}
    };

    const options = function (serverName, listen, module) {
        const sUtil = require('@yjc/server-k/util');

        module.exports = sUtil.getServerConfig({
            serverName: `${serverName}`,
            dir: {
                base: '.',
                router: 'router',
                controller: 'controller',
                model: 'model',
                template: 'template',
                config: 'config',
                static: 'static',
                log: 'log'
            },
            listen: `${listen}`
        }, {
            dev: {
                // specific options for development
            },
            [sUtil.ENV_PRODUCTION]: {
                // specific options for production environment
                logFile: {
                    runtimeError: 'log/error.log'
                }
            }
        });

        return options.toString().trim()
            .replace(/^function \(.+\n/, '')
            .replace(/\n\s*return[\s\S]+/, '')
            .replace(/\n        /g, '\n')
            .replace('`${serverName}`', JSON.stringify(serverName))
            .replace('`${listen}`', JSON.stringify(listen))
            .trim()
            + '\n';
    };

    let serverName = argv.name || 'demo';

    await promisify(fs.mkdir)(rootDir);
    await promisify(fs.writeFile)(
        `${rootDir}/server-k.config.js`,
        printComment('Server Options') + options(serverName, argv.listen || 3080, {}),
        'utf8'
    );
    for (let name in dirs) {
        await promisify(fs.mkdir)(`${rootDir}/${name}`);
        for (let file in dirs[name]) {
            await promisify(fs.writeFile)(`${rootDir}/${name}/${file}`, dirs[name][file], 'utf8');
        }
    }

    console.log(`Running npm install ...`);
    let r = await promisify(require('child_process').exec)('npm i @yjc/server-k', {
        cwd: path.resolve(rootDir, 'node_modules')
    });
    console.log(r.stdout);

    console.log(`Create server [${serverName}] done. Now starting ...`);

    await start(rootDir);

    console.log(`Server started

Run these commands to restart server:

    cd ${rootDir}
    server-k start`);
}

module.exports = async function () {
    let argv = require('minimist')(process.argv.slice(2));

    const cmd = argv._[0];

    const cwd = process.cwd();

    switch (cmd) {
        case CMDS.start:
            try {
                await start(cwd, argv);
            } catch (e) {
                console.error(e);
            }
            break;
        case CMDS.create:
            try {
                await create(cwd, argv);
            } catch (e) {
                console.error(e);
            }
            break;
        default:
            return usage();
    }
};

module.parent === null && module.exports();
