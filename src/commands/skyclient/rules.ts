import { MessageEmbed } from 'discord.js'
import { BotCommand } from '../../extensions/BotCommand'
import utils from '../../functions/utils'
import fs from 'fs'

export default class rules extends BotCommand {
	constructor() {
		super('rules', {
			aliases: ['rules'],
			SkyClientOnly: true,

			slashOptions: [],
			slash: true,
			slashGuilds: utils.SkyClientGuilds,
			description: 'Shows the rules.',
		})
	}

	async exec(message) {
		const rule1 = new MessageEmbed().setTitle(`Don't be an idiot.`).setDescription(`If you don't have common sense, then please just leave.`)

		const rule2 = new MessageEmbed()
			.setTitle(`Things you should already know`)
			.addFields(
				{ name: `Don't discriminate against people`, value: `Everyone is a human, and has equal rights. If you disagree with that, then you don't get to be here.` },
				{ name: `Politics`, value: `If you want to talk about politics, do it somewhere else. It just causes unnecessary drama, which we don't need here.` },
				{ name: `Advertising is bad`, value: `Don't do it. Nobody likes advertising.` },
				{ name: `No NSFW Content`, value: `do I really need to explain this one? No porn, etc` }
			)

		if (!message.member.permissions.has('ADMINISTRATOR') && !message.interaction) {
			message.reply('How about you try running that as a slashcommand instead?')
		}
		if (!message.member.permissions.has('ADMINISTRATOR') && message.interaction) {
			message.reply({ embeds: [rule1, rule2], ephemeral: true })
		}
		if (message.interaction && message.member.permissions.has('ADMINISTRATOR')) {
			message.reply({ content: 'Rules sent!', ephemeral: true })
			message.channel.send({ embeds: [rule1, rule2] })
		}
		if (!message.interaction && message.member.permissions.has('ADMINISTRATOR')) {
			if (message.type == 'REPLY') {
				if (message.channel.type == 'GUILD_TEXT') {
					const repliedMessage = await message.channel.messages.fetch(message.reference.messageId)
					repliedMessage.util.reply({ embeds: [rule1, rule2] })
				}
			} else {
				message.channel.send({ embeds: [rule1, rule2] })
			}
		}
	}
}
