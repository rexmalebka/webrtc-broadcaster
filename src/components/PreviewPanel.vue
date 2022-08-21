<template>
	<div id="preview_panel">
		<div class="title">
			<div><label for="">preview</label></div>
		</div>
		<div 
			ref="canvas_container"
			id="canvas_preview_container">
			<canvas ref="canvas_preview"></canvas>
		</div>
		<div id="streaming_info">
			<div><label for="">output resolution: {{resolution.width}}x{{resolution.height}}</label></div>		
			<div><label for="">streaming: {{output.streaming}}</label></div>		
		</div>

	</div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
	name:'PreviewPanel',
	props:[
		'output',
		'scene',
		'source',
	],
	watch:{
		'output.resolution':{
			handler(){
				this.adjust_canvas_res()
			},
			deep:true
		}
	},
	computed:{
		resolution(){
			return this.output.resolution
		},
		ratio(){
			return this.resolution.width / this.resolution.height
		},
		canvas(){
			const canvas = this.$refs.canvas_preview as HTMLCanvasElement	
			return canvas
		},
		ctx(){
			const ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
			return ctx
		},
		scale_res(){
			return{
				width: this.resolution.width,
				height: this.resolution.height
			}
		}
	},
	mounted(){
		console.info('preview component mounted', this)
		this.adjust_canvas_res()
		this.$emit('change_output_canvas', this.canvas)
		requestAnimationFrame(this.render_preview)
	},
	methods:{
		adjust_canvas_res(){
			const canvas = this.$refs.canvas_preview as HTMLCanvasElement

			canvas.width = this.scale_res.width
			canvas.height = this.scale_res.height
		},
		render_preview(){
			this.ctx.fillStyle = "#000000";
			this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

			let selected_data = {
				pos:{x:0,y:0},
				res:{w:0,h:0},
			}

			for(let i=this.scene.sources.length-1; i>=0;i--){
				const canvas = this.scene.sources[i].data.canvas			
				const pos_org = this.scene.sources[i].position
				const res_org = this.scene.sources[i].resolution

				const ratio_w = res_org.width / this.resolution.width
				const ratio_h = res_org.height / this.resolution.height

				const res = {
					width: this.scale_res.width * ratio_w,
					height: this.scale_res.height * ratio_h
				}



				const ratio_x = pos_org.x / this.resolution.width
				const ratio_y = pos_org.y / this.resolution.height

				const pos = {
					x: this.scale_res.width * ratio_x,
					y: this.scale_res.height * ratio_y
				}

				this.ctx.drawImage(canvas, pos.x, pos.y, res.width, res.height)
				if(i == this.scene.selected_source){
					this.ctx.strokeStyle = "#00ff00";
					this.ctx.strokeRect(pos.x, pos.y, res.width, res.height);
				}
			}

			requestAnimationFrame(this.render_preview)
		}
	}
})

</script>

<style>
#preview_panel{
	flex: 1 1 50%;
	color:white;
	padding:1em;
	display:flex;
	flex-direction:column;
	max-width: 50%;
}

#preview_panel > .title{
	background:#464546;
	text-align:center;
	display:flex;
	justify-content:space-around;
	align-items:center;

}

#canvas_preview_container{
	padding:1em;
	background-color: #4c4c4c;
	max-height: calc(100% - 3em);
}

#canvas_preview_container canvas{
	max-width:100%;
	max-height:100%;
}

#streaming_info{
	background-color:#1f1e1f;
	display:flex;
	flex-wrap:wrap;
	padding:0 1em 0 1em;
}

#streaming_info div{
	flex:1;
}
</style>
