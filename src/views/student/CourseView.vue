<template>
  <v-container class="text-center">
    <NavbarS :s_name="student.name" />
    <v-alert
      v-model="alert.show"
      text
      :type="alert.type"
      dismissible
      class="text-start"
    >{{ alert.message }}</v-alert>
    <h1 class="font-weight-light">{{ course.c_name }}</h1>
    <h2 class="font-weight-thin">{{ course.c_description }}</h2>
    <v-row justify="center" align="center">
      <v-col md="9" lg="9" sm="12">
        <v-simple-table fixed-header>
          <thead>
            <tr>
              <th class="text-center">Name</th>
              <th class="text-center">Description</th>
              <th class="text-center">File</th>
              <th class="text-center">Up delivery</th>
              <th class="text-center">Delivery</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(assignment, index) in assignments" :key="index" class="text-center">
              <td>{{ assignment.a_name }}</td>
              <td>{{ assignment.a_description }}</td>
              <td>
                <v-icon color="grey-darken-1" @click="open(assignment.a_file)">mdi-file-pdf</v-icon>
              </td>
              <td v-if="assignment.d_file==null">
                <v-icon color="info" @click="openForm(assignment.id_a)">mdi-cloud-upload</v-icon>
              </td>
              <td v-else>
                <v-icon color="success">mdi-cloud-check</v-icon>
              </td>
              <td>
                <a @click="open(assignment.d_file)">{{ assignment.d_filename }}</a>
              </td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-col>
    </v-row>
    <v-dialog v-model="add" max-width="450">
      <v-card>
        <v-card-title>Upload delivery</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="addDelivery()" class="ma-3" ref="addForm">
            <v-file-input
              label="Delivery"
              v-model="deliveryToAdd.d_file"
              :rules="[(value) => !!value || 'File is required.']"
            ></v-file-input>
            <v-btn block class="success mt-3" type="submit">send</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import NavbarS from "@/components/NavbarS";
import aux from "axios";

export default {
  data: () => ({
    student: {},
    course: {},
    assignments: [],
    deliveryToAdd: {},
    add: false,
    alert: { show: false }
  }),
  methods: {
    open(link) {
      window.open(link);
    },
    openForm(id_a) {
      this.deliveryToAdd.id_a = id_a;
      this.add = true;
    },
    async addDelivery() {
      try {
        let valid = this.$refs.addForm.validate();
        if (valid) {
          const delivery = new FormData();
          delivery.append("id", this.student.id);
          delivery.append("id_a", this.deliveryToAdd.id_a);
          delivery.append("d_file", this.deliveryToAdd.d_file);
          const res = await this.axios.post("/student/add-delivery", delivery);
          const index = this.assignments.findIndex(
            a => a.id_a == this.deliveryToAdd.id_a
          );
          this.assignments[index].d_file = res.data.d_file;
          this.assignments[index].d_filename = res.data.d_filename;
          this.add = false;
          this.$refs.addForm.reset();
          this.alert = {
            show: true,
            type: "success",
            message: res.data.message
          };
        }
      } catch (error) {
        console.log(error.response);
      }
    }
  },
  created: async function() {
    try {
      this.student = JSON.parse(sessionStorage.getItem("session"));
      if (this.student == null) {
        this.$router.push("/");
      } else if (this.student.role == "student") {
        const res = await this.axios.post(
          `/student/course/${this.$route.params.id_c}`,
          this.student
        );
        this.course = res.data.course;
        this.assignments = res.data.assignments;
      } else {
        this.$router.push("/profile");
      }
    } catch (error) {
      console.log(error.response);
    }
  },
  components: {
    NavbarS
  }
};
</script>
