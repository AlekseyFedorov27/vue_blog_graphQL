<template>
  <v-alert
    class="alert"
    type="error"
    color="error"
    icon="warning"
    v-model="alert"
    value="true"
    dismissible
    transition="slide-y-transition"
  >
    <h3>{{message}}</h3>
  </v-alert>
</template>

<script>
export default {
  props: ["message"]
};
</script>
<style lang="scss" scoped>
.alert {
  position: absolute;
  z-index: 990;
  top: 4rem;
  right: 3rem;
}
</style>