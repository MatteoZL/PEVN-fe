<template>
  <div>
    <v-app-bar app dark class="primary">
      <v-toolbar-title>Mattweb</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text to="/all-courses">All courses</v-btn>|
      <v-btn text to="/courses-member">My courses</v-btn>|
      <v-menu bottom :offset-y="offset">
        <template v-slot:activator="{ on, attrs }">
          <v-btn text v-bind="attrs" v-on="on">{{s_name}}</v-btn>
        </template>

        <v-list dark class="primary">
          <v-list-item to="/profile">
            <v-list-item-title>Profile</v-list-item-title>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item @click="$router.push('/')">
            <v-list-item-title>Sign out</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
  </div>
</template>

<script>
export default {
  name: "Navbar",
  data: () => ({
    offset: true
  }),
  methods: {
    SignOut() {
      this.$router.push("/");
      sessionStorage.clear();
    }
  },
  props: ["s_name"]
};
</script>