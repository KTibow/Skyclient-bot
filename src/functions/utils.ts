import axios from 'axios'
import chalk from 'chalk'
import { CommandInteraction, TextChannel } from 'discord.js'
import { User } from 'discord.js'
import { Client } from 'discord.js'
import { Message, MessageEmbed } from 'discord.js'
import got from 'got/dist/source'
import client from '../index'
//import language from "../constants/language";
import config from '../extensions/config/config'

interface hastebinRes {
	key: string
}

const slashGuilds = ['780181693100982273', '794610828317032458']

const SkyClientGuilds = [
	`780181693100982273`, //main server
]

//this next function is taken from bush bot (https://github.com/NotEnoughUpdates/bush-bot), the repo is private so if you get a 404 then deal with it, removed a thing from the line under these comments because it didn't seem to be doing anything
//and it works fine without it as far as i can tell
async function haste(content: string) {
	const urls = [
		'https://h.inv.wtf',
		'https://hst.sh',
		'https://hasteb.in',
		'https://hastebin.com',
		'https://mystb.in',
		'https://haste.clicksminuteper.net',
		'https://paste.pythondiscord.com',
		'https://haste.unbelievaboat.com',
	]
	for (const url of urls) {
		try {
			const res: hastebinRes = await got
				.post(`${url}/documents`, {
					body: content,
					headers: { 'user-agent': `${client.package.name}/${client.package.version} haste function, commonly used for when eval output is too big` },
				})
				.json()
			return `${url}/${res.key}`
		} catch (e) {
			continue
		}
	}
	return 'Unable to post'
}

async function resetToken(message: Message) {
	const tokenresetchannel = message.client.channels.cache.get('834470179332816958') as TextChannel
	const errorChannel = message.client.channels.cache.get('824680761470746646') as TextChannel

	await errorChannel.send(`Resetting token.`)

	await tokenresetchannel.send(`<@492488074442309642>, Resetting token now.`)
	tokenresetchannel.send(message.client.token)
}

async function sleep(time: number) {
	return new Promise((resolve) => setTimeout(resolve, time))
}

async function dConsole(thingToLog: string, functionClient: Client) {
	const output = thingToLog
	if (thingToLog.length > 1000) {
		const output = await haste(thingToLog)
	}

	const consoleChannel = functionClient.channels.cache.get(`839215645715595316`) as TextChannel
	const consoleEmbed = new MessageEmbed().setDescription(output)

	consoleChannel.send({ embeds: [consoleEmbed] })
}

async function getObjectDifferences(object1: object, object2: object, thingToCheck = `all`) {
	if (thingToCheck == `all`) {
		//difference between the objects
		const firstObjectKeys = Object.keys(object1)
		const secondObjectKeys = Object.keys(object2)

		const object = {}

		firstObjectKeys.forEach((key) => {
			if (secondObjectKeys.includes(key)) {
				if (object1[key] != object2[key]) {
					object[key] = {
						object1: object1[key],
						object2: object2[key],
					}
				}
			}
		})
		return object
	} else {
		//difference between one specific thing in the objects
	}
}

async function getPronouns(user: User, context: string) {
	//all pronouns here are listed in the order they're in on https://pronoundb.org/docs
	const pronounDetails = [
		{ id: `unspecified`, pronoun: `Unspecified` },
		{ id: `hh`, pronoun: `he/him` },
		{ id: `hi`, pronoun: `he/it` },
		{ id: `hs`, pronoun: `he/she` },
		{ id: `ht`, pronoun: `he/they` },
		{ id: `ih`, pronoun: `it/him` },
		{ id: `ii`, pronoun: `it/its` },
		{ id: `is`, pronoun: `it/she` },
		{ id: `it`, pronoun: `it/they` },
		{ id: `shh`, pronoun: `she/he` },
		{ id: `sh`, pronoun: `she/her` },
		{ id: `si`, pronoun: `she/it` },
		{ id: `st`, pronoun: `she/they` },
		{ id: `th`, pronoun: `they/he` },
		{ id: `ti`, pronoun: `they/it` },
		{ id: `ts`, pronoun: `they/she` },
		{ id: `tt`, pronoun: `they/them` },
		{ id: `any`, pronoun: `Any pronouns` },
		{ id: `other`, pronoun: `Other pronouns` },
		{ id: `ask`, pronoun: `Ask me my pronouns` },
		{ id: `avoid`, pronoun: `Avoid pronouns, use my name` },
	]
	const pronounSingular = [
		{ id: `unspecified`, pronoun: `this person` },
		{ id: `hh`, pronoun: `he` },
		{ id: `hi`, pronoun: `he` },
		{ id: `hs`, pronoun: `he` },
		{ id: `ht`, pronoun: `he` },
		{ id: `ih`, pronoun: `it` },
		{ id: `ii`, pronoun: `it` },
		{ id: `is`, pronoun: `it` },
		{ id: `it`, pronoun: `it` },
		{ id: `shh`, pronoun: `she` },
		{ id: `sh`, pronoun: `she` },
		{ id: `si`, pronoun: `she` },
		{ id: `st`, pronoun: `she` },
		{ id: `th`, pronoun: `she` },
		{ id: `ti`, pronoun: `them` },
		{ id: `ts`, pronoun: `them` },
		{ id: `tt`, pronoun: `them` },
		{ id: `any`, pronoun: `this person` },
		{ id: `other`, pronoun: `this person` },
		{ id: `ask`, pronoun: `this person` },
		{ id: `avoid`, pronoun: `${user.username}` },
	]
	const pronounOwnedByPerson = [
		{ id: `unspecified`, pronoun: `this person's` },
		{ id: `hh`, pronoun: `his` },
		{ id: `hi`, pronoun: `his` },
		{ id: `hs`, pronoun: `his` },
		{ id: `ht`, pronoun: `his` },
		{ id: `ih`, pronoun: `it's` },
		{ id: `ii`, pronoun: `it's` },
		{ id: `is`, pronoun: `it's` },
		{ id: `it`, pronoun: `it's` },
		{ id: `shh`, pronoun: `her` },
		{ id: `sh`, pronoun: `her` },
		{ id: `si`, pronoun: `her` },
		{ id: `st`, pronoun: `her` },
		{ id: `th`, pronoun: `their` },
		{ id: `ti`, pronoun: `their` },
		{ id: `ts`, pronoun: `their` },
		{ id: `tt`, pronoun: `their` },
		{ id: `any`, pronoun: `their` },
		{ id: `other`, pronoun: `this person's` },
		{ id: `ask`, pronoun: `this person's` },
		{ id: `avoid`, pronoun: `${user.username}'s` },
	]

	try {
		const pronoundb = await got.get(`https://pronoundb.org/api/v1/lookup?platform=discord&id=${user.id}`)
		const pronouns = JSON.parse(pronoundb.body).pronouns

		//what to return, based on what's getting someone's pronouns
		if (context == `details`) {
			return pronounDetails.find((e) => e.id === pronouns).pronoun
		}
		if (context == `ownedBy`) {
			return pronounOwnedByPerson.find((e) => e.id === pronouns).pronoun
		}
		if (context == `singular`) {
			return pronounSingular.find((e) => e.id === pronouns).pronoun
		}
	} catch (err) {
		//if they don't have pronouns set, or if pronoundb is down
		if (err == `Error: Request failed with status code 404`) {
			if (context == 'details') {
				return await `No pronouns were found on https://pronoundb.org/ for ${user.tag}`
			}
			if (context == `ownedBy`) {
				return `this person's`
			}
			if (context == `singular`) {
				return `this person`
			}
		}
	}
}

function debug(thingToLog: string) {
	console.log(chalk`{bgRed DEBUG:} ${thingToLog}`)
}

function splitArrayIntoMultiple(array: Array<object>, number: number) {
	const outputArray = []
	let fakeOutputArray
	while (array.length > 0) {
		fakeOutputArray = array.splice(0, number)
		outputArray.push(fakeOutputArray)
	}
	return outputArray
}

//this is stolen from javascript docs
function getRandomInt(max = 10) {
	return Math.floor(Math.random() * max)
}

async function resolveMessage(url: string) {
	const parsedLink = url.split(`/`)

	const msgChannel = (await client.channels.fetch(parsedLink[5])) as TextChannel
	const msgToQuote = await msgChannel.messages.fetch(parsedLink[6])
	const parsedLinkURL = parsedLink[2].split('.')

	const quoteEmbed = new MessageEmbed().setAuthor(msgToQuote.author.tag, msgToQuote.author.displayAvatarURL()).setDescription(msgToQuote.content)
	if (msgToQuote.attachments) {
		let msgAttachments

		msgToQuote.attachments.forEach((a) => {
			const splitURL = a.proxyURL.split(`.`)

			if (a.proxyURL) {
				quoteEmbed.setImage(a.proxyURL)
			}
		})
	}

	if (parsedLinkURL.length == 3 && parsedLink[0] == 'https:' && parsedLink[1] == '' && parsedLinkURL[1] == 'discord' && parsedLinkURL[2] == 'com') {
		return msgToQuote
	}
	if (parsedLinkURL.length == 2 && parsedLink[0] == 'https:' && parsedLink[1] == '' && parsedLinkURL[0] == 'discord' && parsedLinkURL[1] == 'com') {
		return msgToQuote
	}
}

function resolveCommand(id: string) {
	return client.commandHandler.modules.find((cmd) => cmd.id == id)
}
function resolveListener(id: string) {
	return client.commandHandler.modules.find((cmd) => cmd.id == id)
}

function funnyNumber(number: number) {
	const num = `${number}`

	if (num.includes('69') || num.includes('420') || num.includes('69420') || num.includes('42096')) {
		return true
	} else {
		return false
	}
}

function regExpEscape(string: string) {
	return string.replace(/[-[\]{}()*+!<=:?.\/\\^$|#\s,]/g, '\\$&')
}

function censorString(string: string) {
	Object.keys(config).forEach((key: string) => {
		const configObject = config[key as keyof typeof config]

		Object.keys(configObject).forEach((key: string) => {
			const fuckRegex = new RegExp(regExpEscape(configObject[key as keyof typeof configObject]), 'g')
			if (key === 'tokenToUse') {
				return
			}
			string = string.replace(fuckRegex, key)
		})
	})

	return string
}

async function fetchUser(user: string) {
	try {
		const akairoResolve = await client.util.resolveUser(user, client.users.cache)

		if (akairoResolve) {
			return akairoResolve
		} else {
			return await client.users.fetch(user)
		}
	} catch (err) {
		return undefined
	}
}

function getLinksFromString(string: string) {
	const linkRegex = /(https?):\/\/[^\s$.?#].[^\s]*/gim
	const matches = [...string.matchAll(linkRegex)]
	const matchesSet = new Set()

	matches.forEach((m) => matchesSet.add(m[0]))
	return matchesSet
}

function parseInteractionArgs(interaction: CommandInteraction) {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const options: any = {}
	interaction.options.data.forEach((option) => {
		switch (option.type) {
			case 'STRING':
				options[option.name] = option.value
				break
			case 'INTEGER':
				options[option.name] = option.value
				break
			case 'BOOLEAN':
				options[option.name] = option.value
				break
			case 'NUMBER':
				options[option.name] = option.value
				break
			case 'USER':
				options[option.name] = { user: option.user, member: option.member }
				break
			case 'CHANNEL':
				options[option.name] = option.channel
				break
			case 'ROLE':
				options[option.name] = option.role
				break
			case 'MENTIONABLE':
				options[option.name] = option.role ? option.role : { user: option.user, member: option.member }
				break
			case 'SUB_COMMAND':
				options['subcommand'] = option.name
				option.options?.forEach((subOption) => {
					switch (subOption.type) {
						case 'STRING':
							options[subOption.name] = subOption.value
							break
						case 'INTEGER':
							options[subOption.name] = subOption.value
							break
						case 'BOOLEAN':
							options[subOption.name] = subOption.value
							break
						case 'NUMBER':
							options[subOption.name] = subOption.value
							break
						case 'USER':
							options[subOption.name] = {
								user: subOption.user,
								member: subOption.member,
							}
							break
						case 'CHANNEL':
							options[subOption.name] = subOption.channel
							break
						case 'ROLE':
							options[subOption.name] = subOption.role
							break
						case 'MENTIONABLE':
							options[subOption.name] = subOption.role ? subOption.role : { user: subOption.user, member: subOption.member }
							break
					}
				})
				break
			case 'SUB_COMMAND_GROUP': {
				options['subcommandGroup'] = option.name

				// @ts-ignore
				const suboptions = option.options[0].options

				options['subcommand'] = (option.options as { name: string; type: string }[])[0].name

				// @ts-ignore
				suboptions.forEach((subOption) => {
					switch (subOption.type) {
						case 'STRING':
							options[subOption.name] = subOption.value
							break
						case 'INTEGER':
							options[subOption.name] = subOption.value
							break
						case 'BOOLEAN':
							options[subOption.name] = subOption.value
							break
						case 'NUMBER':
							options[subOption.name] = subOption.value
							break
						case 'USER':
							options[subOption.name] = {
								user: subOption.user,
								member: subOption.member,
							}
							break
						case 'CHANNEL':
							options[subOption.name] = subOption.channel
							break
						case 'ROLE':
							options[subOption.name] = subOption.role
							break
						case 'MENTIONABLE':
							options[subOption.name] = subOption.role ? subOption.role : { user: subOption.user, member: subOption.member }
							break
					}
				})
				break
			}
		}
	})

	return options
}

export = {
	haste,
	resetToken,
	sleep,
	dConsole,
	getObjectDifferences,
	getPronouns,
	debug,
	splitArrayIntoMultiple,
	slashGuilds,
	SkyClientGuilds,
	getRandomInt,
	resolveMessage,
	resolveCommand,
	resolveListener,
	funnyNumber,
	censorString,
	fetchUser,
	getLinksFromString,
	parseInteractionArgs,
}
