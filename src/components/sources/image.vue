<template>
	<div :id="'image_'+source.name" class="image_source_params">
		<div class="image_source_toggle">
			<button 
				:class="{selected:from_local}"
				@click="from_local = true">from local</button>
			<button 
				:class="{selected:!from_local}"
				@click="from_local = false">from URL</button>
		</div>


		<div class="image_source_form" v-if="from_local">
			<div><label for="from_local">from local</label></div>
			<div><button>select file</button></div>
		</div>

		<div class="image_source_form" v-else>
			<div>
				<label for="from url">from url</label>
			</div>
			<div>
				<input 
					@change.lazy="select_url"
					type="text">
			</div>
		</div>
		<div class="image_source_preview">	
			<div><label for="">preview</label></div>
			<img
				@load=onload_image
				class="image_source_img"
				:src="src" ref="img"  alt="">
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name: 'image_source',
	props:['source'],
	data(){
		return{
			from_local: false,
			canvas: document.createElement('canvas'),
			src:""
		}
	},
	methods:{
		select_url(e:Event){
			const url = (e.target as HTMLInputElement).value

			const app = this
			fetch(url)
				.then(response =>{
					const reader = new FileReader();
					console.debug("fetching data", response)

					response.blob()
						.then(imageBlob =>{
							console.debug("getting blob", imageBlob)
							reader.readAsDataURL(imageBlob);
							reader.onloadend = () => {
								const base64data = reader.result;
								app.src = (base64data as string)

							}
						})
				})
				.catch(response=>{})
		},
		onload_image(e:Event){
			const img = e.target as HTMLImageElement

			this.$emit('change_source_component_resolution', 
				   {
					   width: img.naturalWidth,
					   height: img.naturalHeight
				   }
			)
			this.canvas.width = img.naturalWidth,
			this.canvas.height = img.naturalHeight

			const ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
			ctx.drawImage(img, 0, 0,  img.naturalWidth, img.naturalHeight);

			this.$emit('change_source_canvas', this.canvas)
		}
	},
	mounted(){
		console.debug(this.$refs.img,'miau')
		window.document.body.appendChild(this.canvas)
	}
})
</script>

<style>
.image_source_params{
	display:flex;
	flex-direction:column;
}

.image_source_toggle button{
	width:40%;
}

.image_source_form {
	display:flex;
}

.image_source_img{
	max-width:100%;
	max-height:100%;
}

.image_source_preview{
	display:flex;
	flex-direction:	column;
	align-items:center;
}


</style>

