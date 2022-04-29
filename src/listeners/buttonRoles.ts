// import { BotListener } from '../extensions/BotListener';

// export default class buttonRoles extends BotListener {
//     constructor() {
//         super('buttonRoles', {
//             emitter: 'client',
//             event: 'interactionCreate'
//         });
//     }

//     async exec(interaction) {
//         if(interaction.componentType != 'BUTTON') {return}
//         const reactionRoleIDRegex = /[0-9]{18}\|[0-9]{18}/
//         if (!interaction.customId.match(reactionRoleIDRegex)) return console.log('not a role')

//         const IDs = interaction.customId.split('|')

//         const guild = await this.client.guilds.cache.get(IDs[0])
//         const buttonRole = await guild.roles.cache.get(IDs[1])

//         let roleArray = []
//         interaction.member.roles.cache.forEach(role => {
//             roleArray.push(role.id)
//         })

//         if (roleArray.includes(buttonRole.id)) {
//             await interaction.reply({content:`You have **${buttonRole.name}** already, so I'm removing it from you.`, ephemeral:true})
//             interaction.member.roles.remove(buttonRole)
//         }
//         else {
//             await interaction.reply({content:`You don't have **${buttonRole.name}**, so I'm giving it to you.`, ephemeral:true})
//             interaction.member.roles.add(buttonRole)
//         }
//     }
// }
