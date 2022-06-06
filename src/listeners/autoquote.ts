import { BotListener } from '../extensions/BotListener'
import { Guild, Message, TextChannel, Webhook } from 'discord.js'
import utils from '../functions/utils'

module.exports = class autoquote extends BotListener {
	constructor() {
		super('autoquote', {
			emitter: 'client',
			event: 'messageCreate',
		})
	}

	async exec(message: Message) {
		if (utils.noAutoquotingGuilds.includes(message.guild.id))
			return

		try {
			if (message.author.bot) return

			const urlRegex = /https:\/\/(?:\w+\.)?discord(app)?\.com\/channels\/(\d{18})\/(\d{18})\/(\d{18})/g
			const matches = [...message.content.matchAll(urlRegex)]

			if (matches.length === 0) return

			const messageArray = matches
			const messageSet = new Set()
			messageArray.forEach((m) => messageSet.add(m[0]))

			messageSet.forEach(async (msgLink: string) => {
				const mArray = msgLink.split('/')
				const guildID = mArray[mArray.length - 3]
				const channelID = mArray[mArray.length - 2]
				const messageID = mArray[mArray.length - 1]

				const guild = this.client.guilds.cache.get(guildID) as Guild
				if (guild === undefined) return
				const channel = guild.channels.cache.get(channelID)
				if (channel === undefined) return
				if (!channel?.isText()) return

				const member = await guild.members.fetch(message.author)
				if (member === undefined) return

				if (channel.permissionsFor(member).toArray().includes('VIEW_CHANNEL') === false) return

				const msg = await channel.messages.fetch(messageID)
				if (msg === undefined) return

				// console.log(`${msg.type}: ${typeof msg.type}`)
				// if (msg.type != 'DEFAULT') return
				// console.log('this should not happen')

				if (msg.type === 'DEFAULT') {
					if (message.channel.type === 'GUILD_TEXT') {
						let author: string
						if (msg.webhookId) author = msg.author.tag.substring(0, msg.author.tag.length - 5)
						else author = msg.author.tag

						const webhooks = await (message.channel as TextChannel).fetchWebhooks()
						const foundWebhook = webhooks.find((w) => w.name == `Rain Quoting` && w.owner?.id === this.client.user?.id)
						let webhook: Webhook
						if (foundWebhook === undefined) {
							webhook = await (message.channel as TextChannel).createWebhook(`Rain Quoting}`, { avatar: this.client.user?.displayAvatarURL() })
						} else if (foundWebhook.owner?.id != this.client.user?.id) {
							webhook = await (message.channel as TextChannel).createWebhook(`Rain Quoting`, { avatar: this.client.user?.displayAvatarURL() })
						} else {
							webhook = foundWebhook
						}

						if (msg.content)
							await webhook.send({
								content: msg.content,
								files: msg.attachments.toJSON(),
								embeds: msg.embeds,
								username: author,
								allowedMentions: { parse: [] },
								avatarURL: msg.author.displayAvatarURL(),
							})
						else
							await webhook.send({
								files: msg.attachments.toJSON(),
								embeds: msg.embeds,
								username: author,
								allowedMentions: { parse: [] },
								avatarURL: msg.author.displayAvatarURL(),
							})
					} else if (message.channel.type === 'GUILD_PUBLIC_THREAD' || message.channel.type === 'GUILD_PRIVATE_THREAD') {
						let author: string
						if (msg.webhookId) author = msg.author.tag.substring(0, msg.author.tag.length - 5)
						else author = msg.author.tag

						const webhooks = await (message.channel.parent as TextChannel).fetchWebhooks()
						const foundWebhook = webhooks.find((w) => w.name == `Rain Quoting}` && w.owner?.id === this.client.user?.id)
						let webhook: Webhook
						if (foundWebhook === undefined) {
							webhook = await (message.channel.parent as TextChannel).createWebhook(`Rain Quoting`, {
								avatar: this.client.user?.displayAvatarURL(),
							})
						} else if (foundWebhook.owner?.id != this.client.user?.id) {
							webhook = await (message.channel.parent as TextChannel).createWebhook(`Rain Quoting`, {
								avatar: this.client.user?.displayAvatarURL(),
							})
						} else {
							webhook = foundWebhook
						}

						if (msg.content)
							await webhook.send({
								content: msg.content,
								files: msg.attachments.toJSON(),
								embeds: msg.embeds,
								username: author,
								avatarURL: msg.author.displayAvatarURL(),
								allowedMentions: { parse: [] },
								threadId: message.channelId,
							})
						else
							await webhook.send({
								files: msg.attachments.toJSON(),
								embeds: msg.embeds,
								username: author,
								avatarURL: msg.author.displayAvatarURL(),
								allowedMentions: { parse: [] },
								threadId: message.channelId,
							})
					}
				}
			})
		} catch (err) {
			await this.client.error(err)
		}
	}
}
