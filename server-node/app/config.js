import fs from 'fs';
import path from 'path';

/**
 * @type {{
 *  server: {
 *      host: String,
 *      port: Number,
 *      wss: Boolean,
 *      history: Number,
 *      auth: Boolean,
 *      autoHost: Boolean
 *  },
 *  text: {
 *      limit: Number,
 *  },
 *  file: {
 *      expire: Number,
 *      chunk: Number,
 *      limit: Number,
 *  },
 * }}
 */
const config = JSON.parse(await fs.promises.readFile(path.join(process.cwd(), 'config.json')));

if (config.server.auth === true) {
    config.server.auth = Math.floor(Math.random() * 1000000).toString().padStart(6, 0);
}
if (config.server.auth) {
    config.server.auth = config.server.auth.toString()
}

export default config;