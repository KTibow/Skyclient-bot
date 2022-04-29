import { BotListener } from '../extensions/BotListener'

export default class extends BotListener {
	constructor() {
		super('miscButtonListener', {
			emitter: 'client',
			event: 'interactionCreate',
		})
	}

	async exec(interaction) {
		if (!interaction.isButton()) return
		if (interaction.customId.startsWith('arDelMsg')) {
			const ids = interaction.customId.split('|')

			if (interaction.user.id === ids[1]) {
				return await interaction.message.delete()
			} else if (interaction.member.permissions.has('MANAGE_MESSAGES')) {
				return await interaction.message.delete()
			}
			else {
				return await interaction.deferUpdate()
			}
		}

		if (interaction.customId.startsWith('buttonroles')) {
			const IDs = interaction.customId.split('|')

			const guild = await this.client.guilds.cache.get(IDs[1])
			const buttonRole = await guild.roles.cache.get(IDs[2])

			let roleArray = []
			interaction.member.roles.cache.forEach((role) => {
				roleArray.push(role.id)
			})

			if (roleArray.includes(buttonRole.id)) {
				await interaction.reply({ content: `You have **${buttonRole.name}** already, so I'm removing it from you.`, ephemeral: true })
				interaction.member.roles.remove(buttonRole)
			} else {
				await interaction.reply({ content: `You don't have **${buttonRole.name}**, so I'm giving it to you.`, ephemeral: true })
				interaction.member.roles.add(buttonRole)
			}
		}
	}
}
