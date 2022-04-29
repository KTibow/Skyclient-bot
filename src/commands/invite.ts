import { MessageEmbed } from 'discord.js'
import { BotCommand } from '../extensions/BotCommand'
import utils from '../functions/utils'

export default class invite extends BotCommand {
	constructor() {
		super('invite', {
			aliases: ['invite'],
			args: [{ id: 'ephemeral', type: 'boolean', default: 'false' }],

			slash: true,
			description: '"Invite the bot"',
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
		if (message.interaction) {
			return await message.reply({
				content: '[https://discord.com/api/oauth2/authorize?client_id=826247426922250280&permissions=8&scope=bot%20applications.commands](https://www.youtube.com/watch?v=dQw4w9WgXcQ)',
				ephemeral: args.ephemeral,
			})
		}

		const inviteEmbed = new MessageEmbed()
			.setTitle('Invite me to your server!')
			.setDescription('[A few things you should know](https://genius.com/Rick-astley-never-gonna-give-you-up-lyrics)')
			.setURL('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
			.setColor(message.member.displayColor)

		await message.reply({ embeds: [inviteEmbed], ephemeral: args.ephemeral })
	}
}
