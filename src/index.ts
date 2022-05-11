import { BotClient } from './extensions/SkyClient'
import { exec } from 'child_process'
import { promisify } from 'util'
import chalk from 'chalk'
import config from './extensions/config/config'

const client = new BotClient()

const sh = promisify(exec)

console.log("hey! when you see this, make it use github's api for the repo command instead of cloning the whole repo")

function clonerepo(longname, shortname, execute = null) {
	sh(`git clone https://github.com/${longname}`)
	.then(() => {
		console.log(chalk`{blue ${longname}} {red successfully cloned!}`)

		if (execute != undefined && execute != null) {
			execute()
		}
	})
	.catch((err) => {
		if (err.stderr == `fatal: destination path '${shortname}' already exists and is not an empty directory.\n`) {
			console.log(chalk`{blue ${longname}} {red found, so it wasn't cloned.}`)
		}
		console.log(chalk.red(`Pulling ${shortname}`))

		sh(`cd ${shortname} && git reset --hard && git pull`)

		if (execute != undefined && execute != null) {
			execute()
		}
	})
}

clonerepo("nacrt/SkyblockClient-REPO", "SkyblockClient-REPO")
clonerepo("SkyblockClient/CrashData", "CrashData", () => client.start())

export default client
;(async () => {
	const { WebhookClient } = require('discord.js')
	const webhook = new WebhookClient({ url: config.misc.consoleWebhookURL })

	if (config.misc.tokenToUse === 'token') {
		await webhook.send('Process started.')
	}
})()
