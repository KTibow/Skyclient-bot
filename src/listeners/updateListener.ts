import { exec } from 'child_process';
import { promisify } from 'util';
import { BotListener } from '../extensions/BotListener';
const sh = promisify(exec)
class autoUpdateListener extends BotListener {
    constructor() {
        super('autoUpdateListener', {
            emitter: 'client',
            event: 'messageCreate'
        });
    }

    async exec(message) {
        if (message.channel.id == '882430915035418675') {
            const gitPullCommand = this.client.commandHandler.modules.find(cmd => (cmd.id == 'gitPull'))

            const regex = /\[Rain-TEMP:master\] [0-9]+ new commits?/g
            if (message.embeds[0] && regex.test(message.embeds[0].title)) {

                gitPullCommand.exec(message, '').then(async () => {
                    await sh('pm2 restart 0')
                })
            }
        }
    }
}

module.exports = autoUpdateListener;