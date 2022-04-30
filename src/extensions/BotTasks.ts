import { Task } from 'discord-akairo'
import { BotClient } from './SkyClient'

export class BotTasks extends Task {
	public client = super.client as BotClient
}
