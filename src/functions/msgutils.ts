import { ReplyMessageOptions, Message } from 'discord.js'
import client from '..'
import commandManager from './commandManager'

async function reply(message: Message, data: ReplyMessageOptions, forceEphemeral?: boolean) {
	try {
		let content
		if (!data.content && !message.interaction) content = { content: ' ', ...data }
		else content = data

		if (forceEphemeral && message.interaction && commandManager.userCanUseCommand(message)) {
			let ephemeralReplyContent = {
				...content,
				ephemeral: true,
			}
			return await message.reply(ephemeralReplyContent)
		}

		if (commandManager.userCanUseCommand(message)) {
			if (message.type == 'REPLY') {
				if (message.channel.type == 'GUILD_TEXT') {
					const repliedMessage = await message.channel.messages.fetch(message.reference.messageId)

					let coolReplyContent = {
						...content,
						allowedMentions: { repliedUser: true },
					}
					return await repliedMessage.reply(coolReplyContent)
				}
			} else {
				return await message.reply(content)
			}
		}
		if (!commandManager.userCanUseCommand(message) && message.interaction) {
			let ephemeralReplyContent = {
				...content,
				ephemeral: true,
			}
			return await message.reply(ephemeralReplyContent)
		}

		//if (!commandManager.userCanUseCommand(message) && !message.interaction) return await message.reply('<#796546551878516766> or use as a slashcommand')
	} catch (err) {
		await message.reply({ embeds: [await client.error(err)] })
	}
}

export = {
	reply,
}
