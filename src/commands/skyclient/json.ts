import axios from 'axios'
import { BotCommand } from '../../extensions/BotCommand'
import utils from '../../functions/utils'
import fs from 'fs'
import msgutils from '../../functions/msgutils'

export default class json extends BotCommand {
	constructor() {
		super('json', {
			aliases: ['json'],
			args: [
				{ id: 'type', type: 'string' },
				{ id: 'thingtofind', match: 'restContent', type: 'string' },
			],
			SkyClientOnly: true,

			slash: true,
			slashGuilds: utils.SkyClientGuilds,
			description: 'Sends a hastebin link to the raw json from our repo for a mod or pack.',
			slashOptions: [
				{
					name: 'type',
					description: 'The type of thing to get the raw data of.',
					type: 'STRING',
					choices: [
						{
							name: 'mod',
							value: 'mod',
						},
						{
							name: 'resource pack',
							value: 'pack',
						},
						{
							name: 'user',
							value: 'user',
						},
						{
							name: 'channel',
							value: 'channel',
						},
						{
							name: 'repo discord server',
							value: 'discord',
						},
					],
					required: true,
				},
				{
					name: 'query',
					description: 'option',
					type: 'STRING',
					required: true,
				},
			],
		})
	}

	async exec(message, args) {
		if (args.type == 'mod') {
			await msgutils.reply(message, { content: await this.generateOutput(JSON.stringify(this.client.mods.get(args.query), null, '    ')) })
		} else if (args.type == 'pack') {
			await msgutils.reply(message, { content: await this.generateOutput(JSON.stringify(this.client.packs.get(args.query), null, '    ')) })
		} else if (args.type == 'user') {
			// return await message.reply({ content: "hey so this doesn't actually work rn", ephemeral: true })
			let user = this.client.util.resolveUser(args.query, this.client.users.cache)

			if (!user) {
				await msgutils.reply(message, { content: "Couldn't find that user." })
			}
			user = await this.client.users.fetch(user, { force: true })
			await user.fetchFlags()
			const stringUser = JSON.stringify(user, null, '  ')
			await msgutils.reply(message, { content: await this.generateOutput(stringUser) })
		} else if (args.type == 'channel') {
			const channel = this.client.util.resolveChannel(args.query, message.guild.channels.cache)

			const stringChannel = JSON.stringify(channel, null, '  ')
			await msgutils.reply(message, { content: await this.generateOutput(stringChannel) })
		} else if (args.type === 'discord') {
			await msgutils.reply(message, { content: await this.generateOutput(JSON.stringify(this.client.discords.get(args.query), null, '    ')) })
		}
	}

	async generateOutput(content) {
		if (content.length <= 1990) {
			return `\`\`\`json\n${content}\`\`\``
		} else {
			return await utils.haste(content)
		}
	}
}
