<template>
	<div id="panels">
		<ScenePanel
			v-model:selected_scene="selected_scene"
			:scenes="scenes"

			@add_scene="add_scene"
			@remove_scene="remove_scene"

			@rename_scene="rename_scene"

			@up_scene="up_scene"
			@down_scene="down_scene"
			></ScenePanel>
		<SourcePanel
			v-model:selected_source="selected_source"
			:active_scene="active_scene"		

			@add_source="add_source"
			@remove_source="remove_source"

			@rename_source="rename_source"

			@up_source="up_source"
			@down_source="down_source"
			
			@change_source_resolution="change_source_resolution"
			@change_source_position="change_source_position"
			
			@change_source_type="change_source_type"

			@change_source_canvas="change_source_canvas"

			@toggle_visibility="toggle_visibility">
		</SourcePanel>
		<div></div>
		<ControlPanel
			@change_output_resolution="change_output_resolution"
			@change_streaming_state="change_streaming_state"
			:output="output"
		></ControlPanel>
	</div>
	<PreviewPanel
		:output="output"
		:scene="active_scene"
		:source="active_source"
		@change_output_canvas="change_output_canvas"
	></PreviewPanel>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import scene_mixin from './mixins/scenes'
import source_mixin from './mixins/sources'
import control_mixin from './mixins/controls'

import ScenePanel from './components/ScenePanel.vue'
import SourcePanel from './components/SourcePanel.vue'
import PreviewPanel from './components/PreviewPanel.vue'
import ControlPanel from './components/ControlPanel.vue'

import type {AppData} from './types'


export default defineComponent ({
	name:'App',
	mixins:[
		scene_mixin,
		source_mixin,
		control_mixin,
	],
	data(){
		return{
		}
	},
	components:{
		ScenePanel,
		SourcePanel,
		PreviewPanel,
		ControlPanel,
	},
	mounted(){
		console.info('component App mounted',this)
	},
})
</script>

<style>
html,body{
	margin:0px;
	height:100%;
}

#app{
	display:flex;
	height:100%;
}

#preview{
	flex: 1 1 50%;
}

#panels{
	flex: 1 1 50%;
	display:flex;
	flex-wrap:wrap;
	padding:1em;
	color:white;
}

#panels > div{
	flex:1 1 45%;
	display:flex;
	flex-direction:column;
	justify-content:flex-start;
	background:#1f1e1f;
	border:1px solid #464546;
	max-height:50%;
	min-height:48%;
}

#panels > div > .title{
	background:#464546;
	text-align:center;
	flex:5%;
	display:flex;
	justify-content:space-between;
	align-items:center;
}

#panels > div > .title > div{
	flex:1;
}

#panels > div .content{
	flex:90%;
}

#panels > div .options{
	background:#464546;
	text-align:center;
	flex: 5%;
	display:flex;
	flex-direction:row;
	justify-content:space-around;
	align-items:center;
	padding:0 20% 0 20%;
}

#panels > div .options > div >img{
	width:15px;
	height:15px;
}
.content{
	overflow-y:scroll;
}

.selected{
	background:#3c8dde;
}

img{
	-moz-user-select: none;
	-webkit-user-select: none;
	user-select: none;
}

</style>
