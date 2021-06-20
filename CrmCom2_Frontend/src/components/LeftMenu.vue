<template>
  <div>
    <q-list bordered separator>
      <q-item
        clickable
        v-ripple
        :to="menuItem.route"
        v-for="menuItem in pagesAllowed"
        :key="menuItem.id"
      >
        <q-item-section>{{ menuItem.name }}</q-item-section>
      </q-item>
    </q-list>

    <q-btn flat color="primary" label="Logout" @click="logout" />
  </div>
</template>

<script>
import { mapState } from "vuex";
import { Store } from "../store";

export default {
  name: "LeftMenu",
  data() {
    return {
      pagesAllowed: []
    };
  },
  created() {
    if (this.user.role === "admin") {
      this.pagesAllowed = [
        { id: 1, name: "Ricerche", route: "/ViewData", type: "general" },
        {
          id: 2,
          name: "Dispositivi Backbone",
          route: "/DeviceBackbone",
          type: "monitor"
        },
        {
          id: 3,
          name: "Siti Backbone",
          route: "/SiteBackbone",
          type: "backbone"
        },
        {
          id: 4,
          name: "Monitor Dispositivi Cliente",
          route: "/MonitorDevicesCustomer",
          type: "monitor"
        },
        {
          id: 5,
          name: "Monitor Dispositivi Backbone",
          route: "/MonitorDevicesBackbone",
          type: "monitor"
        },
        {
          id: 6,
          name: "Modelli di servizio",
          route: "/ServiceTemplate",
          type: "settings"
        },
        {
          id: 7,
          name: "Impostazioni generali",
          route: "/GeneralSettings",
          type: "settings"
        },
        {
          id: 8,
          name: "Utenti",
          route: "/User",
          type: "settings"
        },
        {
          id: 9,
          name: "Olo companies",
          route: "/Olo",
          type: "settings"
        },
        {
          id: 10,
          name: "Registrazione cliente",
          route: "/WizardCustomerRegistration",
          type: "generic"
        },        
        {
          id: 11,
          name: "Clienti",
          route: "/Customer",
          type: "generic"
        },
        {
          id: 12,
          name: "Contratti",
          route: "/Contract",
          type: "generic"
        },
        {
          id: 13,
          name: "Dispositivi",
          route: "/DeviceCustomer",
          type: "generic"
        }
      ];
    }
    if (this.user.role === "manager") {
      this.pagesAllowed = [
        { id: 1, name: "Ricerche", route: "/ViewData", type: "general" },
        {
          id: 2,
          name: "Dispositivi Backbone",
          route: "/DeviceBackbone",
          type: "monitor"
        },
        {
          id: 3,
          name: "Siti Backbone",
          route: "/SiteBackbone",
          type: "backbone"
        },
        {
          id: 4,
          name: "Monitor Dispositivi Cliente",
          route: "/MonitorDevicesCustomer",
          type: "monitor"
        },
        {
          id: 5,
          name: "Monitor Dispositivi Backbone",
          route: "/MonitorDevicesBackbone",
          type: "monitor"
        },
        {
          id: 6,
          name: "Registrazione cliente",
          route: "/WizardCustomerRegistration",
          type: "generic"
        }
      ];
    }
    if (this.user.role === "technician") {
      this.pagesAllowed = [
        { id: 1, name: "Ricerche", route: "/ViewData", type: "general" },
        {
          id: 2,
          name: "Dispositivi Backbone",
          route: "/DeviceBackbone",
          type: "monitor"
        },
        {
          id: 3,
          name: "Siti Backbone",
          route: "/SiteBackbone",
          type: "backbone"
        },
        {
          id: 4,
          name: "Monitor Dispositivi Cliente",
          route: "/MonitorDevicesCustomer",
          type: "monitor"
        },
        {
          id: 5,
          name: "Monitor Dispositivi Backbone",
          route: "/MonitorDevicesBackbone",
          type: "monitor"
        },
        {
          id: 6,
          name: "Registrazione cliente",
          route: "/WizardCustomerRegistration",
          type: "generic"
        }
      ];
    }
    if (this.user.role === "installer") {
      this.pagesAllowed = [
        {
          id: 1,
          name: "Registrazione cliente",
          route: "/WizardCustomerRegistration",
          type: "generic"
        },
        {
          id: 2,
          name: "Check dispositivo",
          route: "/CheckDevice",
          type: "generic"
        },
        {
          id: 3,
          name: "Registrazione cliente",
          route: "/WizardCustomerRegistration",
          type: "generic"
        }
      ];
    }
    if (this.user.role === "seller") {
      this.pagesAllowed = [
        {
          id: 1,
          name: "Registrazione cliente",
          route: "/WizardCustomerRegistration",
          type: "generic"
        },
        {
          id: 2,
          name: "Registrazione cliente",
          route: "/WizardCustomerRegistration",
          type: "generic"
        }
      ];
    }
  },
  computed: mapState({
    user: "user",
    customer: "customer"
  }),
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
  }
};
</script>

<style scoped></style>
