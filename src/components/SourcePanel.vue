<template>
	<div id="SourcePanel">
		<div class="title">
			<div>
				<label for="sources">Sources</label>
			</div>
		</div>
		<div class="content">
			<div id="sources_list">
				<div v-if="active_scene.sources.length == 0">
					<label for="">
						No sources in selected scene.
					</label>
				</div>
				<div class="source_data" 
					v-else
					@click="$emit('update:selected_source',item)"
					:class="{selected: item == active_scene.selected_source}"
					v-for="(source, item) in active_scene.sources"
				>
					<div
						class="source_name"
						@dblclick="renaming=true"
					>
						<input type="text"
							@blur="(e)=>{renaming=false; $emit('rename_source', e.target.value)}"
							@keydown.enter.prevent="(e)=>{renaming=false; $emit('rename_source', e.target.value)}"
							@keydown.esc.prevent="(e)=>{renaming=false; $emit('rename_source', e.target.value)}"
							:value="source.name"
							v-if="renaming && item == active_scene.selected_source">
							<label for="" v-else>
								{{source.name}}
							</label>
						</div>
						<div 
							@dblclick="$emit('toggle_visibility')"
							class="hide_source">

							<img class="visibility_source" :src="source.visible ? 'img/eye_open.png': 'img/eye_closed.png'" alt="">
						</div>
					</div>
				</div>
				<div id="source_parameters" v-if="active_scene.sources.length >0">
					<div class="title">
						<div>
							<label for="">{{active_scene.sources[active_scene.selected_source].name}}</label>
						</div>
					</div>
					<div id="source_parameters_list"> 
						<div><label for="type">type</label></div>
						<div>
							<select id="" name="" 
								@change="$emit('change_source_type',$event.target.value)"
								v-bind:value="active_scene.sources[active_scene.selected_source].type">
								<option :value="type" v-for="(type, item) in ['blank', 'image', 'color','video', 'capture', 'text', 'audio']">{{type}}</option>
							</select>
						</div>

						<div><label for="type">resolution</label></div>
						<div class="resolution_inputs">
							<input type="number" 
								v-model.lazy="width">
							<input type="number" 
								v-model.lazy="height">
						</div>
						

						<div><label for="type">position</label></div>
						<div class="position_inputs">
							<input type="number" 
								v-model.lazy="pos_x">
							<input type="number" 
								v-model.lazy="pos_y">
						</div>

						<div>
							<component 
								:source="active_scene.sources[active_scene.selected_source]"
								@change_source_component_resolution="(res)=>$emit('change_source_resolution',res)"
								@change_source_canvas="(e)=>$emit('change_source_canvas',e)"
								v-show="active_scene.selected_source == item" 
								:is="source.type+'_component'" 
								v-for="(source, item) in active_scene.sources"></component>
						</div>
					</div>
				</div>
			</div>
			<div class="options">
				<div
					@click="$emit('add_source')">
					<img src="img/plus.png">
				</div>
				<div
					@click="$emit('remove_source')">
					<img src="img/minus.png">
				</div>
				<div
					@click="$emit('up_source')">
					<img src="img/top.png">
				</div>
				<div
					@click="$emit('down_source')">
					<img src="img/bottom.png">
				</div>
			</div>
		</div>
	</template>

<script lang="ts">
import { defineComponent } from 'vue'
import blank_component from './sources/blank.vue'
import image_component from './sources/image.vue'
import color_component from './sources/color.vue'

export default defineComponent({
	name:'SourcePanel',
	props:[
		'active_scene'
	],
	components:{
		blank_component,
		image_component,
		color_component,
	},
	computed:{
		type:{
			get():string{
				return this.$props.active_scene.sources[this.$props.active_scene.selected_source].type
			},
			set(type:string){
				this.$props.active_scene.sources[this.$props.active_scene.selected_source].type = type
			}
		},
		resolution():{width:number, height:number}{
			return this.$props.active_scene.sources[this.$props.active_scene.selected_source].resolution		
		},
		height:{
			get():number{
				return this.resolution.height
			},
			set(new_height:number){
				new_height = Number(new_height)

				if(!isNaN(new_height)){
					this.$emit('change_source_resolution', {width: this.width, height: new_height})
				}
			}
		},
		width:{
			get():number{
				return this.resolution.width
			},
			set(new_width:number){
				new_width = Number(new_width)

				if(!isNaN(new_width)){
					this.$emit('change_source_resolution', {width: new_width, height: this.height})
				}
			}
		},
		position():{x:number;y:number}{
			return this.$props.active_scene.sources[this.$props.active_scene.selected_source].position
		},
		pos_x:{
			get():number{
				return this.position.x
			},
			set(new_x:number){
				new_x = Number(new_x)

				if(!isNaN(new_x)){
					this.$emit('change_source_position', {x: new_x, y: this.pos_y})
				}
			}
		},
		pos_y:{
			get():number{
				return this.position.y
			},
			set(new_y:number){
				new_y = Number(new_y)

				if(!isNaN(new_y)){
					this.$emit('change_source_position', {y: new_y, x: this.pos_x})
				}
			}
		},

	},
	watch:{
	},
	data(){
		return {
			renaming:false,
			
		}
	},
	mounted(){
		console.info('component SourcePanel mounted.', this)
	},
	methods:{
	},
})
</script>

<style>
#SourcePanel .content{
	display:flex;
	overflow-y:auto;
	flex-direction:column;
}

.visibility_source{
	width:15px;
	height:15px;
}

.source_data{
	display:flex;
	justify-content:space-between;
	align-items:center;
	padding:0 1em 0 1em;
}
.source_data .source_name{
	flex:90%;
}

.source_data .hide_source{
	flex:10%;
}

.source_data input{
	background:#3c8dde;
	color:white;
	text-align:center;
}

#source_parameters .title{
	background:#464546;
	text-align:center;
	flex:5%;
	display:flex;
	justify-content:space-between;
	align-items:center;
}

#source_parameters .title > div{
	flex:1;
}

#sources_list {
	flex:50%;
	overflow-y: scroll;
}

#source_parameters {
	flex:50%;
	overflow-y:scroll;
}

#source_parameters_list{
	display:flex;
	justify-content:space-between;
	align-items:center;
	flex-wrap:wrap;
	padding:0 1em 0 1em;
}

#source_parameters_list div{
	flex:48%;
}

.resolution_inputs input, .position_inputs input{
	width:20%;
}

</style>
