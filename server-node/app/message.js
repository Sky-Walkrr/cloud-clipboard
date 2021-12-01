import config from './config.js';
import fs from 'fs';

const queue = [];
let counter = 0;
const messageLogFile = './message.log'

const messageQueue = {
    queue,
    /**
     * @param {*} item
     */
    enqueue: item => {
        queue.push(item);
        counter++;
        while (queue.length > config.server.history) queue.shift();
        // Write to file
        if (item.data && item.data.type && item.data.type === 'text' && item.data.content) {
            fs.appendFileSync(messageLogFile, `==============\n${item.data.content}\n`);
        }
    },
    /**
     * @return {*}
     */
    dequeue: () => queue.shift(),
    get counter() {
        return counter;
    },
};

export default messageQueue;