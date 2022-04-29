import { Message } from 'discord.js'
import { BotCommand } from '../extensions/BotCommand'
import utils from '../functions/utils'

export default class bestbot extends BotCommand {
	constructor() {
		super('bestbot', {
			aliases: ['bestbot'],
			slashOptions: [],
			slash: true,
			description: 'bestbot',
		})
	}

	async exec(message: Message) {
		await message.reply('me ofc')
	}
}
