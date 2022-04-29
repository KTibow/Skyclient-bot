import { MessageEmbed } from 'discord.js'
import axios from 'axios'
import { BotCommand } from '../../../extensions/BotCommand'
import commandManager from '../../../functions/commandManager'
import fs from 'fs'
import utils from '../../../functions/utils'
import msgutils from '../../../functions/msgutils'

export default class packList extends BotCommand {
	constructor() {
		super('packList', {
			aliases: ['packlist', 'packs'],

			slashOptions: [{ name: 'ephemeral', description: 'Toggle the embed showing for other people', type: 'BOOLEAN', required: false }],
			slash: true,
			slashGuilds: utils.slashGuilds,
			description: 'Shows a list of all the packs in SkyClient',
			SkyClientOnly: true,
		})
	}

	async exec(message, args) {
		if (!args) {
			args = { ephemeral: false }
		}
		let packJson = this.client.packs.packs

		const packsEmbed = new MessageEmbed().setColor(message.member.displayColor).setTitle("SkyClien't packs List")

		packJson.forEach((pack) => {
			if (pack.display && pack.display != 'no' && pack.hidden != true) {
				let packs = ''

				if (pack.display.includes('Bundle')) {
					pack.actions.forEach((bundle) => {
						if (bundle.text && bundle.text != 'Guide') {
							packs = packs + bundle.text + ', '
						}
					})
					packs = packs.substring(0, packs.length - 2)
				} else {
					if (pack.display && pack.creator && pack.display != 'no' && pack.discordcode) {
						packs = `Creator: [${pack.creator}](https://discord.gg/${pack.discordcode})\npack ID: \`${pack.id}\``
					} else {
						packs = `Creator: ${pack.creator}\npack ID: \`${pack.id}\``
					}
				}

				packsEmbed.addField(`${pack.display}`, packs, true)
			}
		})
		const embed = packsEmbed
		await msgutils.reply(message, { embeds: [embed] }, (args.ephemeral ??= false))
	}
}
