import { BotClient } from './SkyClient'
import { Command, CommandOptions } from 'discord-akairo'

export class BotCommand extends Command {
	declare client: BotClient
	public SkyClientOnly: boolean

	public constructor(id: string, options: BotCommandOptions) {
		super(id, options)
		this.SkyClientOnly = options.SkyClientOnly
	}
}

interface BotCommandOptions extends CommandOptions {
	description?: string
	SkyClientOnly?: boolean
}
