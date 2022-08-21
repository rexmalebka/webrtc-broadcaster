<template>
	<div class="color_source_params" :id="'color_'+source.name">
		<div class="color_source_form">
			<div><label for="">choose color</label></div>
			<div><input type="color" v-model="color"></div>
		</div>

	</div>
</template>

<script lang="ts">
import {defineComponent } from 'vue'

export default defineComponent({
	name:'color_source',
	props:[
		'source'
	],
	data(){
		return{
			color: "0x000000"
		}
	},
	mounted(){
		console.debug('color component source mounted', this)
	}
})
</script>

<style>
.color_source_params{
	display:flex;
	flex-direction:column;
}

.color_source_form{
	display:flex;
}

.color_source_preview:{
	display:flex;
	flex-direction:column;
	align-items:center;
}

</style>
