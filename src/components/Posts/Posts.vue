<template>
  <v-container
    fluid
    grid-list-xl
  >

    <!-- Post Cards -->
    <v-layout
      row
      wrap
      v-if="infiniteScrollPosts"
    >
      <v-flex
        xs12
        sm6
        v-for="post in infiniteScrollPosts.posts"
        :key="post._id"
      >
        <v-lazy
          :options="{
          threshold: .5
        }"
          transition="fade-transition"
        >
          <v-card
            hover
            class="mx-auto"
          >
            <v-img
              @click="goToPost(post._id)"
              :src="post.imageUrl"
              height="30vh"
            ></v-img>

            <v-card-title
              class="headline"
              @click="goToPost(post._id)"
            >
              {{ post.title }}
            </v-card-title>

            <v-card-subtitle>
              <v-row
                align="center"
                class="spacer"
                no-gutters
              >
                <span class="grey--text">{{post.likes}} likes - {{post.messages.length}} comments</span>

                <v-spacer></v-spacer>

                <v-btn
                  icon
                  @click="showPostCreator = !showPostCreator"
                >
                  <v-icon>{{ showPostCreator ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
                </v-btn>
              </v-row>
            </v-card-subtitle>

            <v-expand-transition>
              <div v-show="showPostCreator">
                <v-divider></v-divider>

                <v-row
                  align="center"
                  class="spacer"
                  no-gutters
                >
                  <v-avatar
                    class="ml-3"
                    color="teal"
                    size="42"
                  >
                    <img :src="post.createdBy.avatar">
                  </v-avatar>
                  <v-list-item-content class="ml-3">
                    <v-list-item-title class="title">{{post.createdBy.username}}</v-list-item-title>
                    <v-list-item-subtitle weekday-format>{{formatCreatedDate(post.createdDate)}}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-row>
              </div>
            </v-expand-transition>
          </v-card>
        </v-lazy>
      </v-flex>
    </v-layout>

    <!-- Fetch More Button -->
    <v-layout
      v-if="showMoreEnabled"
      column
    >
      <v-flex xs12>
        <v-layout
          justify-center
          row
        >
          <v-btn
            color="info"
            @click="showMorePosts"
          >Fetch More</v-btn>
        </v-layout>
      </v-flex>
    </v-layout>

  </v-container>
</template>

<script>
import moment from "moment"; 
import { INFINITE_SCROLL_POSTS } from "../../queries";

const pageSize = 2;

export default {
  name: "Posts",
  data() {
    return {
      pageNum: 1,
      showMoreEnabled: true,
      showPostCreator: false
    };
  },
  apollo: {
    infiniteScrollPosts: {
      query: INFINITE_SCROLL_POSTS,
      variables: {
        pageNum: 1,
        pageSize
      }
    }
  },
  methods: {
    goToPost(postId) {
      this.$router.push(`/posts/${postId}`);
    },
    formatCreatedDate(date) {
      return moment(new Date(date)).format("ll");
    }, 
    showMorePosts() {
      this.pageNum += 1;
      // fetch more data and transform original result
      this.$apollo.queries.infiniteScrollPosts.fetchMore({
        variables: {
          // pageNum incremented by 1
          pageNum: this.pageNum,
          pageSize
        },
        updateQuery: (prevResult, { fetchMoreResult }) => {
          const newPosts = fetchMoreResult.infiniteScrollPosts.posts;
          const hasMore = fetchMoreResult.infiniteScrollPosts.hasMore;
          this.showMoreEnabled = hasMore;

          return {
            infiniteScrollPosts: {
              __typename: prevResult.infiniteScrollPosts.__typename,
              // Merge previous posts with new posts
              posts: [...prevResult.infiniteScrollPosts.posts, ...newPosts],
              hasMore
            }
          };
        }
      });
    }
  }
};
</script> 
