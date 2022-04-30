import { MessageEmbed } from 'discord.js'
import axios from 'axios'
import { BotCommand } from '../../../extensions/BotCommand'
import commandManager from '../../../functions/commandManager'
import fs from 'fs'

import importUtils from '../../../functions/utils'
import msgutils from '../../../functions/msgutils'
const utils = importUtils

export default class modList extends BotCommand {
	constructor() {
		super('modList', {
			aliases: ['modlist', 'mods'],

			slashOptions: [{ name: 'ephemeral', description: 'Toggle the embed showing for other people', type: 'BOOLEAN', required: false }],
			slash: true,
			slashGuilds: utils.SkyClientGuilds,
			description: 'Shows a list of all the mods in SkyClient',
			SkyClientOnly: true,
		})
	}

	async exec(message, args) {
		if (!args) {
			args = { ephemeral: false }
		}
		const mods = this.client.mods.mods

		const modsEmbed = new MessageEmbed().setColor(message.member.displayColor).setTitle("SkyClien't Mods List")

		mods.forEach((mod) => {
			if (mod.display && mod.display != 'no' && mod.hidden != true) {
				let mods = ''

				if (mod.display.includes('Bundle')) {
					mod.actions.forEach((bundle) => {
						if (bundle.text && bundle.text != 'Guide') {
							mods = mods + bundle.text + ', '
						}
					})
					mods = mods.substring(0, mods.length - 2)
				} else {
					if (mod.display && mod.creator && mod.display != 'no' && mod.discordcode) {
						mods = `Creator: [${mod.creator}](https://discord.gg/${mod.discordcode})\nMod ID: \`${mod.id}\``
					} else {
						mods = `Creator: ${mod.creator}\nMod ID: \`${mod.id}\``
					}
				}

				modsEmbed.addField(`${mod.display}`, mods, true)
			}
		})

		const embed = modsEmbed
		await msgutils.reply(message, { embeds: [embed] }, (args.ephemeral ??= false))
	}
}
