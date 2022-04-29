import { exec } from 'child_process'
import { Command } from 'discord-akairo'
import { MessageEmbed } from 'discord.js'
import { inspect, promisify } from 'util'
import { BotCommand } from '../../../extensions/BotCommand'

const sh = promisify(exec)

export default class gitPull extends BotCommand {
	constructor() {
		super('gitPull', {
			aliases: ['gitpull'],
			ownerOnly: true,
			channel: 'guild',
		})
	}

	async exec(message, args) {
		const githubEmbed = new MessageEmbed()

		let pull = await sh('git reset --hard && git pull')
		githubEmbed.setDescription(`\`\`\`js\n${inspect(pull)}\`\`\``)
		if (message.member) {
			githubEmbed.setColor(message.member.displayColor)
		} else {
			githubEmbed.setColor(message.guild.me.displayColor)
		}

		message.reply({ embeds: [githubEmbed] })
	}
}
