import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import vuetify from './plugins/vuetify'
import FormAlert from './components/Shared/FormAlert'

import ApolloClient from "apollo-boost"
import VueApollo from "vue-apollo"

Vue.component('form-alert', FormAlert)

Vue.use(VueApollo)

// Setup ApolloClient
export const defaultClient = new ApolloClient({
	uri: "https://graphqlmyblog.herokuapp.com/graphql",
	// verifies token
  fetchOptions: {
    credentials: "include"
  },
  request: operation => {
    // if no token with key of 'token' in localStorage, add it
    if (!localStorage.token) {
      localStorage.setItem("token", "");
    }
    // operation adds the token to an authorization header, which is sent to backend
    operation.setContext({
      headers: {
        authorization: localStorage.getItem("token")
      }
    });
  },
  onError: ({ graphQLErrors, networkError }) => {
    if (networkError) {
      console.log("[networkError]", networkError);
    }
    if (graphQLErrors) {
      for (let err of graphQLErrors) {
        console.dir(err);
        if (err.message === "Context creation failed: AuthenticationError is not defined") {
          console.log('sssssssssssssss')
          // set auth error in state (to show in snackbar)
          store.commit("setAuthError", err);
          // signout user (to clear token)
          store.dispatch("signoutUser");
        }
      }
    }
  } 
});

const apolloProvider = new VueApollo({ defaultClient });

Vue.config.productionTip = false;

new Vue({
  apolloProvider,
	router,
	vuetify,
  store,
  render: h => h(App),
  created() {
		localStorage.getItem("token")
    // execute getCurrentUser query
    this.$store.dispatch("getCurrentUser");
  }
}).$mount("#app")