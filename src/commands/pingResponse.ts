import config from '../extensions/config/config'
import { MessageEmbed } from 'discord.js'
import { BotCommand } from '../extensions/BotCommand'
import utils from '../functions/utils'

export default class extends BotCommand {
	constructor() {
		super('pingResponse', {
			aliases: [
				`<@${Buffer.from(config.tokens[config.misc.tokenToUse].split('.')[0], 'base64').toString('ascii')}>`,
				`<@!${Buffer.from(config.tokens[config.misc.tokenToUse].split('.')[0], 'base64').toString('ascii')}>`,
			],
			prefix: '',
		})
	}
	async exec(message) {
		this.aliases.forEach(async (alias) => {
			if (message.content == alias)
				return await message.reply("hi my prefix is `-` (or `+` if this is lisena's server) or you can ping me but also most commands have slashcommands so use those please")
		})
	}
}
