import { BotCommand } from '../../../extensions/BotCommand'
import { exec } from 'child_process'
import { promisify } from 'util'
import { Message, MessageActionRow, MessageButton } from 'discord.js'
import fs from 'fs'

const sh = promisify(exec)

export default class repo extends BotCommand {
	constructor() {
		super('repo', {
			aliases: ['repo'],
			SkyClientOnly: true,
		})
	}
	async exec(message) {
		const coolPeople = [
			'881310086411190293', //Lisena
			'435443705055543306', //nacrt
			'501459973612765205', //motor
			'378587857796726785', //koxx12
		]

		if (coolPeople.includes(message.author.id) || message.member.roles.cache.has('799020944487612428')) {
			await sh('cd SkyblockClient-REPO && git reset --hard && git pull')

			const filter = (i) => i.user.id == message.author.id
			const filterMsg = (m) => m.author.id == message.author.id

			const dotThen = message.channel.createMessageCollector({ filter: filterMsg, time: 60000 })
			const dotThen1 = message.channel.createMessageCollector({ filter: filterMsg, time: 60000 })

			const firstRow = new MessageActionRow().addComponents(
				new MessageButton().setStyle('LINK').setURL('https://github.com/nacrt/SkyblockClient-REPO').setLabel('View the repo'),

				new MessageButton().setCustomId('repoEditor|editMods').setStyle('PRIMARY').setLabel('Change something about a mod')
			)

			const botMsg = await message.reply({
				content:
					'What would you like to do with the repo?\n\n**After 60 seconds with no response on any of the upcoming prompts, the command will exit. \nIf it asks you to send a message, do not send a message in this channel until you have finished the command, or it no longer wants you to send messages. \nIf *anything* goes wrong, the command will automatically end.**',
				components: [firstRow],
			})
			try {
				await message.channel.awaitMessageComponent({ filter, time: 60000 }).then(async (interaction) => {
					if (interaction.customId == 'repoEditor|editMods') {
						sh('cd SkyblockClient-REPO && git reset --hard && git pull')
						const modJson = JSON.parse(await fs.readFileSync('SkyblockClient-REPO/files/mods.json', 'utf-8'))
						const modJson2 = JSON.parse(await fs.readFileSync('SkyblockClient-REPO/files/mods.json', 'utf-8'))
						//const oldMod = modJson
						let modString = ''
						modJson.forEach((mod) => {
							modString = modString + `\`${mod.id}\`\n`
						})

						await interaction.reply({ content: "What is the ID of the mod would you like to edit?\nIf you don't know what the IDs are, check `-modlist` or the repo" })

						dotThen.once('collect', async (msg: Message) => {
							const mod = modJson.find((thing) => thing.id == msg.content.toLowerCase())
							const modID = mod.id
							const mod2 = modJson2.find((thing) => thing.id == msg.content.toLowerCase())

							if (!mod) {
								return await msg.reply("That isn't a valid mod. Command canceled.")
							}

							const rowWithActionButtons = new MessageActionRow().addComponents(
								new MessageButton().setLabel(`Update ${mod.display}`).setCustomId('updateMod').setStyle('PRIMARY'),

								new MessageButton().setLabel(`Edit ${mod.display}`).setCustomId('editMod').setStyle('PRIMARY')
							)

							await msg.reply({ content: `What would you like to do to **${mod.display}**?`, components: [rowWithActionButtons] })

							await message.channel.awaitMessageComponent({ filter, time: 60000 }).then(async (interaction) => {
								if (interaction.customId === 'updateMod') {
									await interaction.reply('What is the **direct download URL** for the new version?')

									dotThen.once('collect', async (msg) => {
										const newUrl = msg.content
										let newFileName = decodeURIComponent(newUrl.split('/')[newUrl.split('/').length - 1])

										await sh('curl -L ' + newUrl + ' --output temp/' + newFileName)
										const newmd5 = (await sh('md5sum temp/' + newFileName)).stdout.split(' ')[0]

										const notmsg = await msg.reply(
											`Mod ${mod.display}:\nLink: ${newUrl}\nHash: ${newmd5}\nFile: ${newFileName}\nTo confirm file name, type \`done\`, else type the new file name.`
										)

										dotThen.once('collect', async (msg) => {
											if (msg.content.toLowerCase() === 'done') {
												if (newFileName === decodeURIComponent(mod2.file) && newUrl === mod2.url && mod2.hash && mod2.hash == newmd5) {
													return await msg.reply('You have changed nothing, so the command has been exited.')
												}

												let allThings = []

												modJson.forEach((nmod) => {
													if (nmod.id === modID) {
														nmod.file = newFileName
														nmod.url = newUrl
														nmod.hash = newmd5
													}
													allThings.push(nmod)
												})

												const newJson = JSON.stringify(allThings, null, 4)

												fs.writeFileSync('SkyblockClient-REPO/files/mods.json', newJson)
												fs.appendFileSync('SkyblockClient-REPO/files/mods.json', '\n')

												await sh(`cd SkyblockClient-REPO && git commit -am "Update ${mod2.display} to ${newFileName}" && git push`)

												await msg.reply('The repo has been updated succesfully.')
											} else {
												if (!msg.content.endsWith('.jar')) {
													newFileName = `${msg.content}.jar`
												} else {
													newFileName = msg.content
												}

												console.log(`${newFileName}\n${mod2.file}\n\n${newUrl}\n${mod2.url}`)
												if (newFileName === mod2.file && newUrl === mod2.url && mod2.hash && mod2.hash == newmd5) {
													return await msg.reply('You have changed nothing, so the command has been exited.')
												}

												let allThings = []

												modJson.forEach((nmod) => {
													if (nmod.id === modID) {
														nmod.file = newFileName
														nmod.url = newUrl
														nmod.hash = newmd5
													}
													allThings.push(nmod)
												})

												const newJson = JSON.stringify(allThings, null, 4)

												fs.writeFileSync('SkyblockClient-REPO/files/mods.json', newJson)

												await sh(`cd SkyblockClient-REPO && git commit -am "Update ${mod2.display} to ${newFileName}" && git push`)

												await msg.reply('The repo has been updated succesfully.')
											}
										})

										// let allThings = []

										// modJson.forEach(nmod => {
										//     if (nmod.id === modID) {
										//         nmod.file = newFileName
										//         nmod.url = newUrl
										//     }
										//     allThings.push(nmod)
										// })

										// const newJson = JSON.stringify(allThings, null, 4)

										// await fs.writeFileSync('SkyblockClient-REPO/files/mods.json', newJson)

										// sh(`cd SkyblockClient-REPO && git commit -am "Update ${mod2.display}" && git push`)

										// await notmsg.reply('The repo has been updated succesfully.')
									})
								}

								if (interaction.customId === 'editMod') {
									await interaction.reply(`What about **${mod.display}** would you like to edit?`)

									dotThen1.once('collect', async (msg) => {
										const key = Object.keys(mod).find((key) => key === msg.content)

										if (key === undefined) {
											return await msg.reply(`**${mod.display}** does not have that key`)
										} else if (typeof mod[key] != 'string') {
											return await msg.reply(
												`${key} is not a string, and I honestly dont trust myself to mess with non-strings, and not fuck them up somehow. Please edit this in the actual repo.`
											)
										} else {
											await msg.reply(`${key} of ${mod.display}: **${mod[key]}**\n\nWhat would you like the new value to be?`)
											dotThen1.once('collect', async (msg) => {
												let allThings = []

												modJson.forEach((nmod) => {
													if (nmod.id === modID) {
														nmod[key] = msg.content
													}
													allThings.push(nmod)
												})

												const newJsonString = JSON.stringify(allThings, null, 4)

												const rowWithConfirmationButtons = new MessageActionRow().addComponents(
													new MessageButton().setCustomId('repoIWastedMyTime').setLabel('No').setStyle('DANGER'),
													new MessageButton().setCustomId('repoConfirmChanges').setLabel('Yes').setStyle('SUCCESS')
												)

												await msg.reply({
													content: `Are you sure you want to make this change?\n\`\`\`diff\n-${key}: "${mod2[key]}"\n+${key}: "${msg.content}"\`\`\`\n*also this one is 15 seconds it shouldnt take you that long lol*`,
													components: [rowWithConfirmationButtons],
												})

												await message.channel.awaitMessageComponent({ filter, time: 15000 }).then(async (interaction) => {
													if (interaction.customId === 'repoIWastedMyTime') {
														return await interaction.reply('gg you wasted your time, also i wont make the changes')
													} else if (interaction.customId === 'repoConfirmChanges') {
														await interaction.reply('Updating repo...').then(async () => {
															if (mod2[key] === allThings.find((m) => m.id === modID)[key])
																return interaction.editReply("I can't change something to be itself. The command has been exited.")

															try {
																await fs.writeFileSync('SkyblockClient-REPO/files/mods.json', newJsonString)
																sh(`cd SkyblockClient-REPO && git commit -am "Edit ${mod2.display}.${key}" && git push`)
																await interaction.editReply('The repo has been updated!')
															} catch (err) {
																return interaction.editReply(`Failed to edit ${mod2.display}.${key}`)
															}
														})
													} else {
														return interaction.reply(
															'you clicked a button from an autoresponse or something and the repo command is now over because djs bad and im stupid'
														)
													}
												})
											})
										}
									})
								}
							})
						})
					}
				})
			} catch (err) {
				if (err == 'Error [INTERACTION_COLLECTOR_ERROR]: Collector received no interactions before ending with reason: time') {
					botMsg.edit({ content: 'it has been one minute and you have done nothing so the command has expired', components: [] })
				} else {
					this.handler.emitError(err, message, this)
				}
			}
		} else await message.reply('https://github.com/nacrt/SkyblockClient-REPO')
	}
}
