<template>
  <q-layout view="hHh lpR lFf">
    <q-header reveal elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="left = !left" />

        <q-toolbar-title>CrmCom2 -- ({{user.role}})</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="left" side="left" overlay behavior="mobile" bordered>
      <LeftMenu />
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapState } from "vuex";
import LeftMenu from "../components/LeftMenu.vue";

export default {
  data() {
    return {
      left: false
    };
  },
  created() {
    this.$router.push("/AdminDashboard");
  },
  mounted() {
    
  },
  components: {
    LeftMenu
  },
  computed: mapState({
    user: "user",
    customer: "customer"
  })
};
</script>