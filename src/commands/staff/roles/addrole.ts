import { MessageEmbed } from 'discord.js'
import { BotCommand } from '../../../extensions/BotCommand'
import utils from '../../../functions/utils'

export default class addrole extends BotCommand {
	constructor() {
		super('addrole', {
			aliases: ['addrole', 'role', 'arole', 'ar'],
			args: [
				{ id: 'member', type: 'member' },
				{ id: 'role', type: 'role', match: 'rest' },
			],
			clientPermissions: ['MANAGE_ROLES', 'EMBED_LINKS'],
			userPermissions: ['MANAGE_ROLES'],
		})
	}

	async exec(message, args) {
		if (!args.role) return await message.reply("I couldn't find that role. Try using an ID instead.")
		try {
			if (message.member.roles.highest.rawPosition < args.role.rawPosition) {
				await message.channel.send(`Your highest role is lower than or equal to ${args.role.name}, so you cannot give it to anyone!`)
			} else {
				await args.member.roles.add(args.role)

				const roleembed = new MessageEmbed().setDescription(`Added <@&${args.role.id}> to ${args.member.user}`)

				await message.util.reply({ embeds: [roleembed] })
			}
		} catch (err) {
			if (err == `TypeError: Cannot read property 'roles' of undefined`) {
				const ihatelife = new MessageEmbed().setDescription(`Either that user isn't cached, or they aren't on this server. Please ping them instead of whatever you tried to do.`)
				return message.util.reply({ embeds: [ihatelife] })
			} else {
				this.handler.emitError(err, message, this)
			}
		}
	}
}
