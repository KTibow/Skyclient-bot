import { BotClient } from './extensions/SkyClient'
import { exec } from 'child_process'
import { promisify } from 'util'
import chalk from 'chalk'
import config from './extensions/config/config'

const client = new BotClient()

const sh = promisify(exec)

console.log("hey! when you see this, make it use github's api for the repo command instead of cloning the whole repo")

sh('git clone https://github.com/nacrt/SkyblockClient-REPO')
	.then(() => {
		console.log(chalk`{blue nacrt/SkyblockClient-REPO} {red successfully cloned!}`)

		//start the bot if the repo isnt there
		client.start()
	})
	.catch((err) => {
		if (err.stderr == `fatal: destination path 'SkyblockClient-REPO' already exists and is not an empty directory.\n`) {
			console.log(chalk`{blue nacrt/SkyblockClient-REPO} {red found, so it wasn't cloned.}`)
		}
		console.log(chalk.red('Pulling repo'))

		sh('cd SkyblockClient-REPO && git reset --hard && git pull')

		//start the bot if the repo is there
		client.start()
	})

export default client
;(async () => {
	const { WebhookClient } = require('discord.js')
	const webhook = new WebhookClient({ url: config.misc.consoleWebhookURL })

	if (config.misc.tokenToUse === 'token') {
		await webhook.send('Process started.')
	}
})()
