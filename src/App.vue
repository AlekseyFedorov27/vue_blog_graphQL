<template>
  <v-app>
    <div class="navigation">
      <!-- snackbar sucsses signin -->
      <v-snackbar
        v-model="authSnackbar"
        color='success'
        right
        bottom
        :timeout='5000'
      >
        <v-icon class="mr-3">check_circle</v-icon>
        <h3>You are sign in!</h3>
        <v-btn
          darck
          icon
          @click="authSnackbar=false"
        >
          <v-icon>close</v-icon>
        </v-btn>
      </v-snackbar>

      <!-- snackbar error signin -->
      <v-snackbar
        v-model="authErrorSnackbar"
        color='info'
        right
        bottom
        :timeout='5000'
      >
        <v-icon class="mr-3">info</v-icon>
        <h3>authError</h3>
        <v-btn
          darck
          icon
          @click="authErrorSnackbar=false"
          to="/signin"
        >Signin
          <v-icon>link</v-icon>
        </v-btn>
      </v-snackbar>

      <!-- navigation-drawer -->
      <v-navigation-drawer
        app
        fixed
        v-model="sideNav"
      >
        <v-toolbar
          color="accent"
          dark
          flat
        >
          <v-app-bar-nav-icon @click="sideNav=!sideNav"></v-app-bar-nav-icon>
          <router-link
            to="/"
            class="pl-9"
            tag="span"
            style="cursor: pointer"
          >
            My Blog
          </router-link>
        </v-toolbar>

        <!-- draver-title-item -->
        <v-divider></v-divider>
        <v-list-item
          ripple
          v-for="item in horizontalNavItems"
          :key="item.title"
          :to="item.link"
          class="pl-7"
        >
          <v-list-item-icon>
            <v-icon
              class="hidden-sm-only"
              left
              size="small"
            >{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            {{ item.title }}
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          ripple
          v-if="user"
          to="/profile"
          class="pl-7"
        >
          <v-list-item-icon>
            <v-icon
              class="hidden-sm-only"
              left
              size="small"
            >account_box</v-icon>
          </v-list-item-icon>
          <v-list-item-content>

            Profile

          </v-list-item-content>
        </v-list-item>

        <v-list-item
          ripple
          v-if="user"
          class="pl-7"
        >
          <v-list-item-icon>
            <v-icon
              class="hidden-sm-only"
              size="small"
            >exit_to_app</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            Sign out
          </v-list-item-content>
        </v-list-item>

      </v-navigation-drawer>

      <!-- nav-bar -->
      <v-app-bar
        color="primary"
        dense
        dark
      >
        <v-app-bar-nav-icon @click="sideNav=!sideNav"></v-app-bar-nav-icon>
        <v-toolbar-title class="hidden-xs-only">
          <router-link
            to="/"
            tag="span"
            style="cursor: pointer"
          >
            My Blog
          </router-link>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="searchTerm"
          @input="handleSearchPosts"
          prepend-icon="search"
          placeholder="Search posts"
          color="accent"
          single-line
          hide-details
        ></v-text-field>

        <!-- Search list component -->
        <Search
          style="z-index: 999"
          :searchTerm="searchTerm"
          @clearSearch="clearSerchResalt"
        />

        <v-spacer></v-spacer>
        <!-- Horizontal Navbar Links -->
        <v-toolbar-items class="hidden-xs-only">
          <v-btn
            v-for="item in horizontalNavItems"
            :key="item.title"
            :to="item.link"
            color="blue lighten-3"
            dark
          >
            <v-icon
              class="hidden-sm-only"
              left
            >{{item.icon}}</v-icon>
            {{item.title}}
          </v-btn>

          <!-- Profile Button -->
          <v-btn
            to="/profile"
            v-if="user"
            color="blue lighten-3"
            dark
          >
            <v-icon
              class="hidden-sm-only"
              left
            >account_box</v-icon>
            <v-badge
              right
              color="blue darken-2"
              :class="{ 'bounce': badgeAnimated }"
            >
              <span
                slot="badge"
                v-if="userFavorites.length"
              >{{userFavorites.length}}</span>
              Profile
            </v-badge>
          </v-btn>

          <!-- Signout Button -->
          <v-btn
            v-if="user"
            @click="handleSignoutUser"
            color="blue lighten-3"
            dark
          >
            <v-icon
              class="hidden-sm-only"
              left
            >exit_to_app</v-icon>
            Signout
          </v-btn>

        </v-toolbar-items>
      </v-app-bar>
    </div>

    <!-- content -->
    <main>
      <v-container class="container">
        <transition name="fade">
          <router-view />
        </transition>
      </v-container>
    </main>

  </v-app>
</template>

<script>
import Search from "./components/Posts/Search";
import { mapGetters } from "vuex";
export default {
  name: "App",
  components: { Search },
  data: () => ({
    searchTerm: "",
    sideNav: false,
    authSnackbar: false,
    authErrorSnackbar: false,
    badgeAnimated: false,
    userPostsLikes: 0
  }),
  methods: {
    handleSignoutUser() {
      this.$store.dispatch("signoutUser");
    },
    handleSearchPosts() {
      this.$store.dispatch("searchPosts", {
        searchTerm: this.searchTerm
      });
    },
    clearSerchResalt() {
      this.searchTerm = "";
    },
    handleSignoutUser() {
      this.$store.dispatch("signoutUser");
    },
    checkIfUserFavorite(resultId) {
      return this.userFavorites.some(fave => fave._id === resultId);
    },
    toggleSideNav() {
      this.sideNav = !this.sideNav;
    }
  },
  watch: {
    user(newValue, oldValue) {
      if (oldValue === null) {
        this.authSnackbar = true;
      }
    },
    authError(value) {
      if (value !== null) {
        this.authErrorSnackbar = true;
      }
    },
    userFavorites(value) {
      // if user favorites value changed at all
      if (value) {
        this.badgeAnimated = true;
        this.userPostsLikes = this.userFavorites.length;
        setTimeout(() => (this.badgeAnimated = false), 1000);
      }
    }
  },
  computed: {
    ...mapGetters(["userFavorites", "authError", "user"]),
    horizontalNavItems() {
      let items = [
        { icon: "chat", title: "Posts", link: "/posts" },
        { icon: "lock_open", title: "Sign In", link: "/signin" },
        { icon: "create", title: "Sign Up", link: "/signup" }
      ];
      if (this.user) {
        items = [
          { icon: "chat", title: "Posts", link: "/posts" },
          { icon: "stars", title: "Create post", link: "/post/add" }
          // { icon: "account_box", title: "Profile", link: "/profile" }
        ];
      }
      return items;
    }
  }
};
</script>
<style lang="scss" scoped>
.v-badge__badge .blue .darck-2 {
  bottom: 0px !important;
  left: 10px !important;
}

.container {
  padding-top: 3rem;
}
.navigation {
  position: absolute;
  z-index: 999;
  width: 100%;
}
.fade-enter-active,
.fade-leave-active {
  transition-property: opacity;
  transition-duration: 0.25s;
}

.fade-enter-active {
  transition-delay: 0.25s;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}

/* Search Results Card */
#search__card {
  position: absolute;
  width: 100vw;
  z-index: 800 !important;
  top: 100%;
  left: 0%;
  padding: 1rem 3rem;
}

/* User Favorite Animation */
.bounce {
  animation: bounce 1s both;
}

@keyframes bounce {
  0%,
  20%,
  53%,
  80%,
  100% {
    transform: translate3d(0, 0, 0);
  }
  40%,
  43% {
    transform: translate3d(0, -20px, 0);
  }
  70% {
    transform: translate3d(0, -10px, 0);
  }
  90% {
    transform: translate3d(0, -4px, 0);
  }
}
</style>
