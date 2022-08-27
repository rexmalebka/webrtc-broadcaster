<template>
	<div id="control_panel">
		<div class="title">
			<div><label for="control">Controls</label></div>
		</div>

		<div class="content">	
			<div id="streamimg_form">
				<button 
					:disabled="disabled_button_streaming"
					@click="toggle_streaming">

					{{streaming ? 'stop': 'start'}} streaming</button>
			</div>
			<div id="streaming_url" v-if="streaming && disabled_button_streaming==false">
				<div @click="copy_clipboard"><label>{{url_streaming}}</label> </div>
			</div>
			<div id="control_parameters">
				<div><label for="">output resolution</label></div>
				<div>
					<input type="number" v-model.lazy="width">
					<input type="number" v-model.lazy="height">
				</div>
			</div>
			<div id="peerjs_server">
				<div class="title">
					<div><label for="">peerjs server</label></div>
				</div>
				<div class="peerjs_form">
					<div><label for="">host</label></div>
					<div><input type="text" v-model="peerjs.host"></div>
					<div><label for="">secure</label></div>
					<div><input type="checkbox" v-model="peerjs.secure"></div>
				</div>
			
			</div>
			<div id="ice_servers">
				<div class="title">
					<div><label for="">ice servers</label></div>
				</div>
				<div class="ice_servers_form">
					<div>
						<label for="">urls</label>
					</div>
					<div><input type="text" v-model="ice_server.urls"></div>
					
					<div>
						<label for="">username</label>
					</div>
					<div><input 
							v-model="ice_server.username"
							type="text"></div>

					<div>
						<label for="">credentials</label>
					</div>
					<div><input
							v-model="ice_server.credentials"
						       	type="text"></div>

				</div>
				<div id="add_ice_server"><button @click="add_ice_server">add</button></div>
				<div id="ice_servers_list">
					<div
						v-for="(server, item) in ice_servers"
					>
						<div class="remove_ice_server"><img 
								@click="remove_ice_server(item)"
								src="img/remove.png" alt=""></div>
						<div>
							<div><label for=""><b>urls</b></label></div>
							<div><label for="">{{server.urls}}</label></div>
						</div>
						<div>
							<div v-if="server.username">
								<label for=""><b>username</b></label>
							</div>
							<div v-if="server.username">
								<label for=""><i>{{server.username}}</i></label>
							</div>
						</div>
						<div>
							<div v-if="server.credential">
								<label for=""><b>credential</b></label>
							</div>
							<div v-if="server.credential">
								<label for=""><i>{{server.credential}}</i></label>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Peer from 'peerjs'
import type {DataConnection} from 'peerjs'

const lzwCompress = require('lzwcompress');


export default defineComponent({
	name: 'ControlPanel',
	props:[
		'output',
	],
	watch:{
		'output.canvas': {
			handler(){
			},
			deep:true
		}
	},
	computed:{
		streaming:{
			get():boolean{
				return this.output.streaming
			},
			set(new_state:boolean){
				this.$emit('change_streaming_state', new_state)			
			}
		},
		url_streaming():string{
			
			return `${window.location.origin}${location.pathname}#/watch/${this.id}`
		
		},
		width:{
			get():number{
				return this.output.resolution.width
			},
			set(new_width:number){
				new_width = Number(new_width)

				if(!isNaN(new_width)){
					this.$emit('change_output_resolution', {
						width:new_width,
						height: this.height					
					})
				}
			}
		},

		height:{
			get():number{
				return this.output.resolution.height
			},
			set(new_height:number){
				new_height = Number(new_height)

				if(!isNaN(new_height)){
					this.$emit('change_output_resolution', {
						height:new_height,
						width: this.width	
					})
				}
			}
		},
	},
	data(){

		interface  ice_server{
			urls: string
			username?: string
			credential?: string
		}


		let ice_servers:ice_server[] = []
		let mediaStream: MediaStream = new MediaStream()

		return {
			mediaStream: mediaStream,
			id:'',
			peer: new Peer(),
			peerjs:{
				/*
				host:'peerjs.piranhalab.cc',
				secure:true
				 */
				host:'0.peerjs.com',
				secure:false
			},
			ice_servers:ice_servers,
				/*
				{
					urls: 'stun:stun.piranhalab.cc:5349'
				},
				{
					urls: 'turn:turn.piranhalab.cc:3478',
					username: 'guest',
					credential:"somepassword"
					}
			],
				 */
			ice_server:{
				urls:'',
				username:'',
				credential: ''
			},
			disabled_button_streaming: false,
		}
	},
	methods:{
		add_ice_server(){
			if(this.ice_server.urls.trim() !=''){
				interface ice_server{
					urls: string
					username?: string
					credential?: string
				}

				let i_s:ice_server= {
					urls: this.ice_server.urls.trim()
				}

				if(this.ice_server.username.trim() != ''){
					i_s.username = this.ice_server.username.trim() as string
				}

				if(this.ice_server.credential.trim() != ''){
					i_s.credential = this.ice_server.credential.trim() as string
				}

				this.ice_servers.push(i_s)
				this.ice_server.urls=''
				this.ice_server.username=''
				this.ice_server.credential=''
			}
		},
		remove_ice_server(index:number){
			this.ice_servers.splice(index,1)		
		},
		peerjs_on_open(id:string){
			console.debug('peerjs opened')
			this.id = id
			
			this.mediaStream = this.output.canvas.captureStream(25)

			this.peer.on('connection', this.peerjs_on_connection)

			this.streaming = true
			this.disabled_button_streaming = false

		},
		peerjs_on_connection(conn: DataConnection){
			console.debug("connected", conn)

			this.peer.call(conn.peer, this.mediaStream, {
				metadata:{
					output:{
						width: this.output.resolution.width,
						height: this.output.resolution.height
					}			
				}
			})
		},
		toggle_streaming(){
			this.disabled_button_streaming = true
			if(this.streaming == false){

				this.peer.destroy()

				let a = new Uint32Array(3);
				window.crypto.getRandomValues(a);

				const id = (performance.now().toString(36)+Array.from(a).map(A => A.toString(36)).join("")).replace(/\./g,"");

				this.id = id
				
				if(this.peerjs.host.trim() != ''){
					let peer = new Peer(
						id,
						{
							host: this.peerjs.host.trim(),
							secure: this.peerjs.secure,
							config:{
								iceServers: this.ice_servers
							},
							debug:4
						})

					this.peer = peer
					if(this.peer !=null){
						this.peer.on('open', this.peerjs_on_open)
					}
				}
			}
		},
		copy_clipboard(){
			  navigator.clipboard.writeText(this. url_streaming)
		},
	},
	mounted(){
		console.info('component ControlPanel mounted',this)
		console.info(lzwCompress.pack(this.ice_servers))
		console.info(lzwCompress.pack(this.peerjs))
	}
})

</script>

<style>
#control_panel >.title{
	flex: 95%;
}
#control_panel .content{
	flex:95% !important;
	display:flex;
	flex-direction:column;
	align-items:center;
}

#control_parameters{
	display:flex;
	justify-content:space-between;
	flex-wrap:wrap;
	padding:0 1em 0 1em;
}

#control_parameters div{
	flex:48%;
}

#control_parameters div>input{
	width:20%;
}


#ice_servers, #peerjs_server{
	width:100%;
	display:flex;
	flex-direction:column;
}

#ice_servers .title, #peerjs_server .title{
	display:flex;
	align-items:center;
	flex-direction:column;
	background:#464546;
}

#ice_servers .ice_servers_form, #peerjs_server .peerjs_form{
	display:flex;
	flex-wrap:wrap;
	flex-direction:row;
	padding:0 1em 0 1em;
}

#ice_servers .ice_servers_form div, #peerjs_server .peerjs_form div{
	flex:30%;
}

#add_ice_server{
	display:flex;
	align-items:center;
	justify-content:space-around;
}

.remove_ice_server{
	display:flex;
	align-items:flex-end;
}

.remove_ice_server img{
	width:15px;
	height:15px;
}

#ice_servers_list div{
	display:flex;
	flex-direction:column;
	flex-wrap:wrap;
	background:#3a393a;
}

#ice_servers_list > div{
	padding:1em ;

}

#ice_servers_list div div{
	flex:1 1 auto;
}

#ice_servers_list .remove_ice_server{
	flex:100%;
}

#streaming_url{
	color:white;
	overflow-wrap:anywhere;
}
</style>
