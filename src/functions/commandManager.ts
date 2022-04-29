import { Message, Snowflake } from 'discord.js'

const bypassRoles = [
	//skyclient
	'780182606628782100',
	'780183853628260352',
	'832754819588292679',
	'797158676309344268',
	'829336516315971626',
	'783441401492799518',
	'798163409467998249',
	'844275169010647050',
	'799020944487612428',
	'780202942321655858',
	'827612742504415242',

	//lis' boat
	'880717671967105044',
	'880705826627649566',
] as unknown as Snowflake

function userCanUseCommand(message: Message) {
	return true
	// if (message.guild.id != '780181693100982273') {
	// 	return true
	// }
	if (message.guildId === '780181693100982273' || message.guildId === '830722593996013588') {
		let userHasBypassRole = false

		const allowedChannels = [
			'796546551878516766', //bot commands
		]
		let channelIsAllowed = false

		message.member.roles.cache.forEach((role) => {
			if (bypassRoles.includes(role.id)) {
				return (userHasBypassRole = true)
			}
		})
		allowedChannels.forEach((channel) => {
			if (message.channel.id === channel) {
				return (channelIsAllowed = true)
			}
		})
		if (userHasBypassRole) {
			return true
		}
		if (channelIsAllowed) {
			return true
		}
		return false
	} else if (message.guildId === '880637463838724166') {
		let userHasBypassRole = false

		const allowedChannels = [
			'880721465530544149', //bot commands,
		]
		let channelIsAllowed = false

		message.member.roles.cache.forEach((role) => {
			if (bypassRoles.includes(role.id)) {
				return (userHasBypassRole = true)
			}
		})
		allowedChannels.forEach((channel) => {
			if (message.channel.id === channel) {
				return (channelIsAllowed = true)
			}
		})
		if (userHasBypassRole) return true

		if (channelIsAllowed) return true

		if (message.guild.ownerId === message.author.id) return true
		return false
	} else return true
}

export = {
	userCanUseCommand,
	bypassRoles,
}
