<template>
  <v-container>
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>Mattweb</v-toolbar-title>
    </v-app-bar>
    <v-alert v-model="alert.show" text :type="alert.type" dismissible>{{ alert.message }}</v-alert>
    <v-row justify="center" align="center">
      <v-col class="text-center" md="2" sm="2">
        <v-btn @click="suForm = true" class="primary">sign up</v-btn>
      </v-col>
      <v-col class="text-center" md="2" sm="2">
        <v-btn @click="suForm = false" class="success">sign in</v-btn>
      </v-col>
    </v-row>
    <v-row justify="center" align="center">
      <v-col md="6" sm="6">
        <v-card v-if="suForm">
          <v-card-title>Sign Up</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="signup()" class="ma-3" ref="signupForm">
              <v-text-field
                prepend-icon="mdi-account"
                v-model="user.name"
                label="Name"
                required
                autocomplete="off"
                :rules="nameRules"
              ></v-text-field>
              <v-text-field
                prepend-icon="mdi-email"
                v-model="user.email"
                label="E-mail"
                required
                autocomplete="off"
                :rules="emailRules"
              ></v-text-field>
              <v-text-field
                prepend-icon="mdi-lock"
                v-model="user.password"
                label="Password"
                required
                :rules="passwordRules"
                autocomplete="off"
                type="password"
              ></v-text-field>
              <v-radio-group v-model="user.role" :rules="[(v) => !!v || 'Please choose one']" row>
                <v-radio label="Professor" value="professor"></v-radio>
                <v-radio label="Student" value="student"></v-radio>
              </v-radio-group>
              <v-btn block class="primary mt-3" type="submit">Sign up</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
        <v-card v-else>
          <v-card-title>Sign In</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="signin()" class="ma-3" ref="signinForm">
              <v-text-field
                prepend-icon="mdi-email"
                v-model="user.email"
                label="E-mail"
                required
                autocomplete="off"
                :rules="emailRules"
              ></v-text-field>
              <v-text-field
                prepend-icon="mdi-lock"
                v-model="user.password"
                label="Password"
                required
                :rules="passwordRules"
                autocomplete="off"
                type="password"
              ></v-text-field>
              <v-radio-group
                v-model="user.role"
                :rules="[(v) => !!v || 'Please choose one']"
                row
              >
                <v-radio label="Professor" value="professor"></v-radio>
                <v-radio label="Student" value="student"></v-radio>
              </v-radio-group>
              <v-btn block class="success mt-3" type="submit">Sign in</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Home",
  data: () => ({
    suForm: true,
    alert: { show: false },
    nameRules: [
      value => !!value || "Name is required.",
      value =>
        (value && value.length >= 5) || "Name must be more than 5 characteres"
    ],
    emailRules: [
      value => !!value || "E-mail is required",
      value => /.+@.+\..+/.test(value) || "E-mail must be valid"
    ],
    passwordRules: [
      value => !!value || "Password is required",
      value =>
        (value && value.length >= 2) ||
        "Password more be less than 2 characteres"
    ],
    user: { name: "", email: "", password: "", role: "" }
  }),
  methods: {
    async signup() {
      let valid = this.$refs.signupForm.validate();
      if (valid) {
        try {
          const res = await this.axios.post("/signup", this.user);
          this.$refs.signupForm.reset();
          this.suForm = false;
          this.alert = {
            show: true,
            type: "success",
            message: res.data.message
          };
        } catch (error) {
          this.alert = {
            show: true,
            type: "error",
            message: error.response.data.message
          };
          console.log(error);
        }
      }
    },
    async signin() {
      let valid = this.$refs.signinForm.validate();
      if (valid) {
        try {
          const res = await this.axios.post("/signin", this.user);
          if (res.data.NotFound) {
            this.alert = {
              show: true,
              type: "error",
              message: res.data.message
            };
          } else {
            sessionStorage.setItem("session", JSON.stringify(res.data));
            this.$router.push("/profile");
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
  }
};
</script>
