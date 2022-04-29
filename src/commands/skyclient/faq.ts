import { MessageEmbed } from 'discord.js'
import { BotCommand } from '../../extensions/BotCommand'
import msgutils from '../../functions/msgutils'
import utils from '../../functions/utils'

export default class faq extends BotCommand {
	constructor() {
		super('faq', {
			aliases: ['faq'],
			SkyClientOnly: true,

			args: [{ id: 'question', type: 'string' }],

			slash: true,
			slashGuilds: utils.SkyClientGuilds,
			slashOptions: [
				{
					name: 'question',
					description: 'ID of the issue you want to see',
					type: 'STRING',
					choices: [
						{
							name: 'Are any of the mods bannable?',
							value: 'anymodsbannable',
						},
						{
							name: "Where's the download?",
							value: 'wheredownload',
						},
						{
							name: 'How do I update a mod?',
							value: 'howupdate',
						},
						{
							name: 'My game is crashing! How do I fix it?',
							value: 'crash',
						},
						{
							name: 'How do I access my mod folder?',
							value: 'modfolder',
						},
						{
							name: 'Can I add my own mods?',
							value: 'addmod',
						},
					],
					required: true,
				},
				{ name: 'ephemeral', description: 'Toggle the embed showing for other people', type: 'BOOLEAN', required: false },
			],
			description: "A bunch of the frequently asked questions about SkyClien't!",
		})
	}

	async exec(message, args) {
		const embed = new MessageEmbed()
			.setTitle("That's not a valid FAQ question!")
			.setDescription('Use the slashcommand version of this, or [check out the code.](https://github.com/Lisenaaaa/SkyClientBot-TEMP/blob/master/src/commands/skyclient/faq.ts)')

		if (!args.question) {
			return message.reply('<#780185114352549919>')
		}

		if (args.question.toLowerCase() == 'anymodsbannable') {
			embed.setTitle('Are any of the mods bannable?')
			embed.setDescription('No.')
		}

		if (args.question.toLowerCase() == 'wheredownload') {
			embed.setTitle("Where's the download?")
			embed.setDescription(`<#780940408175853609> if on Windows 10 (untested on 11)
                <#782998702289059860> if on literally anything else (you will need [java 8](https://adoptopenjdk.net/?variant=openjdk8&jvmVariant=hotspot))`)
		}

		if (args.question.toLowerCase() == 'howupdate') {
			embed.setTitle('How do I update a mod?')
			embed.setDescription('Go to your mods folder ([instructions on how to get to it here](https://youtu.be/E6lwqIo0-Ms)), delete the old version of the mod, and put the new version in.')
		}

		if (args.question.toLowerCase() == 'crash') {
			embed.setTitle('My game is crashing!')
			embed.setDescription(`**\`How to access the SkyClient folder:\`**
                **Windows**: Hit \`Windows Key + R\` and type in \`%appdata%\`. Open the \`.minecraft\` folder, then go to the \`skyclient\` folder.
                **Mac**: On the bar at the top of your screen in Finder, click Go, then click Go to Folder and type \`~/Library/Application Support/Minecraft/skyclient\`, then hit enter.
                **Linux**: if you use Linux and you don't know this, stop using Linux.
                
                
                **\`Exit Code 0:\`**
                Go into the \`logs\` folder and upload \`latest.log\`
                If you don't see that file, look for it. Any other file will be useless.
                
                **\`Exit Code 1 (or -1):\`**
                Go into the \`crash-reports\` folder and upload the latest current crashlog.`)
		}

		if (args.question.toLowerCase() == 'modfolder') {
			return message.reply('https://youtu.be/E6lwqIo0-Ms')
		}

		if (args.question.toLowerCase() == 'addmod') {
			embed.setTitle('Can I add my own mods?')
			embed.setDescription(
				"Yes. Download the mod you want from wherever you get it normally, and put it in [.minecraft/skyclient/mods](https://youtu.be/E6lwqIo0-Ms)\n\n[We have special instructions for SBE, as it doesn't work normally with SkyClient.](https://github.com/MicrocontrollersDev/Alternatives/blob/1e409e056e3e14ca874a2368c045de96787e8cbd/SkyblockExtras.md#reasons-not-to-buy-or-use-sbe)"
			)
		}

		await msgutils.reply(message, { embeds: [embed] }, args.ephemeral)
	}
}
