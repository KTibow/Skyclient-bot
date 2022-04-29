import { MessageEmbed } from 'discord.js'
import { BotCommand } from '../../extensions/BotCommand'

import importUtils from '../../functions/utils'
const utils = importUtils

export default class say extends BotCommand {
	constructor() {
		super('say', {
			aliases: ['say'],
			args: [{ id: 'thingtosay', type: 'string', match: 'restContent' }],
			slash: true,
			description: 'Sends a message of your choice!',
			slashOptions: [{ name: 'thingtosay', description: 'What you want the bot to say!', type: 'STRING', required: true }],
			ownerOnly: true,
		})
	}
	async exec(message, args) {
		await message.channel.send(args.thingtosay)
        await message.delete()
	}

    async execSlash(message, args) {
        await message.channel.send(args.thingtosay)
        await message.reply({content: 'i sent the message probably', ephemeral: true})
    }
}
