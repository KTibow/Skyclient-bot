import { AkairoMessage } from 'discord-akairo'
import { Message } from 'discord.js'
import { BotCommand } from 'src/extensions/BotCommand'
import utils from '../functions/utils'
import { BotInhibitor } from '../extensions/BotInhibitor'

export default class SkyClientInhibitor extends BotInhibitor {
	constructor() {
		super('SkyClientInhibitor', {
			reason: 'notSkyClient',
		})
	}

	exec(message: Message | AkairoMessage, command: BotCommand): boolean {
		if (command.SkyClientOnly) {
			return utils.SkyClientGuilds.includes(message.guild.id) ? false : true
		} else return true
	}
}
