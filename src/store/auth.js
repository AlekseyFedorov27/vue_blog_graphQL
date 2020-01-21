import router from "../router/index"
import { defaultClient as apolloClient } from '../main'
import { GET_CURRENT_USER, SIGNIN_USER, SIGNUP_USER } from '../queries'

export default {
	state: {
		user: null,
		error: null,
		AuthError: null
	},
	getters: {
		user: state => state.user,
		userFavorites: state => state.user ? state.user['favorites'] : 0,
		error: state => state.error,
		authError: state => state.AuthError,
	},
	mutations: {
    setUser: (state, payload) => {
      state.user = payload;
		},
		clearUser: (state) => {
			state.user = null;
		},
		setError: (state, payload) => {
			state.error = payload;
		},
		clearError: (state, payload) => {
			state.error = null;
		},
		setAuthError: (state, payload) => {
			state.AuthError = payload;
		},
	},
	actions: {
		getCurrentUser: ({ commit }) => {
			commit("setLoading", true);
			apolloClient
				.query({
					query: GET_CURRENT_USER
				})
				.then(({ data }) => {
					commit("setLoading", false);
					// Add user data to state
					commit("setUser", data.getCurrentUser);
				})
				.catch(err => {
					commit("setLoading", false);
					console.error(err);
				});
		}, 
    signinUser: ({ commit }, payload) => {

			commit('clearError');
			commit('setLoading', true);
      apolloClient
        .mutate({
          mutation: SIGNIN_USER,
          variables: payload
        })
        .then(({ data }) => {
					commit('setLoading', false);
          localStorage.setItem("token", data.signinUser.token);
          // to make sure created method is run in main.js (we run getCurrentUser), reload the page
          router.go();
        })
        .catch(err => {
					commit('setLoading', false);
					commit('setError', err);
          console.error(err);
        });
		},
		signupUser: ({ commit }, payload) => {
      commit("clearError");
      commit("setLoading", true);
      apolloClient
        .mutate({
          mutation: SIGNUP_USER,
          variables: payload
        })
        .then(({ data }) => {
          commit("setLoading", false);
          localStorage.setItem("token", data.signupUser.token);
          // to make sure created method is run in main.js (we run getCurrentUser), reload the page
          router.go();
        })
        .catch(err => {
          commit("setLoading", false);
          commit("setError", err);
          console.error(err);
        });
    },
    signoutUser: async ({ commit }) => {
      // clear user in state
      commit("clearUser");
      // remove token in localStorage
      localStorage.setItem("token", "");
      // end session
      await apolloClient.resetStore();
      // redirect home - kick users out of private pages (i.e. profile)
      router.push("/");
    } 		
	}
}
