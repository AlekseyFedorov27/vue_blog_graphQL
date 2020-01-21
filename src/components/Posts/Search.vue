<template>

  <v-card
    class="mx-auto list"
    tile
    dark
    v-if="searchResults.length"
    id="search__card"
    style="position: 'absolute', elevation: 100, z-index:100"
  >
    <v-list
      two-line
      subheader
    >
      <v-list-item-group color="primary">
        <v-list-item
          v-for="result in searchResults"
          :key="result._id"
          @click="goToSearchResult(result._id)"
        >
          <v-list-item-content>
            <v-list-item-title> {{result.title}} -{{formatDescription(result.description)}}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-card>

</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "Search",
  props: ["searchTerm"],
  data: () => ({}),
  methods: {
    goToSearchResult(resultId) {
      // Clear search term
      this.$emit("clearSearch");
      // Go to desired result
      this.$router.push(`/posts/${resultId}`);
      // Clear search results
      this.$store.commit("clearSearchResults");
    },
    formatDescription(desc) {
      return desc.length > 30 ? `${desc.slice(0, 30)}...` : desc;
    }
  },
  computed: {
    ...mapGetters(["searchResults"])
  }
};
</script>
<style lang="scss" scoped>
.list {
  z-index: 99999 !important;
  position: absolute;
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
</style>