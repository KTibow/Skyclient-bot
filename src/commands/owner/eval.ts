import importUtils from '../../functions/utils'
import { exec } from 'child_process'
import { AkairoMessage } from 'discord-akairo'
import { MessageEmbed } from 'discord.js'
import { inspect, promisify } from 'util'

/* eslint-disable @typescript-eslint/no-unused-vars */
import djsImport from 'discord.js'

import { BotCommand } from '../../extensions/BotCommand'

export default class Evaluate extends BotCommand {
	constructor() {
		super('eval', {
			aliases: ['eval', 'ev', 'exec'],
			args: [
				{ id: 'codetoeval', type: 'string', match: 'rest' },
				{ id: 'silent', match: 'flag', flag: '--silent' },
				{ id: 'sudo', match: 'flag', flag: '--sudo' },
			],
			ownerOnly: true,
			description: 'run code',
			slash: true,
			slashOptions: [
				{ name: 'codetoeval', description: 'code', type: 'STRING', required: true },
				{ name: 'silent', description: 'no embed', type: 'BOOLEAN' },
				{ name: 'sudo', description: 'bypass a few things', type: 'BOOLEAN' },
			],
			slashGuilds: ['780181693100982273'],
		})
	}

	async exec(message, args) {
		//if (message.author.id != '435443705055543306')
		//	return await message.reply("i would lock this to just me, but ironm00n's shitty akairo fork doesn't let me do that as far as i know, so deal with this error instead")
		if (args.codetoeval.includes('channel.delete')) {
			return message.reply('Are you IRONM00N?')
		}
		if (args.codetoeval.includes('guild.delete')) {
			return message.reply("You're like IRONM00N but infinitely more stupid!")
		}
		if (args.codetoeval.includes('delete') && !args.sudo) {
			return message.reply('This would be blocked by smooth brain protection, but BushBot has a license')
		}

		const guild = message.guild,
			client = this.client,
			channel = message.channel,
			embed = new MessageEmbed(),
			user = message.author,
			member = message.member,
			botUser = this.client.user,
			botMember = message.guild?.me,
			utils = importUtils,
			sh = promisify(exec),
			djs = djsImport

		let output

		try {
			
			let codeToEval = `(async () => {${args.codetoeval}})()`
			if (!args.codetoeval.includes('await') && !args.codetoeval.includes('return')) codeToEval = args.codetoeval
			if (args.codetoeval.includes('await') && !args.codetoeval.includes('return')) codeToEval = `(async () => { return ${args.codetoeval}})()`
			output = await eval(codeToEval)
			output = inspect(output, { depth: 0 })
			output = utils.censorString(output)
		} catch (err) {
			const errorStack = (err?.stack ?? err).substring(0, 1000)
			output = utils.censorString(errorStack)
		}

		output = utils.censorString(output)

		const evalEmbedDisabledGuilds = ['794610828317032458']
		const evalDisabledGuildChannelBypass = ['780181693100982273']

		if (evalEmbedDisabledGuilds.includes(message.guild?.id as string) && !evalDisabledGuildChannelBypass.includes(message.channel.id)) {
			if (args.codetoeval.includes('message.delete')) {
				return
			} else {
				return await message.react('<a:successAnimated:881336936533483520>')
			}
		}

		if (!args.silent && !args.codetoeval.includes('message.channel.delete()')) {
			const evalOutputEmbed = new MessageEmbed().setTitle('Evaluated Code').addField(':inbox_tray: **Input**', `\`\`\`js\n${args.codetoeval}\`\`\``)
			if (message.member) evalOutputEmbed.setColor(message.member.displayColor)

			let newOutput = `\`\`\`js\n${output}\`\`\``

			if (newOutput.length > 900) {
				const haste = await utils.haste(utils.censorString(output))
				newOutput = `\`\`\`js\n${output.substring(0, 900)}\`\`\``
				newOutput += `The output was too large to display, so it was uploaded to [hastebin](${haste})`
			}

			evalOutputEmbed.addField(':outbox_tray: **Output**', newOutput)

			//@ts-ignore stfu typescript
			await message.util.reply({ embeds: [evalOutputEmbed] })
		}
		if (args.silent && !message.interaction) {
			if (args.codetoeval.includes('message.delete')) {
				return
			}
			await message.react('<a:successAnimated:881336936533483520>')
		} else if (args.silent && message instanceof AkairoMessage) {
			return await message.util.reply({
				content: "i can't really send nothing",
				ephemeral: true,
			})
		}
	}
}
