import { Command } from 'discord-akairo'
import { BotCommand } from '../../extensions/BotCommand'
import utils from '../../functions/utils'
import { exec } from 'child_process'
import { promisify } from 'util'
import { MessageEmbed } from 'discord.js'

const sh = promisify(exec)

export default class reload extends BotCommand {
	constructor() {
		super('reload', {
			aliases: ['reload'],
			ownerOnly: true,
		})
	}

	async exec(message) {
		const reloadEmbed = new MessageEmbed().setDescription(`Reloading!`)
		if (message.member) {
			reloadEmbed.setColor(message.member.displayColor)
		} else {
			reloadEmbed.setColor(message.guild.me.displayColor)
		}
		message.channel.send({ embeds: [reloadEmbed] }).then(async (sent) => {
			console.log(`Reloading!`)

			await sh('yarn build')

			await this.client.commandHandler.reloadAll()
			await this.client.listenerHandler.reloadAll()
			await this.client.inhibitorHandler.reloadAll()
			await this.client.taskHandler.reloadAll()

			console.log(`Reloaded!\n`)

			reloadEmbed.setDescription(`Reloaded! Everything that changed in my files should now be loaded in the bot.`)
			await sent.channel.send({ embeds: [reloadEmbed] })
			await sent.delete()
		})
	}
}
