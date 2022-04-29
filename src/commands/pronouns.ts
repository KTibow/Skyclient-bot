import { MessageEmbed } from 'discord.js'
import msgutils from '../functions/msgutils'
import { BotCommand } from '../extensions/BotCommand'
import utils from '../functions/utils'

export default class pronouns extends BotCommand {
	constructor() {
		super('pronouns', {
			aliases: ['pronouns'],
			description: 'Shows the pronouns of a user, if they have them set on https://pronoundb.org',

			slashOptions: [{ name: 'person', type: 'USER', description: 'the person you want to know the pronouns of' }],
			slash: true,
		})
	}
	async execSlash(message, args) {
		const pronouns = await utils.getPronouns(args.person ? args.person : message.author, 'details')

		await message.reply({
			embeds: [
				{
					title: args.person ? `${args.person.tag}'s pronouns` : 'Your pronouns',
					description: pronouns,
					color: message.member.displayColor,
					footer: { text: 'All data from https://pronoundb.org' },
				},
			],
		})
	}
}
