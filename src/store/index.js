import Vue from 'vue'
import Vuex from 'vuex'
import auth from './auth'

import { defaultClient as apolloClient } from '../main'
import { GET_POSTS, ADD_POST, SEARCH_POSTS, GET_USER_POSTS, UPDATE_USER_POST, DELETE_USER_POST, INFINITE_SCROLL_POSTS } from '../queries'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		posts: [],
		searchResults: [],
    loading: false,
    userPosts: []
	},
	getters: {
		posts: state => state.posts,
		searchResults: state => state.searchResults,
    loading: state => state.loading,
    userPosts: state => state.userPosts,
	},
	mutations: {
		setPosts(state, payload){
			state.posts = payload
		},
		setLoading(state, payload){
			state.loading = payload
		},
		setSearchResults: (state, payload) => {
      if (payload !== null) {
        state.searchResults = payload;
      }
    },
    setUserPosts: (state, payload) => {
      state.userPosts = payload;
    },
    clearSearchResults: state => (state.searchResults = []), 
	},
	actions: {
		getPosts: ({ commit }) => {
			commit("setLoading", true)
			apolloClient
				.query({
					query: GET_POSTS
				}).then(({ data }) => {
					commit("setPosts", data.getPosts)
					commit("setLoading", false)
					console.log(data.getPosts)
				}).catch(err => {
					commit("setLoading", false)
					console.log(err)
				})
		},
		searchPosts: ({ commit }, payload) => {
      apolloClient
        .query({
          query: SEARCH_POSTS,
          variables: payload
        })
        .then(({ data }) => {
          commit("setSearchResults", data.searchPosts);
        })
        .catch(err => console.error(err));
    },
    getUserPosts: ({ commit }, payload) => {
      apolloClient
        .query({
          query: GET_USER_POSTS,
          variables: payload
        })
        .then(({ data }) => {
          commit("setUserPosts", data.getUserPosts);
          // console.log(data.getUserPosts);
        })
        .catch(err => {
          console.error(err);
        });
    },
    updateUserPost: ({ state, commit }, payload) => {
      apolloClient
        .mutate({
          mutation: UPDATE_USER_POST,
          variables: payload
        })
        .then(({ data }) => {
          const index = state.userPosts.findIndex(
            post => post._id === data.updateUserPost._id
          );
          const userPosts = [
            ...state.userPosts.slice(0, index),
            data.updateUserPost,
            ...state.userPosts.slice(index + 1)
          ];
          commit("setUserPosts", userPosts);
        })
        .catch(err => {
          console.error(err);
        });
    },
    deleteUserPost: ({ state, commit }, payload) => {
      apolloClient
        .mutate({
          mutation: DELETE_USER_POST,
          variables: payload
        })
        .then(({ data }) => {
          const index = state.userPosts.findIndex(
            post => post._id === data.deleteUserPost._id
          );
          const userPosts = [
            ...state.userPosts.slice(0, index),
            ...state.userPosts.slice(index + 1)
          ];
          commit("setUserPosts", userPosts);
        })
        .catch(err => {
          console.error(err);
        });
    },
    addPost: ({ commit }, payload) => {
      apolloClient
        .mutate({
          mutation: ADD_POST,
          variables: payload,
          update: (cache, { data: { addPost } }) => {
            // First read the query you want to update
            const data = cache.readQuery({ query: GET_POSTS });
            // Create updated data
            data.getPosts.unshift(addPost);
            // Write updated data back to query
            console.log(data);
            cache.writeQuery({
              query: GET_POSTS,
              data
            });
          },
          // optimistic response ensures data is added immediately as we specified for the update function
          optimisticResponse: {
            __typename: "Mutation",
            addPost: {
              __typename: "Post",
              _id: -1,
              ...payload
            }
          },
          // Rerun specified queries after performing the mutation in order to get fresh data
          refetchQueries: [
            {
              query: INFINITE_SCROLL_POSTS,
              variables: {
                pageNum: 1,
                pageSize: 2
              }
            }
          ]
        })
        .then(({ data }) => {
          console.log(data.addPost);
        })
        .catch(err => {
          console.error(err);
        });
    }, 
	},
	modules: {
		auth
	}
})
