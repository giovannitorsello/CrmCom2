<template>
  <div id="service">
    <h5>Sezione personalizzazione servizio</h5>
    <img
      src="./img/actions/new.png"
      @click="newService"
      style="width: 48px; height: 48px;"
    />
    <img
      src="./img/actions/save.png"
      @click="saveService"
      style="width: 48px; height: 48px;"
    />
    <img
      src="./img/actions/delete.png"
      @click="deleteService"
      style="width: 48px; height: 48px;"
    />
    <img
      src="./img/actions/exit.png"
      @click="exit"
      style="width: 48px; height: 48px;"
    />
    <ValidationObserver ref="formServiceContract">
      <q-form ref="serviceForm" class="q-gutter-md">
        <div class="row">
          <div class="col">
            <ValidationProvider
              name="Descrizione"
              immediate
              rules="required|alpha_spaces"
              v-slot="{ errors }"
            >
              <q-input
                label="Descrizione"
                v-model="selectedService.description"
              />
              <span class="error">{{ errors[0] }}</span>
            </ValidationProvider>
          </div>
          <div class="col">
            <q-input label="Codice" v-model="selectedService.code" />
          </div>
          <div class="col">
            <ValidationProvider
              name="Unità"
              immediate
              rules="required|alpha_spaces"
              v-slot="{ errors }"
            >
              <q-input label="Unità" v-model="selectedService.unit" />
              <span class="error">{{ errors[0] }}</span>
            </ValidationProvider>
          </div>
          <div class="col">
            <ValidationProvider
              name="Intervallo di fatturazione"
              immediate
              rules="required|integer"
              v-slot="{ errors }"
            >
              <q-input
                label="Intervallo fatturazione in giorni"
                v-model="selectedService.billingPeriod"
              />
              <span class="error">{{ errors[0] }}</span>
            </ValidationProvider>
          </div>
        </div>

        <div class="row">
          <div class="col">
            <ValidationProvider
              name="Prezzo"
              immediate
              rules="required|decimal"
              v-slot="{ errors }"
            >
              <q-input label="Prezzo" v-model="selectedService.price" />
              <span class="error">{{ errors[0] }}</span>
            </ValidationProvider>
          </div>
          <div class="col">
            <ValidationProvider
              name="IVA"
              immediate
              rules="required|decimal"
              v-slot="{ errors }"
            >
              <q-input label="IVA" v-model="selectedService.vat" />
              <span class="error">{{ errors[0] }}</span>
            </ValidationProvider>
          </div>
        </div>

        <div class="row">
          <div class="col">
            <ValidationProvider
              name="G. avviso fattura"
              immediate
              rules="required|integer"
              v-slot="{ errors }"
            >
              <q-input
                label="Giorni successivi all'invio fattura a partire dai quali viene prodotto l'avviso"
                v-model="selectedService.dayinvoicereminder"
              />
              <span class="error">{{ errors[0] }}</span>
            </ValidationProvider>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <ValidationProvider
              name="G. mancato pagamento"
              immediate
              rules="required|integer"
              v-slot="{ errors }"
            >
              <q-input
                label="Giorni invio preavviso mancato pagamento"
                v-model="selectedService.nopaydaysbeforedeactivation"
              />
              <span class="error">{{ errors[0] }}</span>
            </ValidationProvider>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <ValidationProvider
              name="G. disatt. servizi"
              immediate
              rules="required|integer"
              v-slot="{ errors }"
            >
              <q-input
                label="Giorni invio preavviso disattivazione dei servizi"
                v-model="selectedService.dayforexpirationwarning"
              />
              <span class="error">{{ errors[0] }}</span>
            </ValidationProvider>
          </div>
        </div>
      </q-form>
    </ValidationObserver>
  </div>
</template>

<script lang="js">
import { mapState } from 'vuex'
import {Store} from '../store'
import { ValidationProvider, ValidationObserver, extend, localize } from 'vee-validate';
import validator from "./validator"

export default {
  data() {
    return {
        selectedService: {},
    }
  },
  components: {
    ValidationProvider,
    ValidationObserver
  },
  methods: {
      getServiceData: function() {
        this.selectedService=Object.assign({}, this.$store.state.service);
      },
      newService: function (){
        this.selectedService={};
        this.$store.commit("changeService", {});
      },
      saveService: function (){
        this.$axios.post('/adminarea/contractService/update', {service: this.selectedService})
            .then(response => {
                  if (response.data.status === "OK") {
                      this.selectedService = response.data.service;
                      this.$store.commit("changeService", this.selectedService);
                      this.makeToast(response.data.msg);
                  }
              })
              .catch(error => {
                  console.log(error);
              });
      },
      deleteService: function () {
        this.$axios.post('/adminarea/contractService/delete', {idContractService: this.selectedService.id})
            .then(response => {
                  if (response.data.status === "OK") {
                      this.selectedService = {};
                      this.$store.commit("changeService", this.selectedService);
                      this.makeToast(response.data.msg);
                  }
              })
              .catch(error => {
                  console.log(error);
              });
      },
      exit: function() {
        this.$router.push("/Contract");
      },
      makeToast(string) {
        this.$q.notify({color: 'green-4', textColor: 'white', icon: 'info', message: string});
      }
    },
  computed: mapState({
    user: 'user',
    customer: 'customer',
    contract: 'contract',
    service: 'service',
  }),
  mounted () {
    this.getServiceData();
  },
  beforeRouteEnter(to, from, next) {
    var currentUser = Store.state.user;
    if (
      currentUser.role === "admin" ||
      currentUser.role === "manager" ||
      currentUser.role === "technician"
    )
      next();
    else next("/Login");
  }
}
</script>

<style scoped>
.active {
  background-color: rgb(168, 243, 168);
}

.suspended {
  background-color: rgb(177, 171, 171);
}
</style>
