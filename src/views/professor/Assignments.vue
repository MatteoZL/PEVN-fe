<template>
  <v-container class="text-center">
    <NavbarP :p_name="professor.name"/>
    <v-alert
      class="text-start"
      v-model="alert.show"
      text
      :type="alert.type"
      dismissible
    >{{ alert.message }}</v-alert>
    <h1 class="font-weight-light">{{ course.c_name }}</h1>
    <h2 class="font-weight-thin">{{ course.c_description }}</h2>
    <v-dialog v-model="add" max-width="450">
      <v-card>
        <v-card-title>Create assignment</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="addAssignment()" class="ma-3" ref="addForm">
            <v-file-input
              label="File"
              v-model="assignToAdd.a_file"
              :rules="[(value) => !!value || 'File is required.']"
            ></v-file-input>
            <v-text-field
              prepend-icon="mdi-biohazard"
              v-model="assignToAdd.a_name"
              label="Name"
              required
              autocomplete="off"
              :rules="[(value) => !!value || 'Name is required.']"
            ></v-text-field>
            <v-textarea
              prepend-icon="mdi-bike"
              v-model="assignToAdd.a_description"
              label="Description"
              required
              autocomplete="off"
            ></v-textarea>
            <v-btn block class="success mt-3" type="submit">add</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-row justify="center" align="center">
      <v-col md="9" lg="9" sm="12">
        <v-simple-table fixed-header>
          <thead>
            <tr>
              <th class="text-center">Name</th>
              <th class="text-center">Description</th>
              <th class="text-center">File</th>
              <th class="text-center">Deliverys</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(assignment, index) in assignments" :key="index" class="text-center">
              <td>{{ assignment.a_name }}</td>
              <td>{{ assignment.a_description }}</td>
              <td>
                <v-icon color="grey-darken-1" @click="open(assignment.a_file)">mdi-file-pdf</v-icon>
              </td>
              <td>
                <v-icon
                  color="cyan darken-1"
                  @click="getDeliveries(assignment.id_a)"
                >mdi-book-open-page-variant</v-icon>
              </td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-col>
    </v-row>
    <v-dialog v-model="showDelv" max-width="450">
      <v-simple-table fixed-header>
        <thead>
          <tr>
            <th class="text-center">Name student</th>
            <th class="text-center">Delivery</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="delivery in deliveries" :key="delivery.id_d" class="text-center">
            <td>{{ delivery.s_name }}</td>
            <td>
              <a @click="open(delivery.d_file)">{{ delivery.d_filename }}</a>
            </td>
          </tr>
        </tbody>
      </v-simple-table>
    </v-dialog>
    <v-btn @click="add = true" color="deep-orange" large fixed right bottom fab dark>
      <v-icon>mdi-plus</v-icon>
    </v-btn>
  </v-container>
</template>

<script>
import aux from "axios";
import NavbarP from "@/components/NavbarP"

export default {
  data: () => ({
    course: {},
    assignments: [],
    add: false,
    assignToAdd: {},
    alert: { show: false },
    deliveries: [],
    showDelv: false,
    professor: {}
  }),
  created: function() {
    this.professor = JSON.parse(sessionStorage.getItem("session"));
    if (this.professor == null) {
      this.$router.push("/");
    } else if (this.professor.role == "professor") {
      // Course Information
      this.axios
        .get(`/professor/course/${this.$route.params.id_c}`)
        .then(res => {
          this.course = res.data;
        })
        .catch(e => {
          console.log(e.response);
        });

      // Assignments
      this.axios
        .get(`professor/course-assignments/${this.$route.params.id_c}`)
        .then(res => {
          this.assignments = res.data;
        })
        .catch(e => {
          console.log(e.response);
        });
    } else {
      this.$router.push("/profile");
    }
  },
  methods: {
    open(link) {
      window.open(link);
    },
    async addAssignment() {
      try {
        let valid = this.$refs.addForm.validate();
        if (valid) {
          const URL = await this.uploadToCloud(this.assignToAdd.a_file);
          this.assignToAdd.a_file = URL;
          const res = await this.axios.post(
            `/professor/add-assignment/${this.course.id_c}`,
            this.assignToAdd
          );

          this.assignments.push(res.data.assignment);
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
    async uploadToCloud(file) {
      const UPLOAD_PRESET = "bz4oq8ph";
      const UPLOAD_URL = "https://api.cloudinary.com/v1_1/mattezl/image/upload";
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", UPLOAD_PRESET);
        const res = await aux.post(UPLOAD_URL, formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        });
        return res.data.secure_url;
      } catch (error) {
        return error;
      }
    },
    async getDeliveries(id_a) {
      try {
        const res = await this.axios.get(
          `/professor/assignment-deliveries/${id_a}`
        );
        this.deliveries = res.data;
        this.showDelv = true;
        console.log(res.data);
      } catch (error) {
        console.log(error.response);
      }
    }
  },
  components: {
    NavbarP
  }
};
</script>
