import { MessageEmbed } from 'discord.js'
import { BotCommand } from '../extensions/BotCommand'
import utils from '../functions/utils'

export default class avatar extends BotCommand {
	constructor() {
		super('avatar', {
			aliases: ['avatar', 'av', 'pfp'],
			args: [{ id: 'person', type: 'string' }],

			slash: true,
			slashOptions: [
				{
					name: 'person',
					description: 'The person you want the PFP of',
					type: 'USER',
					required: false,
				},
			],
			description: 'Shows you the profile picture of someone',
		})
	}

	async exec(message, args) {
		let person
		if (args.person) {
			person = message.guild.members.fetch(args.person)
		} else {
			person = message.member
		}

		const avatarEmbed = new MessageEmbed()
			.setTitle(`${person.user.username}'s avatar`)
			.setImage(person.user.displayAvatarURL({ size: 2048, format: 'png', dynamic: true }))
			.setColor(person.displayColor)

		message.reply({ embeds: [avatarEmbed] })
	}
}
