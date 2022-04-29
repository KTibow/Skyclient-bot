import { BotListener } from '../extensions/BotListener'

class autorole extends BotListener {
	constructor() {
		super('autorole', {
			emitter: 'client',
			event: 'messageCreate',
		})
	}

	async exec(message) {
		if (message.author.bot == true) {
			return
		}

		const person = message.guild.members.cache.get(message.author.id)
		if (person.member && !person.roles.cache.has('780449281760428042') && person.bot == false) {
			message.member.roles.add('780449281760428042')
		}
	}
}

module.exports = autorole
