<template>
  <q-layout view="hHh lpR lFf">
    <q-header reveal elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="left = !left" />

        <q-toolbar-title>CrmCom2 (Tecnico interno)</q-toolbar-title>
      </q-toolbar>
    </q-header>

   <q-drawer v-model="left" side="left" overlay behavior="mobile" bordered>
      <LeftMenu/>      
    </q-drawer>

    <q-page-container>
      <q-page padding>
        <router-view />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import LeftMenu from "../components/LeftMenu.vue"

export default {
  data() {
    return {
      left: false
    };
  },
  methods: {
    logout() {
      const store = this.$store;
      const usr = this.$store.state.user;
      this.$axios
        .post("/adminarea/logout", { user: usr })
        .then(response => {
          store.commit("changeUser", {});
          this.$router.push("/Login");
        })
        .catch(error => {
          store.commit("changeUser", {});
          this.$router.push("/Login");
          console.log(error);
        });
    }
  },
  components: {
    LeftMenu
  }
};
</script>