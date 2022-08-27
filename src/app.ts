import {createApp,defineComponent} from 'vue'
import {createRouter, createWebHashHistory} from 'vue-router'
import App from './App.vue'
import Watch from './Watch.vue'
import Home from './Home.vue'

const routes = [
	{path:'/', component:App},
	{path:'/watch/:id', component:Watch}
]


const router = createRouter({
	history: createWebHashHistory(),
	routes, // short for `routes: routes`
})

export default createApp(Home).use(router).mount('#app')
