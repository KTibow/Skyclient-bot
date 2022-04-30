import { BotListener } from '../extensions/BotListener'

export default class f extends BotListener {
	constructor() {
		super('f', {
			emitter: 'client',
			event: 'messageCreate',
		})
	}

	async exec(message) {
		//yes i stole the idea from optibot
		//no, i have no idea what optibot is coded in, i didnt steal the code
		try {
			if (message.content.toLowerCase() == `f`) {
				message.react(`🇫`)
			}
			if (message.content.toLowerCase() == 'l') {
				message.react(`🇱`)
			}
		} catch (err) {
			return
		}
	}
}
