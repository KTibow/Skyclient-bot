import { MessageEmbed } from 'discord.js'
import { BotCommand } from '../../extensions/BotCommand'
import msgutils from '../../functions/msgutils'
import utils from '../../functions/utils'

export default class issue extends BotCommand {
	constructor() {
		super('issue', {
			aliases: ['issue'],
			args: [{ id: 'issue', type: 'string' }],
			SkyClientOnly: true,

			slash: true,
			slashGuilds: utils.SkyClientGuilds,
			slashOptions: [
				{
					name: 'issue',
					description: 'ID of the issue you want to see',
					type: 'STRING',
					choices: [
						{
							name: 'Windows says "Windows protected your PC" every time I try to launch it.',
							value: 'windowsbad',
						},
						{
							name: 'It breaks when I add LabyMod.',
							value: 'labybad',
						},
					],
					required: true,
				},
				{ name: 'ephemeral', description: 'Toggle the embed showing for other people', type: 'BOOLEAN', required: false },
			],
			description: 'Describes how to fix a specific issue',
		})
	}

	async exec(message, args) {
		if (!args.issue) {
			return await msgutils.reply(message, { content: '<#785809068610682900>' })
		}
		const embed = new MessageEmbed()
		if (args.issue.toLowerCase() == `windowsbad`) {
			embed.setTitle(`THIS IS NOT A PROBLEM`)
			embed.setDescription(
				`To remove this message, we would have to pay $400-$500/year to a Trusted Authority, which none of the devs can afford or are willing to pay.\n\nJust press \`More Info\`, then \`Run Anyways\` to run it.`
			)
			embed.setImage(`https://cdn.discordapp.com/attachments/780181693553704973/796869759190827108/unknown.png`)
		}
		if (args.issue.toLowerCase() == 'labybad') {
			embed.setTitle('LabyMod is bad')
			embed.setDescription(
				'LabyMod is terribly designed. If you want to get other mods that do what it does but better, check out https://proudmuslim.tech/bad-mod-alternatives/labymod.html, or https://5zigreborn.eu/downloads/'
			)
		}

		await msgutils.reply(message, { embeds: [embed] }, args.ephemeral)
	}
}
