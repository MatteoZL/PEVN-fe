<template>
  <v-container>
    <NavbarP :p_name="professor.name"/>
    <v-alert v-model="alert.show" text :type="alert.type" dismissible>{{ alert.message }}</v-alert>
    <h1 class="font-weight-light">My courses.</h1>
    <v-row justify="center">
      <v-card class="ma-3" max-width="344" v-for="course in coursesList" :key="course.id_c">
        <v-img src="https://cdn.vuetifyjs.com/images/cards/sunshine.jpg" height="200px"></v-img>

        <v-card-title>{{ course.c_name }}</v-card-title>

        <v-card-subtitle>{{ course.c_description }}</v-card-subtitle>

        <v-card-actions>
          <v-btn color="blue" small dark fab @click="readCourse(course.id_c)">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn color="red" small dark fab @click="deleteCourse(course.id_c)">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="purple"
            dark
            @click="$router.push(`/selected-course/${course.id_c}`)"
            text
          >assignments</v-btn>
        </v-card-actions>
      </v-card>
    </v-row>
    <v-btn @click="add = true" color="red" large fixed right bottom fab dark>
      <v-icon>mdi-plus</v-icon>
    </v-btn>
    <v-dialog v-model="add" max-width="450">
      <v-card>
        <v-card-title>Create a course</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="addCourse()" class="ma-3" ref="addForm">
            <v-text-field
              prepend-icon="mdi-biohazard"
              v-model="courseAdd.c_name"
              label="Name"
              required
              autocomplete="off"
              :rules="[(value) => !!value || 'Name is required.']"
            ></v-text-field>
            <v-textarea
              prepend-icon="mdi-bike"
              v-model="courseAdd.c_description"
              label="Description"
              required
              :rules="[(value) => !!value || 'Description is required.']"
              autocomplete="off"
            ></v-textarea>
            <v-btn block class="success mt-3" type="submit">add</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="edit" max-width="450">
      <v-card>
        <v-card-title>Edit course</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="editCourse()" class="ma-3" ref="editForm">
            <v-text-field
              prepend-icon="mdi-biohazard"
              v-model="courseEdit.c_name"
              label="Name"
              required
              autocomplete="off"
              :rules="[(value) => !!value || 'Name is required.']"
            ></v-text-field>
            <v-textarea
              prepend-icon="mdi-bike"
              v-model="courseEdit.c_description"
              label="Description"
              required
              :rules="[(value) => !!value || 'Description is required.']"
              autocomplete="off"
            ></v-textarea>
            <v-btn block class="info mt-3" type="submit">update</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import NavbarP from "@/components/NavbarP";

export default {
  data: () => ({
    professor: {},
    coursesList: [],
    courseAdd: {},
    courseEdit: {},
    add: false,
    edit: false,
    alert: { show: false }
  }),
  methods: {
    async addCourse() {
      try {
        let valid = this.$refs.addForm.validate();
        if (valid) {
          this.courseAdd.id = this.professor.id;
          const res = await this.axios.post(
            "/professor/add-course",
            this.courseAdd
          );
          this.coursesList.push(res.data.course);
          this.$refs.addForm.reset();
          this.add = false;
          this.alert = {
            show: true,
            type: "success",
            message: res.data.message
          };
        }
      } catch (error) {
        console.log(error.response);
      }
    },
    async readCourse(id_c) {
      try {
        const res = await this.axios.get(`/professor/course/${id_c}`);
        this.courseEdit = res.data;
        this.edit = true;
      } catch (error) {
        console.log(error.response);
      }
    },
    async editCourse() {
      try {
        let valid = this.$refs.editForm.validate();
        if (valid) {
          const res = await this.axios.put(
            `/professor/course/${this.courseEdit.id_c}`,
            this.courseEdit
          );
          const index = this.coursesList.findIndex(
            c => c.id_c == this.courseEdit.id_c
          );
          this.coursesList[index] = this.courseEdit;
          this.edit = false;
          this.alert = {
            show: true,
            type: "success",
            message: res.data.message
          };
        }
      } catch (error) {
        console.log(error.response);
      }
    },
    async deleteCourse(id_c) {
      try {
        const res = await this.axios.delete(`/professor/course/${id_c}`);
        const index = this.coursesList.findIndex(c => c.id_c == id_c);
        this.coursesList.splice(index, 1);
        
        this.alert = {
          show: true,
          type: "success",
          message: res.data.message
        };
      } catch (error) {
        console.log(error.response);
      }
    }
  },
  created: async function() {
    try {
      this.professor = JSON.parse(sessionStorage.getItem("session"));
      if (this.professor == null) {
        this.$router.push("/");
      } else if (this.professor.role == "professor") {
        const res = await this.axios.post(
          "/professor/my-courses",
          this.professor
        );
        this.coursesList = res.data;
      } else {
        this.$router.push("/profile");
      }
    } catch (error) {
      console.log(error.response);
    }
  },
  components: {
    NavbarP
  }
};
</script>
