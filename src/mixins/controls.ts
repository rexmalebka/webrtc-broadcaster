import type App from '../App.vue'
import type {scene,  source, AppData} from '../types'

const controls_mixin = {
	data:{
		output:{
			resolution: {
				width: window.screen.availWidth,
				height: window.screen.availHeight
			},

			streaming: false,
			canvas: document.createElement('canvas')
		}

	},
	emits:[
		'change_output_resolution',
		'change_streaming_state',
		'change_output_canvas',
	],
	computed:{
	},
	methods: {
		change_output_resolution(this:App,new_resolution:{width:number, height:number}){
			this.output.resolution.width = new_resolution.width
			this.output.resolution.height = new_resolution.height
		},
		change_output_canvas(this:App, new_canvas:HTMLCanvasElement){
			this.output.canvas = new_canvas
		
		},
		change_streaming_state(this:App, new_state:boolean){
			this.output.streaming = new_state

		}
	}
}

export default controls_mixin
