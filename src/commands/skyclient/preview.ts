import { MessageEmbed } from 'discord.js'
import { BotCommand } from '../../extensions/BotCommand'
import msgutils from '../../functions/msgutils'
import utils from '../../functions/utils'
import fs from 'fs'
import { exec } from 'child_process'
import { promisify } from 'util'

export default class networth extends BotCommand {
    constructor() {
        super('preview', {
            aliases: ['preview'],
            args: [{ id: 'pack', type: 'string', match: 'restContent' }],
            SkyClientOnly: true,

            // slash: true,
            // slashGuilds: utils.SkyClientGuilds,
            // slashOptions: [
            // 	{
            // 		name: 'player',
            // 		description: "The targetted player's IGN",
            // 		type: 'STRING',
            // 		required: true,
            // 	},
            // ],
            description: 'Gets a players overall networth',
        })
    }

    async exec(message, args) {
        if (!args.pack) {
            await message.reply("pack name must be provided");
            return;
        }

        let pack = this.client.packs.get(args.pack)

        if (!pack) {
            await message.reply("texturepack not found");
            return;
        }
        const uncleanUrl = pack.url ?? "https://github.com/nacrt/SkyblockClient-REPO/raw/main/files/packs/" + pack.file;
        const newUrl = uncleanUrl.replaceAll("%28", "(").replaceAll("%29", ")").replaceAll("%20", " ")
        const newCleanurl =uncleanUrl.replaceAll("(", "%28").replaceAll(")", "%29").replaceAll(" ", "%20")
        let newFileName = decodeURIComponent(newUrl.split('/')[newUrl.split('/').length - 1])

        let existsTemp = fs.existsSync("temp/" + newFileName);
        
        const sh = promisify(exec);

        if (!existsTemp) {
            const shDownload = promisify(exec);
            await shDownload('curl -L ' + newCleanurl + ' --output "temp/' + newFileName + '"')
        }

        fs.copyFileSync("temp/" + newFileName, "../PackPreview/pack.zip");

        const shPreview = promisify(exec);

        await shPreview("cd ../PackPreview && ./PackPreview pack=pack");

        await message.reply({
            files: ["../PackPreview/output/preview.png"]
        })
    }
}
