import got from 'got/dist/source'

export class CrashFixesCache {
	public fixes: { fix: string; causes: { method: string; value: string }[] }[] = []

	public async fetch() {
		const fixes = await JSON.parse((await got.get('https://raw.githubusercontent.com/SkyblockClient/CrashData/main/crashes.json')).body).fixes

		this.fixes = fixes
		return fixes
	}
}

export class ModsCache {
	public mods: SkyclientMod[] = []

	public async fetch(): Promise<SkyclientMod[]> {
		const mods = await JSON.parse((await got.get('https://raw.githubusercontent.com/nacrt/SkyblockClient-REPO/main/files/mods.json')).body)

		this.mods = mods
		return mods
	}

	public get(query: string): SkyclientMod | undefined {
		const mod = this.mods.find((mod) => mod.id === query || mod.display === query || mod.nicknames?.includes(query))
		if (!mod) return undefined
		if (mod.display === 'no') return undefined

		return mod
	}
}

export class PacksCache {
	public packs: SkyclientPack[] = []

	public async fetch(): Promise<SkyclientPack[]> {
		const packs = await JSON.parse((await got.get('https://raw.githubusercontent.com/nacrt/SkyblockClient-REPO/main/files/packs.json')).body)

		this.packs = packs
		return packs
	}

	public get(query: string): SkyclientPack | undefined {
		return this.packs.find((p) => p.id === query || p.display === query)
	}
}

export class DiscordsCache {
	public discords: SkyclientDiscord[] = []

	public async fetch(): Promise<SkyclientDiscord[]> {
		const discords = await JSON.parse((await got.get('https://raw.githubusercontent.com/nacrt/SkyblockClient-REPO/main/files/discords.json')).body)

		this.discords = discords
		return discords
	}

	public get(query: string): SkyclientDiscord | undefined {
		return this.discords.find((d) => d.id === query || d.fancyname === query || d.nicknames.includes(query))
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
