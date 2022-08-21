import type App from '../App.vue'
import type {scene,  source, AppData} from '../types'

const source_mixin = {
	data:{
	},
	emits:[
		'update:selected_source',
		'toggle_visibility',
		'add_source', 'remove_source',
		'up_source', 'down_source',
		'rename_source',
		'change_source_resolution',
		'change_source_position',

		'change_source_type',
		'change_source_canvas',
	],
	computed:{
		selected_source:{
			get(this:App){
				return this.active_scene.selected_source			
			},
			set(this:App,index:number){
				this.active_scene.selected_source = index
			}
		},
		active_source(this: App){
			return this.active_scene.sources[this.active_scene.selected_source]
		},
		sources(this:App){
			return this.active_scene.sources
		},
	},
	methods: {
		add_source(this: App){	
			let name = `source_${(Math.random() *Date.now()).toString(16).substr(0,8)}`

			let names = this.sources.map( (source:source) => source.name)

			while( names.indexOf(name)!=-1 ){
				name = `source_${(Math.random() *Date.now()).toString(16).substr(0,8)}`
			}

			let new_source:source = {
				name: name,
				type: 'blank',
				visible:true,
				data:{
					canvas: document.createElement('canvas')
				},
				resolution:{
					width:0,
					height:0
				},
				position:{
					x:0,
					y:0
				}
			}

			this.sources.push(new_source)
		},
		remove_source(this:App){
			this.sources.splice(this.selected_source, 1)
			this.selected_source = this.selected_source ==  0 ? 0 :  this.selected_source - 1
		},
		up_source(this:App){
			if(this.selected_source >= 1 ){
				const temp = this.sources[this.selected_source-1]
				this.sources[this.selected_source-1] = this.sources[this.selected_source]
				this.sources[this.selected_source] = temp
				this.selected_source--
			}		
		},
		down_source(this:App){
			if(this.selected_source < this.sources.length-1 ){
				const temp = this.sources[this.selected_source+1]
				this.sources[this.selected_source+1] = this.sources[this.selected_source]
				this.sources[this.selected_source] = temp
				this.selected_source++

			}		
		},
		rename_source(this:App, name:string){
			let names = this.sources.map( (source:source) => source.name)
			if(names.indexOf(name)==-1){
				this.sources[this.selected_source].name = name			
			}
		},
		toggle_visibility(this:App){
			this.active_source.visible = !this.active_source.visible
		},
		change_source_resolution(this:App,new_resolution:{width:number, height:number}){
			this.active_scene.sources[this.active_scene.selected_source].resolution.width = new_resolution.width
			this.active_scene.sources[this.active_scene.selected_source].resolution.height = new_resolution.height
		},
		change_source_position(this:App,new_position:{x:number, y:number}){
			this.active_scene.sources[this.active_scene.selected_source].position.x  = new_position.x
			this.active_scene.sources[this.active_scene.selected_source].position.y  = new_position.y
		},
		change_source_type(this:App, type:string){
			this.active_scene.sources[this.active_scene.selected_source].type = type
		},
		change_source_canvas(this:App, canvas:HTMLCanvasElement){
			this.active_scene.sources[this.active_scene.selected_source].data.canvas = canvas
		}
	}
}

export default source_mixin
