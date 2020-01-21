<template>
  <v-container
    text-xs-center
    mt-5
    pt-5
  >

    <!-- Add POST Form -->
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

        <h1 class="primari--text">Add Post</h1>

        <v-form
          @submit.prevent="handlePost"
          v-model="isFormValid"
          lazy-validation
          ref="form"
        >

          <!-- title input -->
          <v-layout row>
            <v-flex xs12>
              <v-text-field
                :rules="titleRules"
                v-model="title"
                label="Post Title"
                type="text"
                required
              ></v-text-field>
            </v-flex>
          </v-layout>

          <!-- img URL input -->
          <v-layout row>
            <v-flex xs12>
              <v-text-field
                :rules="imageRules"
                v-model="imageUrl"
                label="Image URL"
                type="text"
                required
              ></v-text-field>
            </v-flex>
          </v-layout>

          <!-- img Preview -->
          <v-layout row>
            <v-flex xs12>
              <img
                :src="imageUrl"
                height="300px"
              >
            </v-flex>
          </v-layout>

          <!-- categories select -->
          <v-layout row>
            <v-flex xs12>
              <v-select
                v-model="categories"
                :rules="categoriesRules"
                :items="['Art', 'Education', 'Travel', 'Photography','Tehnology']"
                multiple
                label="Categories"
              >

              </v-select>
            </v-flex>
          </v-layout>

          <!-- discription input -->
          <v-layout row>
            <v-flex xs12>
              <v-textarea
                :rules="descrRules"
                v-model="description"
                label="Description"
                type="text"
                required
              ></v-textarea>
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
                Submit
              </v-btn>
            </v-flex>
          </v-layout>

        </v-form>

      </v-flex>
    </v-layout>

  </v-container>
</template>


<script>
import { mapGetters } from "vuex";
export default {
  name: "AddPost",
  data: () => ({
    isFormValid: true,
    title: "",
    imageUrl: "",
    description: "",
    categories: [],
    titleRules: [
      title => !!title || "Title is required",
      title => title.length > 10 || "Title must have less then 20 characters"
    ],
    imageRules: [image => !!image || "Image is required"],
    categoriesRules: [
      categories => categories.length >= 1 || "Categories is required"
    ],
    descrRules: [
      descr => !!descr || "Description is required",
      descr =>
        descr.length < 600 || "Description must have less then 400 characters"
    ]
  }),
  computed: {
    ...mapGetters(["loading", "user"])
  },
  methods: {
    handlePost() {
      if (this.$refs.form.validate()) {
        this.$store.dispatch("addPost", {
          title: this.title,
          imageUrl: this.imageUrl,
          description: this.description,
          categories: this.categories,
          creatorId: this.user._id
        });
        this.$router.push("/");
      }
    }
  }
};
</script>
