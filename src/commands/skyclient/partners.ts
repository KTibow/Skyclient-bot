import { MessageEmbed } from 'discord.js'
import axios from 'axios'
import utils from '../../functions/utils'
import { BotCommand } from '../../extensions/BotCommand'
import fs from 'fs'

export default class partners extends BotCommand {
	constructor() {
		super('partners', {
			aliases: ['partners'],
			userPermissions: ['ADMINISTRATOR'],
			SkyClientOnly: true,

			slashOptions: [],
			slash: true,
			slashGuilds: utils.SkyClientGuilds,
			description: 'Sends a list of all the partnered discords, with each one in its own embed.',
		})
	}

	async exec(message) {
		if (!message.member.permissions.has('ADMINISTRATOR')) {
			return message.reply('hey you need admin for that')
		}

		const servers = this.client.discords.discords.sort((discordA, discordB) => 
			discordA.type > discordB.type ? 1 : discordB.type > discordA.type ? -1 : 1
		)

		const embedArray = []

		for (const server of servers) {
			if (server.partner) {
				const partnerEmbed = new MessageEmbed()
					.setTitle(server.fancyname)
					.setURL(`https://discord.gg/${server.code}`)
					.setColor(server.type == 'mods' ? '#56A644' : (server.type == 'packs' ? '#4463A6' : '#ffffff'))
					.setDescription(`${server.description}\n\n\`https://discord.gg/${server.code}\``)
					.setThumbnail(`https://raw.githubusercontent.com/nacrt/SkyblockClient-REPO/main/files/discords/${server.icon}`)

				embedArray.push(partnerEmbed)
			}
		}

		utils.splitArrayIntoMultiple(embedArray, 10).forEach((embed) => {
			message.channel.send({ embeds: embed })
		})

		if (message.interaction) {
			message.reply({ content: 'Sent partner embeds', ephemeral: true })
		}
	}
}
