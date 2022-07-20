import { BotCommand } from '../extensions/BotCommand'
import utils from '../functions/utils'

export default class httpcat extends BotCommand {
	constructor() {
		super('httpcat', {
			aliases: ['httpcat'],
			args: [{ id: 'caterror', type: 'number', match: 'restContent' }],

			slash: true,
			description: 'https://http.cat',
			slashOptions: [
				{
					name: 'caterror',
					description: 'cat error code',
					type: 'INTEGER',
					required: true,
				},
			],
		})
	}

	async exec(message, args) {
		let caterror = `https://http.cat/${args.caterror}`
		if (args.caterror == null) {
			caterror = `here's the github repo for httpcat: https://github.com/httpcats/http.cat`
		}

		if (message.type == 'REPLY') {
			if (message.channel.type == 'GUILD_TEXT') {
				const repliedMessage = await message.channel.messages.fetch(message.reference.messageId)
				repliedMessage.reply(caterror)
			}
		} else {
			message.reply(caterror)
		}
	}
}
