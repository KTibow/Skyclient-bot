import { BotListener } from '../extensions/BotListener'
import fs from 'fs'
import { MessageActionRow, MessageButton } from 'discord.js'
import utils from '../functions/utils'

class notStolenFromSkytilsDiscord extends BotListener {
	constructor() {
		super('notStolenFromSkytilsDiscord', {
			emitter: 'client',
			event: 'messageCreate',
		})
	}

	async exec(message) {
		
		if (message.guild.id != '780181693100982273') return
		if (message.channel.type != 'GUILD_TEXT' && message.channel.type != 'GUILD_PUBLIC_THREAD') {
			return
		}
		if (message.content.startsWith('```md')) {
			return
		}
		//if (message.content.startsWith('.')) { return }
		if (message.content.startsWith('-')) {
			return
		}

		if (message.content.startsWith('$')) {
			return
		}
		if (message.author.bot != false) {
			return
		}

		let noAutorespond = false

		if (message.member.roles.cache.has('852016624605462589')) {
			return (noAutorespond = true)
		}

		const notStolenFromSkytilsDiscordJson = JSON.parse(fs.readFileSync('SkyblockClient-REPO/files/botautoresponse.json', 'utf8'))

		const row = new MessageActionRow().addComponents(new MessageButton().setLabel('Delete').setStyle('DANGER').setCustomId('autoresponseDeleteMessage'))

		let response
		let count = 0
		notStolenFromSkytilsDiscordJson.forEach(async (trigger) => {
			const triggers = trigger.triggers
			const content = message.content.toLowerCase()

			if (recursiveSearch(content, triggers, 0) && noAutorespond == false) {
				// prevent more than 3 responses
				if (++count > 3) {
					return
				}
				response = trigger.response

				const row = new MessageActionRow().addComponents(new MessageButton().setLabel('Delete').setStyle('DANGER').setCustomId(`arDelMsg|${message.author.id}`))
				await message.reply({ content: response, components: [row] })
			}
		})
	}
}

function recursiveSearch(cutContent: string, triggers: Array<Array<string>>, index: number): boolean {
	const wordList = triggers[index]
	let indexOf = -1

	for (const word of wordList) {
		indexOf = cutContent.indexOf(word)
		if (indexOf != -1) {
			indexOf += word.length
			if (triggers.length == index + 1) {
				return true
			}
			break
		}
	}
	if (indexOf != -1) {
		return recursiveSearch(cutContent.substr(indexOf), triggers, index + 1)
	}
	return false
}

module.exports = notStolenFromSkytilsDiscord
