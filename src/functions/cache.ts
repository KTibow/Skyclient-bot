import got from 'got/dist/source'
import fs from 'fs'

export class CrashFixesCache {
	public fixes: {
		fixes: 
		{
			name: string; 
			fix: string; 
			causes: 
			{ 
				method: string; 
				value: string; 
			}[] 
		}[];
		fixtypes: {
			name: string;
			no_ingame_display: boolean;
			server_crashes: true;
		},
		default_fix_type: number
	}


	public async fetch() {
		const fixes = JSON.parse(await fs.readFileSync('CrashData/crashes.json', 'utf-8'))

		this.fixes = fixes
		return fixes
	}

	public all() {
		return this.fixes
	} 
}

export class ModsCache {
	public mods: SkyclientMod[] = []

	public async fetch(): Promise<SkyclientMod[]> {
		const mods = JSON.parse(await fs.readFileSync('SkyblockClient-REPO/files/mods.json', 'utf-8'))

		this.mods = mods
		return mods
	}

	public get(query: string): SkyclientMod | undefined {
		const mod = this.mods.find((mod) => mod.id === query || mod.display === query || mod.nicknames?.includes(query))
		if (!mod) return undefined
		if (mod.display === 'no') return undefined

		return mod
	}

	public all() {
		return this.mods
	} 
}

export class PacksCache {
	public packs: SkyclientPack[] = []

	public async fetch(): Promise<SkyclientPack[]> {
		const packs = JSON.parse(await fs.readFileSync('SkyblockClient-REPO/files/packs.json', 'utf-8'))

		this.packs = packs
		return packs
	}

	public get(query: string): SkyclientPack | undefined {
		return this.packs.find((p) => p.id === query || p.display === query)
	}

	public all() {
		return this.packs
	} 
}

export class DiscordsCache {
	public discords: SkyclientDiscord[] = []

	public async fetch(): Promise<SkyclientDiscord[]> {
		const discords = JSON.parse(await fs.readFileSync('SkyblockClient-REPO/files/discords.json', 'utf-8'))

		this.discords = discords
		return discords
	}

	public get(query: string): SkyclientDiscord | undefined {
		return this.discords.find((d) => d.id === query || d.fancyname === query || d.nicknames.includes(query))
	}

	public all() {
		return this.discords
	} 
}

export type SkyclientMod = {
	id: string
	nicknames?: string[]
	forge_id?: string
	enabled?: boolean
	file: string
	url?: string
	display: string
	description: string
	icon: string
	actions?: Actions
	categories: string[]
	packages?: string[]
	config?: boolean
	files?: string[]
	command?: string
	creator?: string
	hidden?: boolean
	discordcode?: string
}

export type SkyclientPack = {
	id: string
	enabled?: boolean
	file: string
	display: string
	description: string
	url?: string
	icon: string
	creator: string
	discordcode?: string
	categories?: string[]
	actions?: Actions
	hidden?: boolean
}

type Actions = {
	method?: string
	document?: string
	icon?: string
	text?: string
	creator?: string
	link?: string
}[]

export type SkyclientDiscord = {
	id: string
	code: string
	partner: boolean | false
	fancyname: string
	description: string
	icon: string
	nicknames?: string[]
	mods?: string[]
	packs?: string[]
}
