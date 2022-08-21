import type App from '../App.vue'
import type {scene,  source, AppData} from '../types'

const scene_mixin = {
	data():AppData{
		return{
			scenes:[
				{
					name: 'scene1',
					sources: [
						{
							name: 'source1',
							visible:true,
							type:"blank",
							data: {
								canvas:document.createElement('canvas')
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
					],
					selected_source:0,
				},
				{
					name: 'scene2',
					sources: [],

					selected_source:0,
				},
			],
			selected_scene:0
		}
	},
	emits:[
		'update:selected_scene',
		'add_scene', 'remove_scene',
		'up_scene', 'down_scene',
		'rename_scene',
	],
	computed:{
		active_scene(this: App){
			return this.scenes[this.selected_scene]
		}
	},
	methods: {
		add_scene(this: App){	
			let name = `scene_${(Math.random() *Date.now()).toString(16).substr(0,8)}`

			let names = this.scenes.map( (scene:scene) => scene.name)

			while( names.indexOf(name)!=-1 ){
				name = `scene_${(Math.random() *Date.now()).toString(16).substr(0,8)}`
			}

			this.scenes.push({
				name: name,
				sources:[]
			})
		},
		remove_scene(this:App){
			if(this.scenes.length > 1 ){
				this.scenes.splice(this.selected_scene, 1)
				this.selected_scene = this.selected_scene ==  0 ? 0 :  this.selected_scene - 1

			} 
		},
		up_scene(this:App){
			if(this.selected_scene >= 1 ){
				const temp = this.scenes[this.selected_scene-1]
				this.scenes[this.selected_scene-1] = this.scenes[this.selected_scene]
				this.scenes[this.selected_scene] = temp
				this.selected_scene--
			}		
		},
		down_scene(this:App){
			if(this.selected_scene < this.scenes.length-1 ){
				const temp = this.scenes[this.selected_scene+1]
				this.scenes[this.selected_scene+1] = this.scenes[this.selected_scene]
				this.scenes[this.selected_scene] = temp
				this.selected_scene++

			}		
		},
		rename_scene(this:App, name:string){
			let names = this.scenes.map( (scene:scene) => scene.name)
			if(names.indexOf(name)==-1){
				this.scenes[this.selected_scene].name = name			
			}
		}
	}
}

export default scene_mixin
