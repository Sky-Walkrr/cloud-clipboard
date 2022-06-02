import Koa from 'koa';
import fs from 'fs';
import koaCompress from 'koa-compress';
import koaStatic from 'koa-static';
import koaWebsocket from 'koa-websocket';
import os from 'os';
import path from 'path';

import config from './app/config.js';
import httpRouter from './app/http-router.js';
import wsRouter from './app/ws-router.js';
import { getLocalIp } from './app/util.js';

try {
    await fs.promises.rm(path.join(os.tmpdir(), '.cloud-clipboard-storage'), { recursive: true });
} catch {}
await fs.promises.mkdir(path.join(os.tmpdir(), '.cloud-clipboard-storage'));

process.env.VERSION = `node-${JSON.parse(await fs.promises.readFile(path.join(path.resolve(), 'package.json'))).version}`;

const app = koaWebsocket(new Koa);
app.use(koaCompress());
app.use(koaStatic(path.join(path.resolve(), 'static')));
app.use(httpRouter.routes());
app.use(httpRouter.allowedMethods());
app.ws.use(wsRouter.routes());
app.ws.use(wsRouter.allowedMethods());

app.listen(config.server.port);

const autoHost = config.server.autoHost;
// Get local ip automatically 
const localIp = getLocalIp();

if (autoHost && !localIp) {
    console.error(`Failed to get local IP...`);
}

console.log([
    '',
    `Cloud Clipboard ${process.env.VERSION}`,
    'Authorization code' + (config.server.auth ? `: ${Buffer.from(config.server.auth).toString('base64')}` : ' is disabled.'),
    `Server runs on http://${(autoHost && localIp) ? localIp : config.server.host}:${config.server.port}`,
].join('\n'));