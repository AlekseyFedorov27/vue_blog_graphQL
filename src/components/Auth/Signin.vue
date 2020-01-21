<template>
  <v-container
    text-xs-center
    mt-5
    pt-5
  >

    <!-- error alert -->
    <v-layout
      v-if="error"
      row
      wrap
    >
      <v-flex
        xs12
        sm6
        offset-sm3
      >
        <form-alert :message="error"></form-alert>
      </v-flex>
    </v-layout>

    <!-- Signin Form -->
    <v-layout
      row
      wrap
      style="background-color: transparent"
    >
      <v-flex
        xs10
        offset-xs1
        sm6
        offset-sm3
      >
        <v-card
          class="mx-auto pa-10"
          max-width="444"
        >
          <h2>Welcome Back!</h2>
          <v-container style="background-color: transparent!important">
            <v-form
              @submit.prevent="handleSigninUser"
              v-model="isFormValid"
              lazy-validation
              ref="form"
            >

              <v-layout row>
                <v-flex xs12>
                  <v-text-field
                    :rules="usernameRules"
                    v-model="username"
                    prepend-icon="face"
                    label="Username"
                    type="text"
                    required
                  ></v-text-field>
                </v-flex>
              </v-layout>

              <v-layout row>
                <v-flex xs12>
                  <v-text-field
                    :rules="passwordRules"
                    v-model="password"
                    prepend-icon="extension"
                    label="Password"
                    type="password"
                    required
                  ></v-text-field>
                </v-flex>
              </v-layout>

              <v-layout row>
                <v-flex xs12>
                  <v-btn
                    :loading="loading"
                    class="ma-2"
                    color="primary"
                    @click="loader = 'loading'"
                    type="submit"
                    :disabled="!isFormValid || loading"
                  >
                    Signin
                  </v-btn>
                  <h4 class="mt-3">Don't have an account?
                    <router-link to="/signup">Signup</router-link>
                  </h4>
                </v-flex>
              </v-layout>

            </v-form>
          </v-container>
        </v-card>
      </v-flex>
    </v-layout>

  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "Signin",
  data() {
    return {
      username: "",
      password: "",
      isFormValid: true,
      usernameRules: [
        username => !!username || "User name is required",
        username =>
          username.length < 10 || "User name must be less then 10 charact"
      ],
      passwordRules: [
        password => !!password || "User name is required",
        password =>
          password.length >= 4 || "User password must be at least 4 charact"
      ]
    };
  },
  computed: {
    ...mapGetters(["loading", "error", "user"])
  },
  watch: {
    user(value) {
      // if user value changes, redirect to home page
      if (value) {
        this.$router.push("/");
      }
    }
  },
  methods: {
    handleSigninUser() {
      if (this.$refs.form.validate()) {
        this.$store.dispatch("signinUser", {
          username: this.username,
          password: this.password
        });
      }
    }
  }
};
</script>
<style lang="scss">
.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}
@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
