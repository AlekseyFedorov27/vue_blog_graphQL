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
          color=""
        >
          <h2>Welcome!</h2>
          <v-container style="background-color: transparent!important">
            <v-form
              @submit.prevent="handleSignupUser"
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
                    :rules="emailRules"
                    v-model="email"
                    prepend-icon="email"
                    label="Email"
                    type="email"
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
                  <v-text-field
                    :rules="passwordRules"
                    v-model="passwordConfirmation"
                    prepend-icon="gavel"
                    label="Confirm Password"
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
                    color="info"
                    @click="loader = 'loading'"
                    type="submit"
                    :disabled="!isFormValid || loading"
                  >
                    Signup
                  </v-btn>
                  <h4 class="mt-3">Alredy have an account?
                    <router-link to="/signin">Signin</router-link>
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
  name: "Signup",
  data() {
    return {
      username: "",
      password: "",
      passwordConfirmation: "",
      email: "",
      isFormValid: true,
      usernameRules: [
        username => !!username || "Username is required",
        username =>
          username.length < 10 || "Username cannot be more than 10 characters"
      ],
      emailRules: [
        email => !!email || "Email is required",
        email => /.@+./.test(email) || "Email must be valid"
      ],
      passwordRules: [
        password => !!password || "Password is required",
        password =>
          password.length >= 4 || "Password must be at least 4 characters",
        confirmation => confirmation === this.password || "Passwords must match"
      ]
    };
  },
  computed: {
    ...mapGetters(["loading", "error"])
  },
  watch: {
    user(value) {
      // if user value changes, redirect to home page
      if (value) {
        this.$router.push("/");
      }
    }
  },
  computed: {
    ...mapGetters(["loading", "error", "user"])
  },
  methods: {
    handleSignupUser() {
      if (this.$refs.form.validate()) {
        this.$store.dispatch("signupUser", {
          username: this.username,
          email: this.email,
          password: this.password
        });
      }
    }
  }
};
</script>

