import axios from 'axios'
import { MessageEmbed } from 'discord.js'
import { BotCommand } from '../../../extensions/BotCommand'
import commandManager from '../../../functions/commandManager'
import fs from 'fs'
import utils from '../../../functions/utils'
import msgutils from '../../../functions/msgutils'

export default class modInfo extends BotCommand {
	constructor() {
		super('modInfo', {
			aliases: ['mod', 'modinfo'],
			args: [{ id: 'mod', type: 'string' }],

			slash: true,
			slashOptions: [
				{ name: 'mod', description: 'The mod ID that you want to get info on', type: 'STRING', required: true },
				{ name: 'ephemeral', description: 'Toggle the embed showing for other people', type: 'BOOLEAN', required: false },
			],
			slashGuilds: utils.slashGuilds,
			description: 'Shows information on a specific mod from SkyClient',
			SkyClientOnly: true,
		})
	}

	async exec(message, args) {
		const mod = await this.client.mods.get(args.mod)

		if (!mod) return msgutils.reply(message, { content: "I couldn't find a mod with that ID" })

		const cleanfile = mod.file.replaceAll("(", "%28").replaceAll(")", "%29").replaceAll(" ", "%20")
		const cleanurl = utils.cleanRepoItemLink(mod.url)

		const modEmbed = new MessageEmbed().setTitle(mod.display).setDescription(mod.description)
		if (mod.command) modEmbed.addField('Command', mod.command)
		if (mod.url) modEmbed.addField('Direct Download', `[${mod.file}](${cleanurl})`)
		else if (!mod.url && mod.id != 'optifine')
			modEmbed.addField('Direct Download', `[${mod.file}](https://raw.githubusercontent.com/nacrt/SkyblockClient-REPO/main/files/mods/${cleanfile})`)

		if (message.member && message.member.displayColor) modEmbed.setColor(message.member.displayColor)
		else if (!message.member.displayColor && message.guild.me.displayColor) modEmbed.setColor(message.guild.me.displayColor)
		else if (!message.member) modEmbed.setColor('#fd87d2')

		if (mod.icon) modEmbed.setThumbnail(`https://raw.githubusercontent.com/nacrt/SkyblockClient-REPO/main/files/icons/${encodeURIComponent(mod.icon)}`)

		if (mod.creator) modEmbed.setFooter(`Created by ${mod.creator}`)

		await msgutils.reply(message, { embeds: [modEmbed] }, args.ephemeral)
	}
}
