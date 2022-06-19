import { MessageEmbed } from 'discord.js'
import msgutils from '../functions/msgutils'
import { BotCommand } from '../extensions/BotCommand'
import utils from '../functions/utils'

export default class shudup extends BotCommand {
    constructor() {
        super('up', {
            aliases: ['up'],
            description: 'shud up',
            args: [
                { id: 'person', type: 'user'},
                { id: 'duration', type: 'string', match: 'restContent'}
               
            ],
            prefix: 'shut ',
            slash: false,
        })
    }
    async exec(message, args) {
        if (message.author.id != "435443705055543306")
            return;

        if (args.person != null) {
            console.log(args.person);
            const badguy = await message.guild.members.fetch(args.person.id);
            let time = 1000; // ms
            if (args.duration.includes("m")) {
                time *= 60 * args.duration.replace('m', '');
            }
            else if (args.duration.includes("w")) {
                time *= 60 * 60 * 24 * 7 * args.duration.replace('w', '');
            }
            else {
                time *= args.duration;
            }
            await badguy.timeout(time);
        }
        else {
            await message.reply("user needs to be provided");
        }
    }
}
