import { BotListener } from '../../extensions/BotListener'

export default class commandErrorListener extends BotListener {
	constructor() {
		super('commandErrorListener', {
			emitter: 'commandHandler',
			event: 'error',
		})
	}
	async exec(error, message) {
		if (message.author && this.client.ownerID.includes(message.author.id) || this.client.ownerID.includes(message.user.id)) {
			await message.reply({ content: `An error occured!\n\`\`\`js\n${error.stack}\`\`\``, ephemeral: true })
		} else {
			await message.reply({ embeds: [this.client.error(error, ' command', message)] })
		}
	}
}
