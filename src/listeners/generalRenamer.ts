import { Message, TextChannel, WebhookClient } from 'discord.js'
import { BotListener } from '../extensions/BotListener'
import utils from '../functions/utils'

export default class GeneralRenamer extends BotListener {
	constructor() {
		super('generalRenamer', {
			emitter: 'client',
			event: 'messageCreate',
		})
	}

	public lastGenRename: Date = new Date()
	public lastCoolRename: Date = new Date()

	removeDuplicateCharacters(string) {
		return string
			.split('')
			.filter(function (item, pos, self) {
				return self.indexOf(item) == pos
			})
			.join('')
	}

	async exec(message: Message) {
		const notAllowed = ['suport', 'genral', '@her', '@evryon', 'sex', 'cok', 'penis', 'niger', 'niga', 'nsfw']
		try {
			const noSpaceContent = message.content.replaceAll(' ', '')

			if (message.channel.id == '780181693553704973') {
				if (noSpaceContent.length >= 7 || noSpaceContent.length <= 1) return
				if (this.lastGenRename.getTime() > new Date().getTime() - 30000) return
			} else if (message.channel.id == '887818760126345246') {
				if (noSpaceContent.length >= 15 || noSpaceContent.length <= 5) return
				if (this.lastCoolRename.getTime() > new Date().getTime() - 30000) return
			} else {
				return
			}
			if (message.webhookId) return
			if (message.author.bot) return
			if (message.member.roles.cache.get('929157720328785920')) return
			if (!message.content) return

			const noDupeCharMsg = this.removeDuplicateCharacters(noSpaceContent.toLowerCase().replaceAll('0', 'o'))
			for (const word of notAllowed) {
				if (noDupeCharMsg.includes(word)) {
					return
				}
			}
			await (message.channel as TextChannel).setName(message.content)
			const discordStrippedName = message.content.toLowerCase().trim().replaceAll(' ', '-')
			const infoText = `Renaming SkyClient <#${message.channel.id}> by <@${message.author.id}> to ${discordStrippedName} - ${message.url}`

			const webhook = new WebhookClient({ url: this.client.config.misc.skyclientGeneralLoggingURL })
			await webhook.send({ content: infoText, allowedMentions: { parse: [] } })

			if (message.channel.id == '780181693553704973') {
				this.lastGenRename = new Date()
			} else if (message.channel.id == '887818760126345246') {
				this.lastCoolRename = new Date()
			}
		} catch (err) {
			await message.reply(err.message)
		}
	}
}
