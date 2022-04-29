import { BotTasks } from '../extensions/BotTasks'
import { exec } from 'child_process';
import { promisify } from 'util';

const sh = promisify(exec)


export default class extends BotTasks {
    constructor() {
        super("pullRepo", {
            delay: 60000,
            runOnStart: true
        });
    }
    async exec() {
        await this.client.mods.fetch()
        await this.client.packs.fetch()
        await this.client.discords.fetch()
    }
}