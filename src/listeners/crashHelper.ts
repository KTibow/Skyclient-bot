import { match } from 'assert'
import { Message } from 'discord.js'
import got from 'got/dist/source'
import { BotListener } from '../extensions/BotListener'
import utils from '../functions/utils'

export default class CrashHelper extends BotListener {
	constructor() {
		super('crashHelper', {
			emitter: 'client',
			event: 'messageCreate',
		})
	}

	async exec(message: Message) {

		const allowedGuilds = ['780181693100982273', '925260329229901834', '830722593996013588']
		if (!allowedGuilds.includes(message.guild.id)) return

		if (message.author.bot) return
		if (message.attachments.size === 0) return // await message.reply('no attachments')
		for (const [, { url }] of message.attachments) {
			if (!url.endsWith('.txt') && !url.endsWith('.log')) {
				return // await message.reply(`${url} isn't, and can't be, a crash log.`)
			}


			const log = (await got.get(url)).body
			const isLog = this.checkPossibleLog(log)

			if (isLog === false) return // await message.reply('not a log')

			const pathindicator = "`"
			const gameroot = ".minecraft"
			let profileroot = ".minecraft"
			if (message.guildId == "780181693100982273") {
				profileroot = ".minecraft/skyclient"
			}


			const logUrl = await utils.haste(log)

			if (logUrl != 'Unable to post') {
				//await message.delete()
				// hell no
			}
			const thejson = await got.get('https://raw.githubusercontent.com/SkyblockClient/CrashData/main/crashes.json')
			const fixes = await JSON.parse(thejson.body).fixes
			const fixTypes = await JSON.parse(thejson.body).fixtypes
			const defaultFixType = await JSON.parse(thejson.body).default_fix_type

			let fixesMap = new Map<number, Array<string>>()

			for (const fix of fixes) {
				let completedProblems = true

				for (const p of fix.causes) {
					if (p.method === 'contains') {
						if (!log.includes(p.value)) {
							completedProblems = false
							break
						}
					}
					else if (p.method === 'contains_not') {
						if (log.includes(p.value)) {
							completedProblems = false
							break
						}
					}
					else if (p.method === 'regex') {
						const regex = RegExp(p.value, "gi")
						if (!regex.test(log)) {
							completedProblems = false
							break
						}
					}
					else if (p.method === 'regex_not') {
						const regex = RegExp(p.value, "gi")
						if (regex.test(log)) {
							completedProblems = false
							break
						}
					}
					else {
						completedProblems = false
						break
					}
				}

				// this code is basically saying that all causes were contained and therefore it should be outputed
				if (completedProblems) {
					const fixtypenumber = this.getFixTypeNumber(defaultFixType, fix)
					if (typeof (fixesMap.get(fixtypenumber)) == "undefined") {
						fixesMap.set(fixtypenumber, new Array<string>())
					}
					fixesMap.get(fixtypenumber).push(fix.fix)
				}
			}

			// supposedly sorts the map
			// https://stackoverflow.com/questions/31158902/is-it-possible-to-sort-a-es6-map-object
			fixesMap = new Map([...fixesMap.entries()].sort());

			let solutions = ''
			fixesMap.forEach((value: Array<string>, key: number) => {
				solutions += "\n**" + this.getFixTypeString(fixTypes, defaultFixType, key) + "**\n"
				for (const solution of value) {
					solutions += solution.replaceAll("%pathindicator%", pathindicator).replaceAll("%gameroot%", gameroot).replaceAll("%profileroot%", profileroot) + "\n"
				}
			});
			const msgtxt = `**${message.author}** sent a log: ${logUrl}${message.content ? `,\n"${message.content}"` : ''}\n${solutions}`
			await message.channel.send({content: msgtxt, allowedMentions: {users: [message.author.id]}})
		}
	}

	getFixTypeString(fixtypes, defaultfixtype, fix): string {
		return fixtypes[this.getFixTypeNumber(defaultfixtype, fix)].name
	}
	getFixTypeNumber(defaultfixtype, fix): number {
		try {
			if (typeof (fix) == "number") {
				return fix
			}
			if (typeof (fix.fixtype) == "undefined") {
				return defaultfixtype
			}
			return fix.fixtype
		} catch (error) {
			return defaultfixtype
		}
	}

	getFixDisplayInBot(fixtypes, fix: number): boolean {
		return true
	}

	checkPossibleLog(possibleLog: string): boolean {
		let isLog = false

		const logText = [
			'Thank you for using SkyClient',
			'This is the output Console and will display information important to the developer!',
			'Error sending WebRequest',
			'The game crashed whilst',
			'net.minecraft.launchwrapper.Launch',
			'# A fatal error has been detected by the Java Runtime Environment:',
			'---- Minecraft Crash Report ----',
			'A detailed walkthrough of the error',
			'launchermeta.mojang.com',
			'Running launcher core',
			'Native Launcher Version:',
			'[Client thread/INFO]: Setting user:',
			'[Client thread/INFO]: (Session ID is',
			'MojangTricksIntelDriversForPerformance',
			'[DefaultDispatcher-worker-1] INFO Installer',
			'[DefaultDispatcher-worker-1] ERROR Installer',
			'net.minecraftforge',
			'club.sk1er',
			'gg.essential',
			'View crash report',
		]

		for (const text of logText) {
			if (possibleLog.includes(text)) {
				isLog = true
			}
		}

		return isLog
	}
}








































