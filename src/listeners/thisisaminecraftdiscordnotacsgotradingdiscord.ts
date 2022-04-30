import { exec } from 'child_process'
import { promisify } from 'util'
import { BotListener } from '../extensions/BotListener'
import fs from 'fs'
import commandManager from '../functions/commandManager'
import utils from '../functions/utils'
import got from 'got/dist/source'
import { Message, TextChannel } from 'discord.js'

export default class thisIsAMinecraftModDiscordNotACSGOTradingDiscord extends BotListener {
	constructor() {
		super('thisIsAMinecraftModDiscordNotACSGOTradingDiscord', {
			emitter: 'client',
			event: 'messageCreate',
		})
	}

	async exec(message) {
		if (!message.member) return
		if (message.author.id === this.client.user.id) return
		if (message.member.roles.cache.has('780182606628782100')) return
		if (message.member.roles.cache.has('885960137544695819')) return
		if (message.member.permissions.toArray().includes('ADMINISTRATOR')) return

		const links = utils.getLinksFromString(message.content)

		// links.forEach(async (l) => {
		// 	let link = l as string

		// 	if (link.includes('steamcommunity.com')) return await message.reply("This is an actual steam link. It isn't one of the older CS:GO scam links.")

		// 	if (link.startsWith('https://')) link = link.replace('https://', '')
		// 	if (link.startsWith('http://')) link = link.replace('http://', '')
		// 	if (link.endsWith('/')) link = link.substring(0, link.length - 1)

		// 	const linkData = JSON.parse((await got.get(`http://ip-api.com/json/${link.replace('https://', '').replace('http://', '')}`)).body)

		// 	if (this.client.scamIPs.includes(linkData.query)) {
		// 		//console.log(`ip: ${true}`)
		// 		return await ban(message)
		// 	}
		// 	//if (scamLinks.includes(link)) return ban = true

		// 	const splitLink = link.split('/')
		// 	//console.log(splitLink)

		// 	splitLink.forEach(async (l) => {
		// 		//console.log(l)
		// 		if (scamLinks.includes(l))
		// 			//console.log(`repo: ${true}`)
		// 			//console.log(scamLinks.includes(l))
		// 			return await ban(message)
		// 	})
		// })

		// nacrt wrote this little bit
		// no i didn't?
		// yes you did dumbass

		if (((links.size > 0 || message.content.toLowerCase().includes('discord.gg/')) && message.guild.id === '780181693100982273') || message.guild.id == '830722593996013588') {
			const msgcntnt = message.content.toLowerCase()
			if (
				(msgcntnt.includes('nitro') && (msgcntnt.includes('free') || msgcntnt.includes('airdrop') || msgcntnt.includes('giveaway'))) ||
				(msgcntnt.includes(':)') && msgcntnt.includes('first')) ||
				(msgcntnt.includes('friend') && msgcntnt.includes('server'))
			) {
				await message.delete()
				if (msgcntnt.includes('@everyone')) {
					await message.member.ban({ days: 1, reason: 'Auto ban, malicious link: ' + msgcntnt })
				}
				;((await this.client.channels.fetch('796895966414110751')) as TextChannel).send(`${message.author.tag} sent the funny \n${msgcntnt}`)
			}
		}
		//console.log(ban)
	}
}
// async function ban(message: Message, reason:string) {
// 	await message.reply(`banned ${reason}`)
// }

async function ban(message: Message) {
	if (message.guild.id == '780181693100982273' || message.guild.id == '830722593996013588') {
		let hasRole = false
		message.member.roles.cache.forEach((role) => {
			if (commandManager.bypassRoles.includes(role.id) || message.author.id == message.guild.ownerId) {
				return (hasRole = true)
			}
		})
		if (hasRole) {
			await message.delete()
			await (message.guild.channels.cache.get('796895966414110751') as TextChannel).send(`${message.author.tag} sent a scam link.\nMessage content: \`\`\`\n${message.content}\`\`\``)
			return message.channel.send(`hey yeah you shouldn't send those ${message.author}`)
		}

		if (message.member.bannable && !hasRole) {
			try {
				await message.author.send('Hey, did you know that we ban for scam/malicious links?')
			} catch (err) {}
			await message.member.ban({ reason: 'Sending a scam link' })
			await message.delete()
			await (message.guild.channels.cache.get('796895966414110751') as TextChannel).send(
				`${message.author.tag} has been banned for sending a scam, or otherwise malicious link.\nMessage content: \`\`\`\n${message.content}\`\`\``
			)
		}
	} else if (message.guild.id == '762808525679755274') {
		if (message.member.permissions.toArray().includes('ADMINISTRATOR')) {
			await message.delete()
			await (message.guild.channels.cache.get('879037311235526666') as TextChannel).send(`${message.author.tag} sent a scam link.\nMessage content: \`\`\`\n${message.content}\`\`\``)
			return message.channel.send(`hey yeah you shouldn't send those ${message.author}`)
		}

		if (message.member.bannable && !message.member.permissions.toArray().includes('ADMINISTRATOR')) {
			try {
				await message.author.send('Hey, did you know that we ban for scam/malicious links?')
			} catch (err) {}
			await message.member.ban({ reason: 'Sending a scam link' })
			await message.delete()
			await (message.guild.channels.cache.get('879037311235526666') as TextChannel).send(
				`${message.author.tag} has been banned for sending a scam, or otherwise malicious link.\nMessage content: \`\`\`\n${message.content}\`\`\``
			)
		}
	} else {
		await message.reply('hey fuck you thats a scam link')
	}
}
