<template>
	<div id="container_live">
		<div id="config">
			<div class="title">
				<div><label for="">p2p config</label></div>
			</div>
			<div id="peerjs_server">
				<div class="title">
					<div><label for="">peerjs server</label></div>
				</div>
				<div class="peerjs_form">
					<div><label for="">host</label></div>
					<div><input type="text"></div>
					<div><label for="">secure</label></div>
					<div><input type="checkbox"></div>
				</div>
			</div>

			<div id="ice_servers">
				<div class="title">
					<div><label for="">ice servers</label></div>
				</div>
				<div class="ice_servers_form">
					<div><label for="">urls</label></div>
					<div><input type="text"></div>
					<div><label for="username">username</label></div>
					<div><input type="text"></div>
					<div><label for="">credentials</label></div>
					<div><input type="text"></div>
					<div><button>add</button></div>
				</div>

			</div>
		</div>
		<div id="video_live">
			<video ref="live" id="preview" autoplay muted ></video>
		</div>
	</div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import {Peer} from 'peerjs'

export default defineComponent({
	name: 'watch_component',	
	data(){

		const peerjs = {
			/*
			host:'peerjs.piranhalab.cc',
			secure:false
			 */
			host: '0.peerjs.com',
			secure: false
		}

		const ice_servers = [
			/*	{
				urls: 'stun:stun.piranhalab.cc:5349'
			},
			{
				urls: 'turn:turn.piranhalab.cc:3478',
				username: 'guest',
				credential:"somepassword"
			}
			 */
		]

		let a = new Uint32Array(3);

		window.crypto.getRandomValues(a);
		const id = (performance.now().toString(36)+Array.from(a).map(A => A.toString(36)).join("")).replace(/\./g,"");

		const peer = new Peer(
			id,{
				host: peerjs.host,
				secure: peerjs.secure,
				config: {
					iceServers: ice_servers
				},
				debug:3
			})


			peer.on('open', this.peerjs_on_open)

		return {
				id :id,
				peer: peer,
				peerjs:peerjs,
				ice_servers: ice_servers,
				ice_server:{
					urls:'',
					username:'',
					credential: ''
				},
			}
	},
	methods:{
		peerjs_on_open(id){
			console.debug("peerjs opened")
			this.id = id
			this.peer.on('call', this.peerjs_on_call)
			this.peer.connect(this.$route.params.id)
		},
		peerjs_on_call(call){
			console.debug("asddfsdf calllll", call)
			console.info(this.$refs.live, call.metadata.output, 666) 

			this.$refs.live.width =	call.metadata.output.width;
			this.$refs.live.height = call.metadata.output.height;

			call.on('stream', this.peerjs_on_stream)
			call.answer()
		},
		peerjs_on_stream(stream:MediaStream){
			console.debug("streaming uwu", this.$refs.live, stream)
			this.$refs.live.srcObject = stream;
		},
		peerjs_on_connection(conn:DataConnection){
		},
	},
	mounted(){
		console.debug("component watch mounted", this)
	}
})
</script>


<style>
#container_live{
	width:100%;
	display:flex;
	flex-direction:row;
	margin:1em;
	background: #1f1e1f;
	border:1px solid #464546;
	color:white;
}

#video_live{
	flex:70%;
}

#config{
	flex:30%;
	border:1px solid #464546;
}

#config .title{
	background: #464546;
	color:white;
	display:flex;
	justify-content:space-around;
	border:1px solid #1f1e1f;
}

</style>
