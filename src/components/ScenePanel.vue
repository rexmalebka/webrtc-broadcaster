<template>
	<div id="ScenePanel">
		<div class="title">
			<div>
				<label for="scenes">Scenes</label>
			</div>
		</div>
		<div class="content">
			<div class="scene_data" 
				:class="{selected: (item == selected_scene)}"
				v-for="(scene, item) in scenes"
				@click="$emit('update:selected_scene',item)"
				@blur="renaming=false"
				@dblclick="renaming=true">
				<input type="text" 
					@blur="(e)=>{renaming=false; $emit('rename_scene', e.target.value)}"
					@keydown.enter.prevent="(e)=>{renaming=false; $emit('rename_scene', e.target.value)}"
					@keydown.esc.prevent="(e)=>{renaming=false; $emit('rename_scene', e.target.value)}"
					:value="scene.name" 
					v-if="renaming && item == selected_scene">
				<label for="" v-else>
					{{scene.name}}
				</label>
			</div>
		</div>
		<div class="options">
			<div
				@click="$emit('add_scene')">
				<img src="img/plus.png">
			</div>
			<div
				@click="$emit('remove_scene')">
				<img src="img/minus.png">
			</div>
			<div
				@click="$emit('up_scene')">
				<img src="img/top.png">
			</div>
			<div
				@click="$emit('down_scene')">
				<img src="img/bottom.png">
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	name:'ScenePanel',
	props:[
		'scenes','selected_scene'
	],
	data(){
		return {
			renaming:false,
		}
	},
	mounted(){
		console.info('component ScenePanel mounted.', this)
	},
	methods:{
	},
})
</script>

<style>

.scene_data{
	display:flex;
	justify-content:space-around;
	align-items:center;
}

.scene_data input{
	background:#3c8dde;
	color:white;
	text-align:center;
}

</style>
