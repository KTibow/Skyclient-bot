import { MessageEmbed } from 'discord.js'
import { BotCommand } from '../../extensions/BotCommand'
import msgutils from '../../functions/msgutils'
import utils from '../../functions/utils'

export default class networth extends BotCommand {
	constructor() {
		super('networth', {
			aliases: ['networth', 'nw'],
			args: [{ id: 'player', type: 'string' }],
			SkyClientOnly: true,

			slash: true,
			slashGuilds: utils.SkyClientGuilds,
			slashOptions: [
				{
					name: 'player',
					description: "The targetted player's IGN",
					type: 'STRING',
					required: true,
				},
			],
			prefix: ['.', '!'],
			description: 'Gets a players overall networth',
		})
	}

	async exec(message, args) {
		if (!message.interaction) return await message.reply('Maro has fully switched to slash commands. Please use those instead.')
		const fuckMaro = new MessageEmbed()
			.setTitle('Error')
			.setDescription(`The player ${args.player} does not appear to have a Skyblock profile. This is commonly caused by a profile deletion.`)
			.setColor('RED')
			.setFooter('Created by Nariah')

		await message.reply({ embeds: [fuckMaro] })
	}
}
