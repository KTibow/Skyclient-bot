import chalk from 'chalk'
import { exec } from 'child_process'
import { promisify } from 'util'
import { BotListener } from '../extensions/BotListener'
import fs from 'fs'
import { TextChannel } from 'discord.js'

class ReadyListener extends BotListener {
	constructor() {
		super('ready', {
			emitter: 'client',
			event: 'ready',
			type: 'once',
		})
	}

	async exec() {
		console.log(chalk`{magenta Succesfully logged in as }{magentaBright.bold ${this.client.user.tag}}`)
		console.log(
			(await this.client.loadIPs()) ? chalk`{magentaBright Succesfully loaded scamlink IPs}` : chalk`{red Failed to load scam IPs. The scamlink detector will only use SkyClient's repo.}`
		)
		console.log(`\n`)
		console.log(chalk.magentaBright(`---Bot Output---`))

		this.client.user.setActivity('Alyssa create me', { type: 'WATCHING' })

		if (this.client.user.id === '881446517729296414') await ((await this.client.channels.fetch('880655568417751102')) as TextChannel).send('Logged in.')

		await this.client.fixes.fetch()
		await this.client.mods.fetch()
		await this.client.packs.fetch()
		await this.client.discords.fetch()
	}
}

module.exports = ReadyListener
