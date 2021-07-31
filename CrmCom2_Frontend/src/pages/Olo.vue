<template>
  <div id="olos">
    <h6>
      Gestione OLO companies
      <strong>{{ selectedOlo.company }}</strong>
    </h6>
    <img
      src="asset/img/actions/new.png"
      @click="newOlo"
      style="width: 48px; height: 48px"
    />
    <img
      src="asset/img/actions/save.png"
      @click="saveOlo"
      style="width: 48px; height: 48px"
    />
    <img
      src="asset/img/actions/delete.png"
      @click="deleteOlo"
      style="width: 48px; height: 48px"
    />

    <ValidationObserver ref="formOlo">
      <q-form ref="oloForm" class="q-gutter-md">
        <q-tabs v-model="tab" class="text-teal">
          <q-tab name="company" icon="face" label="Company" />
          <q-tab
            name="assurancePhase2"
            icon="contacts"
            label="Assurance Phase 2"
          />
          <q-tab
            name="assurancePhase3"
            icon="contacts"
            label="Assurance Phase 3"
          />
          <q-tab name="service" icon="computer" label="Servizio di scambio" />
          <q-tab
            name="migrationMod"
            icon="contacts"
            label="Modalità di Migrazione"
          />
        </q-tabs>

        <q-separator />
        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="company">
            <div class="row">
              <div class="col">
                <ValidationProvider
                  name="company"
                  immediate
                  rules="required|alpha_spaces"
                  v-slot="{ errors }"
                >
                  <q-input label="Company" v-model="selectedOlo.company" />
                  <span class="error">{{ errors[0] }}</span>
                </ValidationProvider>

                <ValidationProvider
                  name="cow"
                  immediate
                  rules="required|alpha"
                  v-slot="{ errors }"
                >
                  <q-input label="cow" v-model="selectedOlo.cow" />
                  <span class="error">{{ errors[0] }}</span>
                </ValidationProvider>

                <ValidationProvider
                  name="mailConsumer"
                  immediate
                  rules="email"
                  v-slot="{ errors }"
                >
                  <q-input
                    label="Mail consumer"
                    v-model="selectedOlo.mailConsumer"
                  />
                  <span class="error">{{ errors[0] }}</span>
                </ValidationProvider>

                <ValidationProvider
                  name="mailCorporate"
                  immediate
                  rules="email"
                  v-slot="{ errors }"
                >
                  <q-input
                    label="Mail corporate"
                    v-model="selectedOlo.mailCorporate"
                  />
                  <span class="error">{{ errors[0] }}</span>
                </ValidationProvider>
              </div>
            </div>
          </q-tab-panel>

          <q-tab-panel name="assurancePhase2">
            <div class="row">
              <div class="col">
                <ValidationProvider
                  name="contactAssurancePhase2FirstName"
                  immediate
                  rules="alpha"
                  v-slot="{ errors }"
                >
                  <q-input
                    label="Nome"
                    v-model="selectedOlo.contactAssurancePhase2FirstName"
                  />
                  <span class="error">{{ errors[0] }}</span>
                </ValidationProvider>
                <ValidationProvider
                  name="contactAssurancePhase2LastName"
                  immediate
                  rules="alpha"
                  v-slot="{ errors }"
                >
                  <q-input
                    label="Cognome"
                    v-model="selectedOlo.contactAssurancePhase2LastName"
                  />
                  <span class="error">{{ errors[0] }}</span>
                </ValidationProvider>
                <ValidationProvider
                  name="contactAssurancePhase2Phone"
                  immediate
                  rules="phone"
                  v-slot="{ errors }"
                >
                  <q-input
                    label="Phone"
                    v-model="selectedOlo.contactAssurancePhase2Phone"
                  />
                  <span class="error">{{ errors[0] }}</span>
                </ValidationProvider>
                <ValidationProvider
                  name="contactAssurancePhase2Mail"
                  immediate
                  rules="email"
                  v-slot="{ errors }"
                >
                  <q-input
                    label="Email"
                    v-model="selectedOlo.contactAssurancePhase2Mail"
                  />
                  <span class="error">{{ errors[0] }}</span>
                </ValidationProvider>
              </div>
            </div>
          </q-tab-panel>

          <q-tab-panel name="assurancePhase3">
            <div class="row">
              <div class="col">
                <ValidationProvider
                  name="contactAssurancePhase3FirstName"
                  immediate
                  rules="alpha"
                  v-slot="{ errors }"
                >
                  <q-input
                    label="Nome"
                    v-model="selectedOlo.contactAssurancePhase3FirstName"
                  />
                  <span class="error">{{ errors[0] }}</span>
                </ValidationProvider>
                <ValidationProvider
                  name="contactAssurancePhase3LastName"
                  immediate
                  rules="alpha"
                  v-slot="{ errors }"
                >
                  <q-input
                    label="Cognome"
                    v-model="selectedOlo.contactAssurancePhase3LastName"
                  />
                  <span class="error">{{ errors[0] }}</span>
                </ValidationProvider>
                <ValidationProvider
                  name="contactAssurancePhase3Phone"
                  immediate
                  rules="phone"
                  v-slot="{ errors }"
                >
                  <q-input
                    label="Phone"
                    v-model="selectedOlo.contactAssurancePhase3Phone"
                  />
                  <span class="error">{{ errors[0] }}</span>
                </ValidationProvider>
                <ValidationProvider
                  name="contactAssurancePhase3Mail"
                  immediate
                  rules="email"
                  v-slot="{ errors }"
                >
                  <q-input
                    label="Email"
                    v-model="selectedOlo.contactAssurancePhase3Mail"
                  />
                  <span class="error">{{ errors[0] }}</span>
                </ValidationProvider>
                <ValidationProvider
                  name="contactAssurancePhase3Service"
                  immediate
                  rules=""
                  v-slot="{ errors }"
                >
                  <q-input
                    label="Email"
                    v-model="selectedOlo.contactAssurancePhase3Service"
                  />
                  <span class="error">{{ errors[0] }}</span>
                </ValidationProvider>
              </div>
            </div>
          </q-tab-panel>

          <q-tab-panel name="service">
            <div class="row">
              <div class="col">
                <ValidationProvider
                  name="serviceProtocol"
                  immediate
                  rules="alpha"
                  v-slot="{ errors }"
                >
                  <q-input
                    label="Protocol"
                    v-model="selectedOlo.serviceProtocol"
                  />
                  <span class="error">{{ errors[0] }}</span>
                </ValidationProvider>
                <ValidationProvider
                  name="serviceDns"
                  immediate
                  rules=""
                  v-slot="{ errors }"
                >
                  <q-input
                    label="service Dns"
                    v-model="selectedOlo.serviceDns"
                  />
                  <span class="error">{{ errors[0] }}</span>
                </ValidationProvider>
                <ValidationProvider
                  name="servicePort"
                  immediate
                  rules="phone"
                  v-slot="{ errors }"
                >
                  <q-input
                    label="Service port"
                    v-model="selectedOlo.servicePort"
                  />
                  <span class="error">{{ errors[0] }}</span>
                </ValidationProvider>

                <ValidationProvider
                  name="serviceContext"
                  immediate
                  rules=""
                  v-slot="{ errors }"
                >
                  <q-input
                    label="Service context"
                    v-model="selectedOlo.serviceContext"
                  />
                  <span class="error">{{ errors[0] }}</span>
                </ValidationProvider>

                <ValidationProvider
                  name="serviceComponent"
                  immediate
                  rules=""
                  v-slot="{ errors }"
                >
                  <q-input
                    label="Service component"
                    v-model="selectedOlo.serviceComponent"
                  />
                  <span class="error">{{ errors[0] }}</span>
                </ValidationProvider>

                <ValidationProvider
                  name="serviceOperator"
                  immediate
                  rules=""
                  v-slot="{ errors }"
                >
                  <q-input
                    label="Service operator"
                    v-model="selectedOlo.serviceOperator"
                  />
                  <span class="error">{{ errors[0] }}</span>
                </ValidationProvider>

                <ValidationProvider
                  name="serviceFileType"
                  immediate
                  rules=""
                  v-slot="{ errors }"
                >
                  <q-input
                    label="Service filetype"
                    v-model="selectedOlo.serviceFileType"
                  />
                  <span class="error">{{ errors[0] }}</span>
                </ValidationProvider>

                <ValidationProvider
                  name="serviceFileName"
                  immediate
                  rules=""
                  v-slot="{ errors }"
                >
                  <q-input
                    label="Service filename"
                    v-model="selectedOlo.serviceFileName"
                  />
                  <span class="error">{{ errors[0] }}</span>
                </ValidationProvider>

                <ValidationProvider
                  name="serviceUrl"
                  immediate
                  rules=""
                  v-slot="{ errors }"
                >
                  <q-input
                    label="Service url"
                    v-model="selectedOlo.serviceUrl"
                  />
                  <span class="error">{{ errors[0] }}</span>
                </ValidationProvider>

                <ValidationProvider
                  name="serviceCertificates"
                  immediate
                  rules=""
                  v-slot="{ errors }"
                >
                  <q-input
                    label="Service certificates"
                    v-model="selectedOlo.serviceCertificates"
                  />
                  <span class="error">{{ errors[0] }}</span>
                </ValidationProvider>

                <ValidationProvider
                  name="serviceClientType"
                  immediate
                  rules=""
                  v-slot="{ errors }"
                >
                  <q-input
                    label="Service clientitype"
                    v-model="selectedOlo.serviceClientType"
                  />
                  <span class="error">{{ errors[0] }}</span>
                </ValidationProvider>

                <ValidationProvider
                  name="serviceIP"
                  immediate
                  rules=""
                  v-slot="{ errors }"
                >
                  <q-input label="Service IP" v-model="selectedOlo.serviceIP" />
                  <span class="error">{{ errors[0] }}</span>
                </ValidationProvider>

                <ValidationProvider
                  name="serviceNote"
                  immediate
                  rules=""
                  v-slot="{ errors }"
                >
                  <q-input
                    label="Service Note"
                    v-model="selectedOlo.serviceNote"
                  />
                  <span class="error">{{ errors[0] }}</span>
                </ValidationProvider>
              </div>
            </div>
          </q-tab-panel>

          <q-tab-panel name="migrationMod">
            <div id="companyOloFields">
              <div class="row">
                <div class="col">
                  <div
                    id="oloMigrationModalitySections"
                    v-if="selectedOlo.objData"
                  >
                    <div
                      v-for="(section, sectionName, indexSection) in selectedOlo
                        .objData.migrationModalities"
                      v-bind:key="indexSection"
                    >
                      <h6>
                        <p align="left">{{ sectionName }}</p>
                      </h6>
                      <div class="row">
                        <div
                          v-for="(oloProperty,
                          oloPropertyName,
                          indexProperty) in section"
                          v-bind:key="indexProperty"
                        >
                          <div class="col">
                            <label
                              v-bind:for="`${oloPropertyName}_${sectionName}`"
                              class="form-control form-control-user"
                              >{{ oloPropertyName }}</label
                            >
                            <input
                              class="form-control form-control-user"
                              v-bind:id="`${oloPropertyName}_${sectionName}`"
                              v-model="
                                selectedOlo.objData.migrationModalities[
                                  sectionName
                                ][oloPropertyName]
                              "
                            />
                          </div>
                        </div>
                      </div>
                      <hr class="separator" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </q-form>
    </ValidationObserver>

    <q-separator vertical inset />

    <div v-if="olos">
      <q-table
        title="Olo companies"
        :data="olos"
        :columns="columnsTableOlos"
        row-key="id"
        virtual-scroll
        :pagination="initialPagination"
        @row-click="openOlo"
        :filter="txtFilterOloTable"
      >
        <template v-slot:top-right>
          <q-input
            borderless
            dense
            debounce="300"
            v-model="txtFilterOloTable"
            placeholder="Ricerca"
          >
            <q-icon slot="append" name="search" />
          </q-input>
        </template>

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
                src="asset/img/actions/open.png"
                style="width: 32px; height: 32px"
                v-on:click="openOlo(props.row)"
              />
              <img
                src="asset/img/actions/delete.png"
                style="width: 32px; height: 32px; xfill: gray"
                v-on:click="deleteOlo(props.row)"
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
        tab: 'company',
        selectedOlo: {},
        olos: [],
        oloClassStyleRow: "",
        txtFilterOloTable: "",
        initialPagination: {
          sortBy: "desc",
          descending: false,
          page: 2,
          rowsPerPage: 5
        },
        pagination: {rowsPerPage: 0},
        columnsTableOlos: [
                  {name: "company",     label: "Company",                field: row => row.company, sortable: true},
                  {name: "cow",         label: "Cow",                    field: row => row.cow, sortable: true},
                  {name: "mailConsumer", label: "Mail consumer",         field: row => row.mailConsumer},
                  {name: "mailCorporate",     label: "Mail corporate",   field: row => row.mailCorporate},
                  ]
    }
  },
  methods: {
      openOlo: function (olo) {
          this.$store.commit("changeOlo", olo);
          this.selectedOlo=olo;
      },
      getAllOlos: function() {
        this.$axios.post('/adminarea/olo/getall', {})
            .then(response => {
                  if (response.data.status === "OK") {
                      this.olos = response.data.olos;
                      this.makeToast(response.data.msg);
                  }
              })
              .catch(error => {
                  console.log(error);
              });
      },
      getOloData: function () {
        if(this.$store.state.olo) {
          this.selectedOlo=Object.assign({}, this.$store.state.olo);
        }
      },
      newOlo: function() {
        this.selectedOlo={};
        this.$store.commit("changeOlo",this.selectedOlo);
      },
      async saveOlo() {
        const valid = true;
        if(valid) {
        this.$axios.post('/adminarea/olo/update', {olo: this.selectedOlo})
          .then(response => {
                if (response.data.status === "OK") {
                    this.selectedOlo = response.data.olo;
                    this.$store.commit("changeOlo", this.selectedOlo);
                    this.makeToast(response.data.msg);
                    this.getOloData();
                    alert("Olo company inserita");
                }
            })
            .catch(error => {
                console.log(error);
            });
        }
        else {
          alert("Dati errati controlla i campi inseriti");
        }
      },
      deleteOlo: function() {
        const isConfirmed = confirm("Confermi la cancellazione?");
        if(isConfirmed) {
        this.$axios.post('/adminarea/olo/delete', {olo: this.selectedOlo})
          .then(response => {
                if (response.data.status === "OK") {
                    this.selectedOlo = response.data.olo;
                    this.$store.commit("changeOlo", this.selectedOlo);
                    this.makeToast(response.data.msg);
                    this.getOloData();
                }
            })
            .catch(error => {
                console.log(error);
            });
        }
      },
      makeToast(string) {
        this.$q.notify({color: 'green-4', textColor: 'white', icon: 'info', message: string});
      }
  },
  mounted() {
    validator.setup();
    this.getAllOlos();
  },
  computed: mapState({
    user: 'user',
    olo: 'olo'
    }),
    components: {
      ValidationProvider,
      ValidationObserver
    },
    beforeRouteEnter(to, from, next) {
    var currentUser = Store.state.user;
    if ((currentUser.role === "admin") ||
        (currentUser.role === "manager"))  next();
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
</style>
