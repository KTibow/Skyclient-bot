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
		if (message.author.bot) return
		if (message.attachments.size > 0) {
			for (const [, { url }] of message.attachments) {
				if (!url.endsWith('.txt') && !url.endsWith('.log')) {
					return // await message.reply(`${url} isn't, and can't be, a crash log.`)
				}

				const log = (await got.get(url)).body
				this.processLog(log, message)
			}
		}
		const hastebinRegex = /https:\/\/hst\.sh\/([a-z]*)/
		const hastebinMatch = message.content.match(hastebinRegex)
		if (hastebinMatch) {
			const log = (await got.get(`https://hst.sh/raw/${hastebinMatch[1]}`)).body
			this.processLog(log, message)
		}
	}

	async processLog(log: string, message) {
		const isLog = this.checkPossibleLog(log)
		if (!isLog) return

		const logUrl = await utils.haste(log)
		if (logUrl != 'Unable to post') {
			//await message.delete()
			// hell no
		}

		const solutions = await this.calculateSolutions(log, message.guildId == '780181693100982273')
		const msgtxt = `**${message.author}** sent a log: ${logUrl}${message.content ? `,\n"${message.content}"` : ''}\n${solutions}`
		await message.channel.send({ content: msgtxt, allowedMentions: { users: [message.author.id] } })
	}
	async calculateSolutions(log: string, isSkyclient: boolean): Promise<string> {
		const crashesResp = await got.get('https://raw.githubusercontent.com/SkyblockClient/CrashData/main/crashes.json')
		const crashes = JSON.parse(crashesResp.body)
		const fixList = crashes.fixes
		const fixTypes = crashes.fixtypes
		const defaultFixType = crashes.default_fix_type

		let fixesMap = new Map<number, Array<string>>()

		for (const fix of fixList) {
			const fixIsEligible = fix.causes.every((cause) => {
				switch (cause.method) {
					case 'contains':
						return log.includes(cause.value)
					case 'contains_not':
						return !log.includes(cause.value)
					case 'regex':
						return new RegExp(cause.value, 'gi').test(log)
					case 'regex_not':
						return !new RegExp(cause.value, 'gi').test(log)
					default:
						return false
				}
			})

			if (fixIsEligible) {
				const fixTypeID = this.getFixTypeID(defaultFixType, fix)
				if (typeof fixesMap.get(fixTypeID) == 'undefined') {
					fixesMap.set(fixTypeID, new Array<string>())
				}
				fixesMap.get(fixTypeID).push(fix.fix)
			}
		}

		fixesMap = new Map([...fixesMap].sort())
		// sort fixesMap by the id (info, solution, recommendations, disconnect reason)
		// https://stackoverflow.com/questions/31158902/is-it-possible-to-sort-a-es6-map-object

		const pathIndicator = '`'
		const gameRoot = '.minecraft'
		const profileRoot = isSkyclient ? '.minecraft/skyclient' : '.minecraft'
		let solutions = ''
		fixesMap.forEach((value: Array<string>, key: number) => {
			// Heading for the category
			solutions += '\n**' + this.getFixTypeName(fixTypes, defaultFixType, key) + '**\n'
			for (const solution of value) {
				// Each solution
				solutions += solution.replaceAll('%pathindicator%', pathIndicator).replaceAll('%gameroot%', gameRoot).replaceAll('%profileroot%', profileRoot) + '\n'
			}
		})
		return solutions
	}
	getFixTypeName(fixTypes, defaultFixtype, fix): string {
		return fixTypes[this.getFixTypeID(defaultFixtype, fix)].name
	}
	getFixTypeID(defaultFixType, fix): number {
		try {
			if (typeof fix == 'number') {
				return fix
			}
			if (typeof fix.fixtype == 'undefined') {
				return defaultFixType
			}
			return fix.fixtype
		} catch (error) {
			return defaultFixType
		}
	}

	getFixDisplayInBot(fixtypes, fix: number): boolean {
		return true
	}

	checkPossibleLog(possibleLog: string): boolean {
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
		return logText.some((text) => possibleLog.includes(text))
	}
}
