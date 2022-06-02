import Koa from 'koa';
import koaWebsocket from 'koa-websocket';
import {
    networkInterfaces
} from 'os';

/**
 * @param {Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext, any>} ctx
 * @param {Number} [status]
 * @param {Object|Array} [result]
 * @param {String} [msg]
 */
export const writeJSON = (ctx, status = 200, result = {}, msg = '') => {
    ctx.status = status;
    ctx.body = {
        code: status,
        msg,
        result,
    };
};

/**
 * @param {koaWebsocket.Server<any, any>} wsServer
 * @param {*} data
 */
export const wsBoardcast = (wsServer, data) => wsServer.server.clients.forEach(client => client.send(data));

/**
 * @link https://github.com/garycourt/murmurhash-js/blob/master/murmurhash3_gc.js
 * @param {String} str
 * @param {Number} seed
 * @returns {Number}
 */
export const murmurHash = (str, seed) => {
    let remainder = str.length & 3; // str.length % 4
    let bytes = str.length - remainder;
    let h1 = seed;
    let h1b;
    let k1;
    let c1 = 0xcc9e2d51;
    let c2 = 0x1b873593;
    let i = 0;

    while (i < bytes) {
        k1 =
            ((str.charCodeAt(i) & 0xff)) |
            ((str.charCodeAt(++i) & 0xff) << 8) |
            ((str.charCodeAt(++i) & 0xff) << 16) |
            ((str.charCodeAt(++i) & 0xff) << 24);
        ++i;

        k1 = ((((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16))) & 0xffffffff;
        k1 = (k1 << 15) | (k1 >>> 17);
        k1 = ((((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16))) & 0xffffffff;

        h1 ^= k1;
        h1 = (h1 << 13) | (h1 >>> 19);
        h1b = ((((h1 & 0xffff) * 5) + ((((h1 >>> 16) * 5) & 0xffff) << 16))) & 0xffffffff;
        h1 = (((h1b & 0xffff) + 0x6b64) + ((((h1b >>> 16) + 0xe654) & 0xffff) << 16));
    }

    k1 = 0;

    switch (remainder) {
        case 3:
            k1 ^= (str.charCodeAt(i + 2) & 0xff) << 16;
        case 2:
            k1 ^= (str.charCodeAt(i + 1) & 0xff) << 8;
        case 1:
            k1 ^= (str.charCodeAt(i) & 0xff);
            k1 = (((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16)) & 0xffffffff;
            k1 = (k1 << 15) | (k1 >>> 17);
            k1 = (((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16)) & 0xffffffff;
            h1 ^= k1;
    }

    h1 ^= str.length;

    h1 ^= h1 >>> 16;
    h1 = (((h1 & 0xffff) * 0x85ebca6b) + ((((h1 >>> 16) * 0x85ebca6b) & 0xffff) << 16)) & 0xffffffff;
    h1 ^= h1 >>> 13;
    h1 = ((((h1 & 0xffff) * 0xc2b2ae35) + ((((h1 >>> 16) * 0xc2b2ae35) & 0xffff) << 16))) & 0xffffffff;
    h1 ^= h1 >>> 16;

    return h1 >>> 0;
};


export const getLocalIp = () => {
    const nets = networkInterfaces();

    // const results = Object.create(null); // Or just '{}', an empty object
    // for (const name of Object.keys(nets)) {
    //     for (const net of nets[name]) {
    //         // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
    //         // 'IPv4' is in Node <= 17, from 18 it's a number 4 or 6
    //         const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4
    //         if (net.family === familyV4Value && !net.internal) {
    //             if (!results[name]) {
    //                 results[name] = [];
    //             }
    //             results[name].push(net.address);
    //         }
    //     }
    // }
    // console.log(results['WLAN'][0]);


    // Tested on Window 10
    const netInfoList = nets['WLAN'];
    // console.log(netInfoList);
    if (Array.isArray(netInfoList) && netInfoList.length > 0) {
        const netInfo = netInfoList.find(net => {
            const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4
            return net.family === familyV4Value && !net.internal;
        });
        return netInfo ? netInfo.address : '';
    }
    return '';

}