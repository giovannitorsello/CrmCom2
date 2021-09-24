<template>
  <div id="customers">
    <h6>
      Gestione del cliente
      <strong>{{ customerDescription }}</strong>
    </h6>
    <ValidationObserver v-slot="observer" ref="obs">
      <img
        src="./img/actions/new.png"
        @click="newCustomer"
        style="width: 48px; height: 48px;"
        :disabled="observer.invalid"
      />
      <img
        src="./img/actions/save.png"
        @click="saveCustomer"
        style="width: 48px; height: 48px;"
        :disabled="observer.invalid"
      />
      <img
        src="./img/actions/delete.png"
        @click="deleteCustomer"
        style="width: 48px; height: 48px;"
      />
      <img
        src="./img/actions/exit.png"
        @click="exit"
        style="width: 48px; height: 48px;"
      />

      <q-form ref="customerForm" class="q-gutter-md">
        <div class="row">
          <div class="col">
            <q-toggle label="Azienda" v-model="isCompany" />
          </div>
          <div class="col">
            <q-checkbox
              label="Da fatturare"
              v-model="isBusinness"
              @input="changeBusinness()"
            />
          </div>
        </div>

        <q-tabs v-model="tab" class="text-teal">
          <q-tab name="person" icon="face" label>
            <p>
              Intestatario
              <br />Legale rappresentate
            </p>
          </q-tab>
          <q-tab name="address" icon="contacts" label="Indirizzo" />
          <q-tab
            name="company"
            icon="building"
            label="Azienda"
            v-if="isCompany"
          />
          <q-tab name="contacts" icon="phone" label="Contatti" />
          <q-tab name="security" icon="security" label="Credenziali" />
        </q-tabs>
        <q-separator />
        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="person">
            <div class="row">
              <div class="col">
                <ValidationProvider
                  name="Nome"
                  immediate
                  rules="required|alpha_spaces"
                  v-slot="{ errors }"
                >
                  <q-input label="Nome" v-model="selectedCustomer.firstname" />
                  <span class="error">{{ errors[0] }}</span>
                </ValidationProvider>

                <ValidationProvider
                  name="Cognome"
                  immediate
                  rules="required|alpha_spaces"
                  v-slot="{ errors }"
                >
                  <q-input
                    label="Cognome"
                    v-model="selectedCustomer.lastname"
                  />
                  <span class="error">{{ errors[0] }}</span>
                </ValidationProvider>

                <ValidationProvider
                  name="Codice Fiscale"
                  immediate
                  rules="required|codfis"
                  v-slot="{ errors }"
                >
                  <q-input
                    label="Codice Fiscale"
                    v-model="selectedCustomer.codfis"
                  />
                  <span class="error">{{ errors[0] }}</span>
                </ValidationProvider>
              </div>
            </div>
          </q-tab-panel>

          <q-tab-panel name="address">
            <div class="row">
              <div class="col">
                <ValidationProvider
                  name="Indirizzo"
                  immediate
                  rules="required|address"
                  v-slot="{ errors }"
                >
                  <q-input
                    label="Indirizzo"
                    v-model="selectedCustomer.address"
                  />
                  <span class="error">{{ errors[0] }}</span>
                </ValidationProvider>

                <ValidationProvider
                  name="CAP"
                  immediate
                  rules="required|alpha_num"
                  v-slot="{ errors }"
                >
                  <q-input label="CAP" v-model="selectedCustomer.postalcode" />
                  <span class="error">{{ errors[0] }}</span>
                </ValidationProvider>

                <ValidationProvider
                  name="Città"
                  immediate
                  rules="required|alpha"
                  v-slot="{ errors }"
                >
                  <q-input label="Città" v-model="selectedCustomer.city" />
                  <span class="error">{{ errors[0] }}</span>
                </ValidationProvider>

                <ValidationProvider
                  name="Stato"
                  immediate
                  rules="required|alpha"
                  v-slot="{ errors }"
                >
                  <q-input label="Stato" v-model="selectedCustomer.state" />
                  <span class="error">{{ errors[0] }}</span>
                </ValidationProvider>
              </div>
            </div>
          </q-tab-panel>

          <q-tab-panel name="company">
            <div id="companyFields" v-if="isCompany">
              <div class="row">
                <div class="col">
                  <ValidationProvider
                    name="Denominazone Azienda"
                    immediate
                    rules="required"
                    v-slot="{ errors }"
                  >
                    <q-input
                      label="Denominazione Azienda"
                      v-model="selectedCustomer.company"
                    />
                    <span class="error">{{ errors[0] }}</span>
                  </ValidationProvider>

                  <ValidationProvider
                    name="Indirizzo Sede Azienda"
                    immediate
                    rules="required|address"
                    v-slot="{ errors }"
                  >
                    <q-input
                      label="Indirizzo Sede Azienda"
                      v-model="selectedCustomer.companyaddress"
                    />
                    <span class="error">{{ errors[0] }}</span>
                  </ValidationProvider>

                  <ValidationProvider
                    name="Telefono principale aziendale"
                    immediate
                    rules="required|phone"
                    v-slot="{ errors }"
                  >
                    <q-input
                      label="Telefono principale aziendale"
                      v-model="selectedCustomer.companyphone"
                      type="tel"
                    />
                    <span class="error">{{ errors[0] }}</span>
                  </ValidationProvider>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <ValidationProvider
                    name="Partita IVA"
                    rules="required|vatcode"
                    v-slot="{ errors }"
                  >
                    <q-input
                      label="Partita IVA"
                      v-model="selectedCustomer.vatcode"
                    />
                    <span class="error">{{ errors[0] }}</span>
                  </ValidationProvider>

                  <ValidationProvider
                    name="Codice univoco SDI"
                    rules="required|alpha_num"
                    v-slot="{ errors }"
                  >
                    <q-input
                      label="Codice Univoco SDI"
                      v-model="selectedCustomer.sdicode"
                    />
                    <span class="error">{{ errors[0] }}</span>
                  </ValidationProvider>

                  <ValidationProvider
                    name="Email PEC"
                    rules="required|email"
                    v-slot="{ errors }"
                  >
                    <q-input
                      label="Email PEC"
                      v-model="selectedCustomer.companypec"
                      type="email"
                    />
                    <span class="error">{{ errors[0] }}</span>
                  </ValidationProvider>
                </div>
              </div>
            </div>
          </q-tab-panel>

          <q-tab-panel name="contacts">
            <div class="row .offset-md-4">
              <div class="col">
                <ValidationProvider
                  name="Email"
                  immediate
                  rules="required|email"
                  v-slot="{ errors }"
                >
                  <q-input
                    label="Email"
                    v-model="selectedCustomer.email"
                    type="email"
                  />
                  <span class="error">{{ errors[0] }}</span>
                </ValidationProvider>

                <ValidationProvider
                  name="Tel. Mobile"
                  immediate
                  rules="required|phone"
                  v-slot="{ errors }"
                >
                  <q-input
                    label="Tel. Mobile"
                    v-model="selectedCustomer.mobilephone"
                    type="tel"
                  />
                  <span class="error">{{ errors[0] }}</span>
                </ValidationProvider>

                <ValidationProvider
                  name="Tel. Fisso"
                  immediate
                  rules="required|phone"
                  v-slot="{ errors }"
                >
                  <q-input
                    label="Tel. Fisso"
                    v-model="selectedCustomer.phone"
                    type="tel"
                  />
                  <span class="error">{{ errors[0] }}</span>
                </ValidationProvider>
              </div>
            </div>
          </q-tab-panel>

          <q-tab-panel name="security">
            <div class="row">
              <div class="col">
                <ValidationProvider
                  name="Nome utente"
                  immediate
                  rules="required|email"
                  v-slot="{ errors }"
                >
                  <q-input
                    label="Nome utente"
                    v-model="selectedCustomer.username"
                  />
                  <span class="error">{{ errors[0] }}</span>
                </ValidationProvider>

                <ValidationProvider
                  name="Password"
                  immediate
                  rules="required"
                  v-slot="{ errors }"
                >
                  <q-input
                    label="Password"
                    v-model="selectedCustomer.password"
                    filled
                    :type="isPwd ? 'password' : 'text'"
                  >
                    <template v-slot:append>
                      <q-icon
                        :name="isPwd ? 'visibility_off' : 'visibility'"
                        class="cursor-pointer"
                        @click="isPwd = !isPwd"
                      />
                    </template>
                  </q-input>
                  <span class="error">{{ errors[0] }}</span>
                </ValidationProvider>
              </div>
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </q-form>
    </ValidationObserver>

    <q-separator vertical inset />

    <div v-if="contracts">
      <q-table
        title="Contratti"
        :data="contracts"
        :columns="columnsTableContracts"
        row-key="id"
        virtual-scroll
        :pagination.sync="pagination"
        :rows-per-page-options="[0]"
        @row-click="openContract"
      >
        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th auto-width />
            <q-th v-for="col in props.cols" :key="col.name" :props="props">{{
              col.label
            }}</q-th>
          </q-tr>
        </template>
        <template v-slot:body="props">
          <q-tr :props="props" v-bind:class="props.row.state">
            <q-td auto-width>
              <img
                src="./img/actions/open.png"
                style="width: 32px; height: 32px;"
                v-on:click="openContract(props.row)"
              />
              <img
                src="./img/actions/unlocked.png"
                style="width: 32px; height: 32px; xfill:green;"
                v-on:click="activateContract(props.row)"
              />
              <img
                src="./img/actions/locked.png"
                style="width: 32px; height: 32px; xfill:red;"
                v-on:click="suspendContract(props.row)"
              />
              <img
                src="./img/actions/delete.png"
                style="width: 32px; height: 32px; xfill: gray;"
                v-on:click="deleteContract(props.row)"
              />
            </q-td>
            <q-td v-for="col in props.cols" :key="col.name" :props="props">{{
              col.value
            }}</q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
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
        tab: 'person',
        isPwd: true,
        isCompany: false,
        isBusinness: true,
        selectedCustomer: {},
        selectedContract: {},
        contracts: [],
        contractClassStyleRow: "",
        pagination: {rowsPerPage: 0},
        columnsTableContracts: [
                  {name: "actions",     label: "Azioni"},
                  {name: "Stato",       label: "state",               field: row => row.state},
                  {name: "description", label: "Descrizione",         field: row => row.description,sortable: true},
                  {name: "address",     label: "Indirizzo",           field: row => row.address, sortable: true},
                  {name: "duration",    label: "Durata",              field: row => row.duration},
                  {name: "createdAt",   label: "Data inserimento",    field: row => row.createdAt}
                  ],
        columnsTableDevices: [
                  {name: "description", label: "Descrizione",    field: row => row.description,sortable: true},
                  {name: "ipv4",        label: "Ip",             field: row => row.address, sortable: true},
                  {name: "mac",         label: "Mac",            field: row => row.duration},
                  {name: "Stato",       label: "state",          field: row => row.state},
                  ],
    }
  },
  methods: {
      openContract: function (ctr) {
          this.$store.commit("changeContract", ctr);
          this.$router.push("/Contract")
      },
      activateContract: function(ctr) {
        ctr.state="active";
        this.$axios.post('/adminarea/contract/update', {contract: ctr})
          .then(response => {
                if (response.data.status === "OK") {
                    this.selectedContract = response.data.contract;
                    this.$store.commit("changeContract", this.selectedContract);
                }
            })
            .catch(error => {
                console.log(error);
            });
      },
      suspendContract: function(ctr) {
        ctr.state="suspended";
        this.$axios.post('/adminarea/contract/update', {contract: ctr})
          .then(response => {
                if (response.data.status === "OK") {
                    this.selectedContract = response.data.contract;
                    this.$store.commit("changeContract", this.selectedContract);
                }
            })
            .catch(error => {
                console.log(error);
            });
      },
      deleteContract: function(ctr) {
        const isConfirmed = confirm("Confermi la cancellazione?");
        if(isConfirmed) {
          this.$axios.post('/adminarea/contract/delete', {contract: ctr})
          .then(response => {
                if (response.data.status === "OK") {
                    this.selectedContract = response.data.contract;
                    this.$store.commit("changeContract", this.selectedContract);
                    this.getCustomerContracts();
                }
            })
            .catch(error => {
                console.log(error);
            });
        }
        return "";
      },
      getCustomerData: function () {
        if(this.$store.state.customer) {
          this.selectedCustomer=Object.assign({}, this.$store.state.customer);
          if(!this.selectedCustomer.vatcode || this.selectedCustomer.vatcode==="") this.isCompany = false;
          else {this.isCompany = true; this.tab="company";}
          this.isBusinness=this.selectedCustomer.businessflag;
          this.getCustomerContracts();
        }
      },
      getCustomerContracts: function () {
          const store=this.$store;
          this.showCustomerSearch=true;
          this.$axios.post('/adminarea/contract/get_all_by_customer', {idCustomer: this.selectedCustomer.id})
          .then(response => {
                if (response.data.status === "OK") {
                    this.contracts = response.data.contracts;
                }
            })
            .catch(error => {
                console.log(error);
            });
      },
      changeCustomerType: function () {
          if (this.isCompanyBtn.value === false) {
              this.selectedCustomer.vatcode = "";
              this.isCompanyBtn.value = true;
              this.isCompanyBtn.caption = "<span><i class='fa fa-industry'></i> Azienda</span>";
          }
          else if (this.isCompanyBtn.value === true) {
              this.selectedCustomer.vatcode = "";
              this.isCompanyBtn.value = false;
              this.isCompanyBtn.caption = "<span><i class='fa fa-home'></i> Privato</span>";
          }
          this.isCompany=this.isCompanyBtn.value;
      },
      changeBusinness: function() {
        if (this.isBusinness === false) {
              this.selectedCustomer.businessflag=false;
        }
        else if (this.isBusinness === true) {
            this.selectedCustomer.businessflag=true;
        }
      },
      newCustomer: function() {
        this.selectedCustomer={};
        this.contracts = [];
        this.selectedContract={}
        this.$store.commit("changeCustomer",this.selectedCustomer);
      },
      async saveCustomer() {
        if(this.isCompany===false) {
          console.log("Set company field empty. User is not a company");
          this.selectedCustomer.vatcode="";
          this.selectedCustomer.sdicode="";
          this.selectedCustomer.company="";
          this.selectedCustomer.companyphone="";
          this.selectedCustomer.companyaddress="";
          this.selectedCustomer.companypec="";
        }

        this.$axios.post('/adminarea/customer/update', {customer: this.selectedCustomer})
          .then(response => {
                if (response.data.status === "OK") {
                    this.selectedCustomer = response.data.customer;
                    this.$store.commit("changeCustomer", this.selectedCustomer);
                    this.makeToast(response.data.msg);
                    this.getCustomerData();
                }
            })
            .catch(error => {
                console.log(error);
            });
      },
      deleteCustomer: function() {
        const isConfirmed = confirm("Confermi la cancellazione?");
        if(isConfirmed) {
        this.$axios.post('/adminarea/customer/delete', {customer: this.selectedCustomer})
          .then(response => {
                if (response.data.status === "OK") {
                    this.selectedCustomer = response.data.customer;
                    this.$store.commit("changeCustomer", this.selectedCustomer);
                    this.makeToast(response.data.msg);
                    this.getCustomerData();
                }
            })
            .catch(error => {
                console.log(error);
            });
        }
      },
      exit: function() {
        this.$router.push("/AdminDashboard");
      },
      makeToast(string) {
        this.$q.notify({color: 'green-4', textColor: 'white', icon: 'info', message: string});
      }
  },
  mounted() {
    validator.setup();
    this.getCustomerData();
  },
  computed: mapState({
    user: 'user',
    customer: 'customer',
    customerDescription() {
      const customer=this.customer;

      if(customer.vatcode && customer.vatcode!=="")
        return customer.company;
      else if(customer.lastname && customer.firstname)
        return customer.lastname+" "+customer.firstname;
      else
        return "Ricerca o inserisci un nuovo cliente";
    }
    }),
    components: {
      ValidationProvider,
      ValidationObserver
    },
    beforeRouteEnter(to, from, next) {
    var currentUser = Store.state.user;
    if ((currentUser.role === "admin") ||
        (currentUser.role === "manager") ||
        (currentUser.role === "technician"))  next();
    else next("/Login");
  }
}
</script>

<style scoped>
.valid {
  border-color: rgb(0, 255, 0);
  background-color: rgb(0, 255, 0);
}

.invalid {
  border-color: rgb(255, 0, 0);
  background-color: rgb(255, 0, 0);
}

.error {
  color: rgb(127, 127, 0);
  background-color: yellow;
  font-style: italic;
}

.active {
  background-color: rgb(168, 243, 168);
}

.suspended {
  background-color: rgb(177, 171, 171);
}
</style>
