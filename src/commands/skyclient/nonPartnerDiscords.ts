import axios from 'axios'
import { MessageEmbed } from 'discord.js'
import { BotCommand } from '../../extensions/BotCommand'
import utils from '../../functions/utils'
import fs from 'fs'
import msgutils from '../../functions/msgutils'

export default class nonpartnereddiscords extends BotCommand {
	constructor() {
		super('nonpartnereddiscords', {
			aliases: ['nonpartnereddiscords'],
			args: [{ id: 'type', type: 'string' }],
			SkyClientOnly: true,

			slash: true,
			slashGuilds: utils.SkyClientGuilds,
			slashOptions: [
				{
					name: 'type',
					description: 'choose between string or embed for how it displays the discords',
					type: 'STRING',
					required: false,
					choices: [
						{ name: 'string', value: 'string' },
						{ name: 'embed', value: 'embed' },
					],
				},
				{ name: 'ephemeral', description: 'Toggle the embed showing for other people', type: 'BOOLEAN', required: false },
			],
			description: 'Shows a list of all of the not partnered discord servers for mods and packs in SkyClient',
		})
	}

	async exec(message, args) {
		const discords = this.client.discords.discords

		const discordsEmbed = new MessageEmbed().setTitle('Non-partnered discord servers')

		let discordString = ''

		discords.forEach((discord) => {
			if (!discord.partner) {
				discordsEmbed.setColor(message.member.displayColor)
				discordsEmbed.addField(discord.fancyname, `[discord.gg/${discord.code}](https://discord.gg/${discord.code})`)
				discordString = discordString + `discord.gg/${discord.code}\n`
			}
		})

		if (!args.type) {
			await msgutils.reply(message, { embeds: [discordsEmbed] }, args.ephemeral)
		}
		if (args.type && args.type.toLowerCase() == 'string') {
			await msgutils.reply(message, { content: discordString }, args.ephemeral)
		}
		if (args.type && args.type.toLowerCase() == 'embed') {
			await msgutils.reply(message, { embeds: [discordsEmbed] }, args.ephemeral)
		}
		if (args.type && args.type.toLowerCase() != 'string' && args.type.toLowerCase() != 'embed') {
			await msgutils.reply(message, { content: "That isn't a valid type!\nValid types: `embed`, `string`" }, args.ephemeral)
		}
	}
}
