import { BotListener } from '../../extensions/BotListener'

export default class slashErrorListener extends BotListener {
	constructor() {
		super('slashErrorListener', {
			emitter: 'commandHandler',
			event: 'slashError',
		})
	}
	async exec(error, message) {
		if (this.client.ownerID.includes(message.author.id) || this.client.ownerID.includes(message.user.id)) {
			await message.reply({ content: `An error occured!\n\`\`\`js\n${error.stack}\`\`\``, ephemeral: true })
		} else {
			await message.reply({ embeds: [this.client.error(error, ' slash', message)] })
		}
	}
}
