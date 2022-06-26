import chalk from 'chalk'
import { AkairoClient, CommandHandler, InhibitorHandler, ListenerHandler, TaskHandler } from 'discord-akairo'
import { Intents, Message, MessageEmbed, Snowflake, TextChannel } from 'discord.js'
import { join } from 'path'
import utils from '../functions/utils'
import config from './config/config'
import fs from 'fs'
import got from 'got/dist/source'
import { CrashFixesCache, DiscordsCache, ModsCache, PacksCache, AutoResponseCache } from '../functions/cache'

export class BotClient extends AkairoClient {
	public commandHandler: CommandHandler = new CommandHandler(this, {
		autoRegisterSlashCommands: true,
		prefix: (message) => {
			if (message.guild.id === '880637463838724166' && this.user.id === '881446517729296414') return '+'
			if (message.guild.id === '900435143167188992' && this.user.id === '881446517729296414') return '+'
			else return '-'
		},
		commandUtil: true,
		handleEdits: true,
		directory: join(__dirname, '..', 'commands'),
		allowMention: true,
		autoDefer: false,
		automateCategories: true,
	})
	public listenerHandler: ListenerHandler = new ListenerHandler(this, {
		directory: join(__dirname, '..', 'listeners'),
		automateCategories: true,
	})

	public inhibitorHandler: InhibitorHandler = new InhibitorHandler(this, {
		directory: join(__dirname, '..', 'inhibitors'),
	})

	public taskHandler: TaskHandler = new TaskHandler(this, {
		directory: join(__dirname, '..', 'tasks'),
	})
	public constructor() {
		super(
			{
				ownerID: [
					'435443705055543306', //nacrt
					'378587857796726785', //koxx
					'464851580370419733', // MICRO!!!! 😭😭😭😭
					'545277690303741962', // alysa??
					'545277690303741962', // lisena???
					'881310086411190293', // skye
				],
			},
			{
				allowedMentions: {
					parse: ['users'],
				},
				intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS],
			}
		)
	}

	public config = config
	public utils = utils
	public package = JSON.parse(fs.readFileSync('package.json', 'utf-8'))
	public generalTimeout = 0

	public error = async (error: Error, type?: string, message?: Message) => {
		try {
			const errorChannel = (await this.channels.fetch(this.config.misc.errorChannelID)) as TextChannel

			const errorCode = utils.getRandomInt(69696969696969)

			let errorStack = error.stack

			if (errorStack.length > 1000) {
				errorStack = errorStack.substring(0, 1000)
			}

			const errorEmbed = new MessageEmbed()
			if (!type) {
				errorEmbed.setTitle('An error occured!')
			} else {
				errorEmbed.setTitle(`A${type} error occured!`)
			}
			errorEmbed.addField('Error code', `\`${errorCode}\``)
			errorEmbed.setDescription(`\`\`\`js\n${errorStack}\`\`\``)
			errorEmbed.setColor('DARK_RED')

			if (message) {
				errorEmbed.addField(
					'More Info',
					`Guild: ${message.guild.name} (\`${message.guild.id}\`)
			Channel: ${(message.channel as TextChannel).name} (\`${message.channel.id}\`)
			Message ID: \`${message.id}\`
			
			Author: ${message.author.tag} (\`${message.author.id}\`)
			
			[Message Link](https://discord.com/channels/${message.guild.id}/${message.channel.id}/${message.id})
			Message Content: ${message.content}
			`
				)
			}

			await errorChannel.send({ /*content: `\`\`\`js\n${errorStack}\`\`\``,*/ embeds: [errorEmbed] })

			const returnErrorEmbed = new MessageEmbed().setTitle('An error occured!').setDescription(`Please give my developer code \`${errorCode}\``).setColor('DARK_RED')

			return returnErrorEmbed
		} catch (err) {
			console.log(chalk.red(`An error occured within the error handler.\n${err.stack}`))
			console.log(chalk.magenta(`The error that triggered it:\n${error.stack}`))
			process.exit()
		}
	}

	public scamIPs = []
	public loadIPs = async () => {
		/* Note: All of these IPs are used for discord nitro phishing domains, as far as I know. If any of them aren't used for discord nitro phishing or aren't mainly used for this purpose, please contact IlluminatiFish#0753 (208338448677994496) on discord about it. I, Lisenaaaa, did not make this gist. */
		const ipGist = 'https://gist.githubusercontent.com/IlluminatiFish/e49d4b3cea4daf5be6823f6416b274fa/raw/blacklist.txt'

		try {
			const ipJson = await JSON.parse((await got.get(ipGist)).body)
			this.scamIPs = ipJson
			return true
		} catch (err) {
			await this.error(err)
			return false
		}
	}

	private async _init(): Promise<void> {
		this.commandHandler.useListenerHandler(this.listenerHandler)
		this.commandHandler.useInhibitorHandler(this.inhibitorHandler)
		this.listenerHandler.setEmitters({
			commandHandler: this.commandHandler,
			listenerHandler: this.listenerHandler,
			process,
		})
		// loads all the stuff
		const loaders = {
			commands: this.commandHandler,
			listeners: this.listenerHandler,
			inhibitors: this.inhibitorHandler,
			tasks: this.taskHandler,
		}
		for (const loader of Object.keys(loaders)) {
			try {
				loaders[loader].loadAll()
				if (loader == 'tasks') {
					loaders[loader].startAll()
				}
				console.log(chalk.blueBright(`Succesfully loaded ${loader}.`))
			} catch (e) {
				console.error(`Unable to load ${loader} with error ${e}.`)
			}
		}
	}

	public async start(): Promise<string> {
		await this._init()
		return this.login(config.tokens[config.misc.tokenToUse])
	}

	public fixes = new CrashFixesCache()
	public mods = new ModsCache()
	public packs = new PacksCache()
	public discords = new DiscordsCache()
	public autoresponses = new AutoResponseCache()
}
