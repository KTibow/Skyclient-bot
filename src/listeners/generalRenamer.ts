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

	public lastrename: Date = new Date()

	removeDuplicateCharacters(string) {
		return string
			.split('')
			.filter(function (item, pos, self) {
				return self.indexOf(item) == pos;
			})
			.join('');
	}

	async exec(message: Message) {
		const blacklist = [
			"suport", "general",
			"@here", "@everyone",
			"sex", "cock", "penis",
			"niger", "niga"
		]
		try {
			const nospacecontent = message.content.replaceAll(' ', '')

			if (message.channel.id == '780181693553704973') {
				if (nospacecontent.length >= 7 || nospacecontent.length <= 1) return
			}
			else if (message.channel.id == '887818760126345246') {
				if (nospacecontent.length >= 15 || nospacecontent.length <= 5) return
			}
			else {
				return
			}
			if (message.webhookId) return
			if (message.author.bot) return
			if (message.member.roles.cache.get('929157720328785920')) return
			if (!message.content) return
			if (this.client.generalTimeout != 0) return

			const cleanmessage = this.removeDuplicateCharacters(nospacecontent.toLowerCase().replaceAll('0', 'o'))
			for (const word of blacklist) {
				if (cleanmessage.includes(word)) {
					return;
				}
			}
			//const noping = new MessageMentions(false)
			await (message.channel as TextChannel).setName(message.content)
			const msgtxt = `Renaming SkyClient <#${message.channel.id}> by <@${message.author.id}> to ${message.content.replaceAll(' ', '-')} - ${message.url}`

			const webhook = new WebhookClient({ url: this.client.config.misc.skyclientGeneralLoggingURL })
			await webhook.send({ content: msgtxt, allowedMentions: { parse: [] } })

			this.lastrename = new Date()

			this.client.generalTimeout = 5
			await utils.sleep(300000)
			this.client.generalTimeout = 0
		} catch (err) {
			await message.reply(err.message)
		}
	}
}
