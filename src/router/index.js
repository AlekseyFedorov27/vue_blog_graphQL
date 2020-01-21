import Vue from "vue"
import VueRouter from "vue-router"
import AddPost from '../components/Posts/AddPost'
import Posts from '../components/Posts/Posts'
import Post from '../components/Posts/Post'
import Profile from '../components/Auth/Profile'
import Signin from '../components/Auth/Signin'
import Signup from '../components/Auth/Signup'
import Home from '../components/Home'
import AuthGuard from "../AuthGuard"

Vue.use(VueRouter)

const routes = [
	{
		path: '/',
		name: "Home",
		component: Home
	},
	{
		path: '/signin',
		name: "Signin",
		component: Signin
	},
	{
		path: '/signup',
		name: "Signup",
		component: Signup
	},
	{
		path: '/profile',
		name: "Profile",
		component: Profile,
		beforeEnter: AuthGuard
	},
	{
		path: '/post/add',
		name: "AddPost",
		component: AddPost,
		beforeEnter: AuthGuard
	},
	{
		path: '/posts',
		name: "Posts",
		component: Posts
	},
	{
		path: '/posts/:postId',
		name: "Post",
		component: Post,
		props: true
	}
]

const router = new VueRouter({
	mode: "history",
	// base: process.env.BASE_URL,
	routes
})

export default router
