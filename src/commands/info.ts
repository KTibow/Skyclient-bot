import { MessageEmbed } from 'discord.js'
import msgutils from '..//functions/msgutils'
import { BotCommand } from '../extensions/BotCommand'
import utils from '../functions/utils'

export default class info extends BotCommand {
	constructor() {
		super('info', {
			aliases: ['info'],
			args: [{ id: 'ephemeral', type: 'boolean', default: 'false' }],

			slash: true,
			description: 'info about the bot',
			slashOptions: [
				{
					name: 'ephemeral',
					description: 'ephemeral or not ephemeral',
					type: 'BOOLEAN',
				},
			],
		})
	}

	async exec(message, args) {
		await msgutils.reply(message, {content: 'hi this command isn\'t done yet\n\nfor now join https://inv.wtf/katherine'}, args.ephemeral)
	}
}
