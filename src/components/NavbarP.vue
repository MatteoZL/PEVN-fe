<template>
  <div>
    <v-app-bar app dark class="primary">
      <v-toolbar-title>Mattweb</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text to="/my-courses">My courses</v-btn>|
      <v-menu bottom :offset-y="offset">
        <template v-slot:activator="{ on, attrs }">
          <v-btn text v-bind="attrs" v-on="on">{{p_name}}</v-btn>
        </template>

        <v-list dark class="primary">
          <v-list-item to="/profile">
            <v-list-item-title>PROFILE</v-list-item-title>
          </v-list-item>
          <v-list-item @click="SignOut()">
            <v-list-item-title>SIGN OUT</v-list-item-title>
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
  props: ["p_name"]
};
</script>