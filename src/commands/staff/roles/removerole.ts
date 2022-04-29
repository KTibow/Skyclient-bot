import { MessageEmbed } from 'discord.js'
import { BotCommand } from '../../../extensions/BotCommand'
import utils from '../../../functions/utils'

export default class removerole extends BotCommand {
	constructor() {
		super('removerole', {
			aliases: ['removerole', 'rrole', 'rr'],
			args: [
				{
					id: 'member',
					type: 'member',
				},
				{
					id: 'role',
					type: 'role',
					match: 'rest',
				},
			],
			clientPermissions: ['MANAGE_ROLES', 'EMBED_LINKS'],
			userPermissions: ['MANAGE_ROLES'],
			channel: 'guild',
		})
	}

	async exec(message, args) {
		if (!args.role) return await message.reply("I couldn't find that role. Try using an ID instead.")
		try {
			if (message.member.roles.highest.rawPosition < args.role.rawPosition) {
				await message.channel.send(`Your highest role is lower than or equal to ${args.role.name}, so you cannot remove it from anyone!`)
			} else {
				await args.member.roles.remove(args.role)

				const roleembed = new MessageEmbed().setDescription(`Removed <@&${args.role.id}> from ${args.member.user}`)

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
