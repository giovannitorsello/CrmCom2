<template>
  <div id="wrapper">
    <q-form ref="loginForm" @submit="fullTextSearch()" class="q-gutter-md">
      <q-input label="Ricerca cliente" v-model="textToSearch" />
    </q-form>

    <div v-if="showCustomerSearch">
      <q-table
        title="Clienti"
        :data="customers"
        :columns="columnsTableCustomers"
        row-key="id"
        virtual-scroll
        :pagination.sync="pagination"
        :rows-per-page-options="[0]"
        @row-click="selectCustomer"
      />
    </div>
  </div>
</template>

<script lang="js">
import { mapState } from 'vuex'


export default {
  data() {
    return {
        customers: [],
        textToSearch: "",
        showCustomerSearch: false,
        pagination: {rowsPerPage: 0},
        columnsTableCustomers: [
                  {name: "firstname", label: "Nome",    field: row => row.firstname,sortable: true},
                  {name: "lastname", label: "Cognome",  field: row => row.lastname, sortable: true},
                  {name: "phone", label: "Telefono",    field: row => row.mobilephone},
                  {name: "email", label: "Email",       field: row => row.email}
                  ],



    }
  },
  components: {
    /*
      User,
      Customer,
      Contract,
      Service,
      ServiceTemplate,
      DeviceCustomer,
      DeviceBackbone,
      SiteBackbone,
      ViewData,
      MonitoringDeviceCustomer,
      MonitoringDeviceBackbone
      */
  },
  methods: {
      fullTextSearch: function () {
          const store=this.$store;
          this.selectedCustomer={};
          this.showCustomerSearch=true;
          this.$axios.post('/adminarea/fulltextsearch', {textToSearch: this.textToSearch})
          .then(response => {
                if (response.data.status === "OK") {
                    this.customers = response.data.results;
                    if(this.customers.length>0)
                      this.$q.notify({color: 'green-4', textColor: 'white', icon: 'cloud_done', message: 'Ricerca effettuata'});
                    else
                      this.$q.notify({color: 'green-4', textColor: 'white', icon: 'cloud_done', message: 'Nessun risultato'});
                }
            })
            .catch(error => {
                this.makeToast('Nessun cliente');
                console.log(error);
            });
      },
      selectCustomer(evt, cst, index) {
          const store=this.$store;
          this.showCustomerSearch=false;
          store.commit("changeCustomer", cst);
          this.$router.push("/Customer");
      }
  },
  computed: mapState({
    user: 'user',
    customer: 'customer',
    contract: 'contract',
    deviceCustomer: 'deviceCustomer',
    }),
  created() {
  }
}
</script>
