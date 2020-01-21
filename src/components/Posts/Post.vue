<template >
  <v-container
    v-if="getPost"
    class="mt-3"
    flexbox
    center
  >

    <!-- Post Card -->
    <v-layout
      row
      wrap
    >
      <v-flex xs12>
        <v-card hover>
          <v-card-title>
            <h1>{{getPost.title}}</h1>
            <v-btn
              @click="handleToggleLike"
              class="ml-5"
              icon
              v-if="user"
            >
              <v-icon :color="checkIfPostLiked(getPost._id) ? 'red' : 'grey'">favorite</v-icon>
            </v-btn>
            <h3 class="ml-3 font-weight-thin">{{getPost.likes}} LIKES</h3>
            <v-spacer></v-spacer>
            <v-icon
              @click="goToPreviousPage"
              color="info"
              large
            >arrow_back</v-icon>
          </v-card-title>

          <v-tooltip
            right
            v-slot:activator="{ on, attrs }"
          >
            <span>Click to enlarge image</span>
            <v-img
              @click="toggleImageDialog"
              :src="getPost.imageUrl"
              id="post__image"
            ></v-img>
          </v-tooltip>

          <!-- Post Image Dialog -->
          <v-dialog v-model="dialog">
            <v-card>
              <v-img
                :src="getPost.imageUrl"
                height="80vh"
              ></v-img>
            </v-card>
          </v-dialog>

          <v-card-text>
            <span
              v-for="(category, index) in getPost.categories"
              :key="index"
            >
              <v-chip
                class="mb-3"
                color="accent"
                text-color="white"
              >{{category}}</v-chip>
            </span>
            <h3>{{getPost.description}}</h3>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>

    <!-- Messages Section -->
    <div class="mt-3">
      <!-- Message Input -->
      <v-layout
        class="mb-3"
        v-if="user"
      >
        <v-flex xs12>
          <v-form
            @submit.prevent="handleAddPostMessage"
            v-model="isFormValid"
            lazy-validation
            ref="form"
          >
            <v-layout row>
              <v-flex xs12>
                <v-text-field
                  v-model="messageBody"
                  clearable
                  :rules="messageRules"
                  :append-outer-icon="messageBody && 'send'"
                  label="Add Message"
                  type="text"
                  @click:append-outer="handleAddPostMessage"
                  prepend-icon="email"
                  required
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-form>
        </v-flex>
      </v-layout>

      <!-- Messages -->
      <v-layout
        row
        wrap
      >
        <v-flex xs12>
          <v-list
            subheader
            two-line
          >
            <v-subheader>Messages ({{getPost.messages.length}})</v-subheader>

            <template v-for="message in getPost.messages">
              <v-divider :key="message._id"></v-divider>

              <v-row
                avatar
                inset
                align="center"
                class="spacer pa-2 pl-7 pr-7"
                :key="message.title"
              >
                <v-avatar size="42">
                  <img :src="message.messageUser.avatar">
                </v-avatar>

                <v-list-item-content class="ml-5">
                  <div class="mb-2">
                    {{message.messageBody}}
                  </div>
                  <v-list-item-subtitle>
                    {{message.messageUser.username}}
                    <span class="grey--text text--lighten-1 hidden-xs-only">{{getTimeFromNow(message.messageDate)}}</span>
                  </v-list-item-subtitle>
                </v-list-item-content>

                <v-icon color="grey hidden-xs-only mr-3">chat_bubble</v-icon>

              </v-row>
            </template>
          </v-list>
        </v-flex>
      </v-layout>

    </div>

  </v-container>
</template>

<script>
import moment from "moment";
import { mapGetters } from "vuex";
import {
  GET_POST,
  ADD_POST_MESSAGE,
  LIKE_POST,
  UNLIKE_POST
} from "../../queries";

export default {
  name: "Post",
  props: ["postId"],
  data() {
    return {
      postLiked: false,
      dialog: false,
      messageBody: "",
      isFormValid: true,
      messageRules: [message => !!message || "Message is required"]
    };
  },
  apollo: {
    getPost: {
      query: GET_POST,
      variables() {
        return {
          postId: this.postId
        };
      }
    }
  },
  computed: {
    ...mapGetters(["user", "userFavorites"])
  },
  methods: {
    checkIfPostLiked(postId) {
      if (this.userFavorites.some(fave => fave._id === postId)) {
        this.postLiked = true;
        return true;
      } else {
        this.postLiked = false;
        return false;
      }
    },
    getTimeFromNow(time) {
      return moment(new Date(time)).fromNow();
    },
    handleToggleLike() {
      if (this.postLiked) {
        this.handleUnlikePost();
      } else {
        this.handleLikePost();
      }
    },
    handleLikePost() {
      const variables = {
        postId: this.postId,
        username: this.user.username
      };
      this.$apollo
        .mutate({
          mutation: LIKE_POST,
          variables,
          update: (cache, { data: { likePost } }) => {
            const data = cache.readQuery({
              query: GET_POST,
              variables: { postId: this.postId }
            });
            data.getPost.likes += 1;
            cache.writeQuery({
              query: GET_POST,
              variables: { postId: this.postId },
              data
            });
          }
        })
        .then(({ data }) => {
          const updatedUser = {
            ...this.user,
            favorites: data.likePost.favorites
          };
          this.$store.commit("setUser", updatedUser);
        })
        .catch(err => console.error(err));
    },
    handleUnlikePost() {
      const variables = {
        postId: this.postId,
        username: this.user.username
      };
      this.$apollo
        .mutate({
          mutation: UNLIKE_POST,
          variables,
          update: (cache, { data: { unlikePost } }) => {
            const data = cache.readQuery({
              query: GET_POST,
              variables: { postId: this.postId }
            });
            data.getPost.likes -= 1;
            cache.writeQuery({
              query: GET_POST,
              variables: { postId: this.postId },
              data
            });
          }
        })
        .then(({ data }) => {
          const updatedUser = {
            ...this.user,
            favorites: data.unlikePost.favorites
          };
          this.$store.commit("setUser", updatedUser);
        })
        .catch(err => console.error(err));
    },
    handleAddPostMessage() {
      if (this.$refs.form.validate()) {
        const variables = {
          messageBody: this.messageBody,
          userId: this.user._id,
          postId: this.postId
        };
        this.$apollo
          .mutate({
            mutation: ADD_POST_MESSAGE,
            variables,
            update: (cache, { data: { addPostMessage } }) => {
              const data = cache.readQuery({
                query: GET_POST,
                variables: { postId: this.postId }
              });
              data.getPost.messages.unshift(addPostMessage);
              cache.writeQuery({
                query: GET_POST,
                variables: { postId: this.postId },
                data
              });
            }
          })
          .then(({ data }) => {
            this.$refs.form.reset();
            console.log(data.addPostMessage);
          })
          .catch(err => console.error(err));
      }
    },
    goToPreviousPage() {
      this.$router.go(-1);
    },
    toggleImageDialog() {
      if (window.innerWidth > 500) {
        this.dialog = !this.dialog;
      }
    },
    checkIfOwnMessage(message) {
      return this.user && this.user._id === message.messageUser._id;
    }
  }
};
</script>

<style scoped>
#post__image {
  height: 400px !important;
}
</style> 