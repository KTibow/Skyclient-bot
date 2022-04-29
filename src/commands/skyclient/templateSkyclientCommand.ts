import { BotCommand } from '../../extensions/BotCommand'
import utils from '../../functions/utils'
import fs from 'fs'

export default class templateSkyclientCommand extends BotCommand {
	constructor() {
		super('templateSkyclientCommand', {
			aliases: ['templateSkyclientCommand'],
			SkyClientOnly: true,
			ownerOnly: true
		})
	}

	async exec(message) {
		await message.reply('this is a skyclient server')
	}
}
