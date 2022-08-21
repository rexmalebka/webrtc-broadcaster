interface visual {
	canvas: HTMLCanvasElement
}

interface audiovisual {
	canvas: HTMLCanvasElement
	video: HTMLVideoElement 
}

export interface source{
	name: string
	visible: boolean
	type: "blank" | "image" | "color" | "video" | "capture" | "text" | "audio" 
	data: visual | audiovisual
	resolution:{
		width: number
		height: number
	}
	position:{
		x:number
		y:number
	}
}


export interface scene{
	name: string
	sources: source[]
	selected_source:number
}

export interface AppData{
	scenes: scene[]
	selected_scene:number
}
