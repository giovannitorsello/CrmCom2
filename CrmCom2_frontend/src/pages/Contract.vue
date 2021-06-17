<template>
  <div id="contracts">
    <h6>
      Gestione contratti
      <strong>{{ customerDescription }}</strong>
    </h6>
    <img
      src="/img/actions/new.png"
      @click="newContract"
      style="width: 48px; height: 48px"
    />
    <img
      src="/img/actions/save.png"
      @click="saveContract"
      style="width: 48px; height: 48px"
    />
    <img
      src="/img/actions/delete.png"
      @click="deleteContract"
      style="width: 48px; height: 48px"
    />
    <img
      src="/img/actions/exit.png"
      @click="exit"
      style="width: 48px; height: 48px"
    />

    <!--Tab division of contract sections-->

    <ValidationObserver ref="FormDeviceCustomer">
      <q-form ref="contractForm" class="q-gutter-md">
        <q-tabs v-model="tab" class="text-teal">
          <q-tab name="general" icon="article" label="Generale" />
          <q-tab name="services" icon="euro_symbol" label="Servizi" />
          <q-tab name="invoice" icon="receipt" label="Fatturazione" />
          <q-tab name="devices" icon="router" label="Dispositivi" />
        </q-tabs>
        <q-separator />
        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="general">
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
                    v-model="selectedContract.description"
                  />
                  <span class="error">{{ errors[0] }}</span>
                </ValidationProvider>
                <ValidationProvider
                  name="Indirizzo"
                  immediate
                  rules="required|address"
                  v-slot="{ errors }"
                >
                  <q-input
                    label="Indirizzo"
                    v-model="selectedContract.address"
                  />
                  <span class="error">{{ errors[0] }}</span>
                </ValidationProvider>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <ValidationProvider
                  name="Durata in giorni"
                  immediate
                  rules="required|integer"
                  v-slot="{ errors }"
                >
                  <q-input
                    label="Durata in giorni"
                    v-model="selectedContract.duration"
                  />
                  <span class="error">{{ errors[0] }}</span>
                </ValidationProvider>
                <ValidationProvider
                  name="Rinnovo automatico"
                  immediate
                  rules="required"
                  v-slot="{ errors }"
                >
                  <q-checkbox
                    label="Rinnovo Automatico"
                    v-model="selectedContract.automaticRenew"
                  />
                  <span class="error">{{ errors[0] }}</span>
                </ValidationProvider>
                <ValidationProvider
                  name="Da Fatturare"
                  immediate
                  rules="required"
                  v-slot="{ errors }"
                >
                  <q-checkbox
                    label="Da fatturare"
                    v-model="selectedContract.businnessFlag"
                  />
                  <span class="error">{{ errors[0] }}</span>
                </ValidationProvider>
              </div>
            </div>
          </q-tab-panel>
          <q-tab-panel name="services">
            <div class="row">
              <div class="col">
                <q-select
                  filled
                  label="Categoria"
                  @input="changeCategory"
                  :options="serviceCategories"
                  v-model="selectedCategory"
                />
                <q-select
                  filled
                  label="Modelli di servizio"
                  v-model="serviceTemplate"
                  :options="optionsServiceTemplates"
                />
                <div class="col">
                  <img
                    src="/img/actions/new.png"
                    alt="seleziona"
                    style="width: 32px; height: 32px; xfill: greenyellow"
                    v-on:click="addService()"
                  />
                </div>
              </div>
            </div>

            <div v-if="services">
              <q-table
                title="Servizi associati al contratto"
                :data="services"
                :columns="columnsTableServices"
                row-key="id"
                virtual-scroll
                :pagination.sync="pagination"
                :rows-per-page-options="[0]"
                @row-click="openService"
              >
                <template v-slot:header="props">
                  <q-tr :props="props">
                    <q-th auto-width />
                    <q-th
                      v-for="col in props.cols"
                      :key="col.name"
                      :props="props"
                      >{{ col.label }}</q-th
                    >
                  </q-tr>
                </template>
                <template v-slot:body="props">
                  <q-tr :props="props" v-bind:class="props.row.state">
                    <q-td auto-width>
                      <img
                        src="/img/actions/open.png"
                        style="width: 32px; height: 32px"
                        v-on:click="openService(props.row)"
                      />
                      <img
                        src="/img/actions/unlocked.png"
                        style="width: 32px; height: 32px; xfill: green"
                        v-on:click="activateService(props.row)"
                      />
                      <img
                        src="/img/actions/locked.png"
                        style="width: 32px; height: 32px; xfill: red"
                        v-on:click="suspendService(props.row)"
                      />
                      <img
                        src="/img/actions/delete.png"
                        style="width: 32px; height: 32px; xfill: gray"
                        v-on:click="deleteService(props.row)"
                      />
                    </q-td>
                    <q-td
                      v-for="col in props.cols"
                      :key="col.name"
                      :props="props"
                      >{{ col.value }}</q-td
                    >
                  </q-tr>
                </template>
              </q-table>
            </div>
          </q-tab-panel>
          <q-tab-panel name="invoice">
            <div class="row">
              <div class="col">
                <ValidationProvider
                  name="Indirizzo completo di fatturazione"
                  immediate
                  rules="required|address"
                  v-slot="{ errors }"
                >
                  <q-input
                    label="Indirizzo completo di fatturazione"
                    v-model="selectedContract.invoiceAddress"
                  />
                  <span class="error">{{ errors[0] }}</span>
                </ValidationProvider>
                <ValidationProvider
                  name="Città indirizzo fatturazione"
                  immediate
                  rules="required"
                  v-slot="{ errors }"
                >
                  <q-input
                    label="Città indirizzo fatturazione"
                    v-model="selectedContract.invoiceCity"
                  />
                  <span class="error">{{ errors[0] }}</span>
                </ValidationProvider>
                <ValidationProvider
                  name="CAP indirizzo fatturazione"
                  immediate
                  rules="required"
                  v-slot="{ errors }"
                >
                  <q-input
                    label="CAP indirizzo fatturazione"
                    v-model="selectedContract.invoiceCAP"
                  />
                  <span class="error">{{ errors[0] }}</span>
                </ValidationProvider>
                <ValidationProvider
                  name="Provincia indirizzo fatturazione"
                  immediate
                  rules="required"
                  v-slot="{ errors }"
                >
                  <q-input
                    label="Provincia indirizzo fatturazione"
                    v-model="selectedContract.invoiceProvince"
                  />
                  <span class="error">{{ errors[0] }}</span>
                </ValidationProvider>
              </div>
            </div>
          </q-tab-panel>
          <q-tab-panel name="devices">
            <div v-if="devices">
              <q-table
                title="Dispositivi associati al contratto"
                :data="devices"
                :columns="columnsTableDevices"
                row-key="id"
                virtual-scroll
                :pagination.sync="pagination"
                :rows-per-page-options="[0]"
                @row-click="openDevice"
              >
                <template v-slot:header="props">
                  <q-tr :props="props">
                    <q-th auto-width />
                    <q-th
                      v-for="col in props.cols"
                      :key="col.name"
                      :props="props"
                      >{{ col.label }}</q-th
                    >
                  </q-tr>
                </template>
                <template v-slot:body="props">
                  <q-tr :props="props" v-bind:class="props.row.state">
                    <q-td auto-width>
                      <img
                        src="/img/actions/open.png"
                        style="width: 32px; height: 32px"
                        v-on:click="openDevice(props.row)"
                      />
                      <img
                        src="/img/actions/unlocked.png"
                        style="width: 32px; height: 32px; xfill: green"
                        v-on:click="activateDevice(props.row)"
                      />
                      <img
                        src="/img/actions/locked.png"
                        style="width: 32px; height: 32px; xfill: red"
                        v-on:click="suspendDevice(props.row)"
                      />
                      <img
                        src="/img/actions/delete.png"
                        style="width: 32px; height: 32px; xfill: gray"
                        v-on:click="deleteDevice(props.row)"
                      />
                    </q-td>
                    <q-td
                      v-for="col in props.cols"
                      :key="col.name"
                      :props="props"
                      >{{ col.value }}</q-td
                    >
                  </q-tr>
                </template>
              </q-table>
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </q-form>
    </ValidationObserver>
  </div>
</template>

<script lang="js">
import { mapState } from 'vuex'
import {Store} from '../store'

export default {
  data() {
    return {
        tab: "general",
        serviceCategories: [],
        selectedCategory: {label: "Internet", value: "Internet", icon: ''},
        selectedContract: {},
        selectedService: {label: "", value: ""},
        serviceTemplate: {label: "", value: ""},
        contracts: [],
        devices: [],
        services: [],
        serviceTemplates: [],
        optionsServiceTemplates: [],
        pagination: {rowsPerPage: 0},
        columnsTableServices: [
                  {name: "actions", label: "Azioni"},
                  {name: "state",       label: "Stato",          field: row => row.state, sortable: true},
                  {name: "description", label: "Descrizione",    field: row => row.description, sortable: true},
                  {name: "price",       label: "Prezzo",         field: row => row.price},
                  {name: "vat",         label: "IVA",            field: row => row.vat},
                  ],
        columnsTableDevices: [
                  {name: "actions", label: "Azioni"},
                  {name: "Stato",       label: "state",          field: row => {
                                                                                  if(row.monitored==="monitored")
                                                                                    return row.state+" ("+row.monitored+")";
                                                                                  else return row.state;
                                                                                }
                  },
                  {name: "description", label: "Descrizione",    field: row => row.description,sortable: true},
                  {name: "asset",       label: "Asset",          field: row => {return row.companyasset+"("+row.techasset+")"}, sortable: true},
                  {name: "type",        label: "Tipologia",      field: row => row.type, sortable: true},
                  {name: "model",       label: "Modello",        field: row => row.model, sortable: true},
                  {name: "ipv4",        label: "Ip",             field: row => {if(row.ipv6) return row.ipv6; else return row.ipv4;}, sortable: true},
                  {name: "mac",         label: "Mac",            field: row => row.mac}
                  ],
    }
  },
  methods: {
      getContractData() {
        const store=this.$store;
        this.selectedContract=Object.assign({}, this.$store.state.contract);
        this.getAllServiceCategories();
        this.getServiceTemplates();
        this.getContractServices();
        this.getContractDevices();
      },
      changeCategory: function() {
        const store=this.$store;
        this.$axios.post('/adminarea/serviceTemplate/getByCategory', {category: this.selectedCategory})
          .then(response => {
                if (response.data.status === "OK") {
                    this.serviceTemplates = response.data.serviceTemplates;
                    this.populateSelectServiceTemplates();
                }
            })
            .catch(error => {
                console.log(error);
            });
      },
      getAllServiceCategories: function() {
          this.$axios.post('/adminarea/serviceTemplate/getAllServiceCategories', {})
              .then(response => {
                    if (response.data.status === "OK") {
                        response.data.serviceCategories.forEach(element => {
                          this.serviceCategories.push({label: element.description, value: element.value, icon: ''})
                        });
                        this.makeToast(response.data.msg);
                    }
                })
                .catch(error => {
                    console.log(error);
                });
      },
      getServiceTemplates() {
        const store=this.$store;
        this.$axios.post('/adminarea/serviceTemplate/getall', {})
          .then(response => {
                if (response.data.status === "OK") {
                    this.serviceTemplates = response.data.serviceTemplates;
                    this.populateSelectServiceTemplates();
                }
            })
            .catch(error => {
                console.log(error);
            });
      },
      getContractServices() {
        const store=this.$store;
        const parent=this.$parent;
        this.$axios.post('/adminarea/contractService/get_all_by_contract', {idContract: this.selectedContract.id})
          .then(response => {
                if (response.data.status === "OK") {
                    this.services = response.data.services;
                }
            })
            .catch(error => {
                console.log(error);
            });
      },
      getContractDevices() {
        const store=this.$store;
        const parent=this.$parent;
        this.$axios.post('/adminarea/deviceCustomer/get_all_by_contract', {idContract: this.selectedContract.id})
          .then(response => {
                if (response.data.status === "OK") {
                    this.devices = response.data.devicesCustomer;
                }
            })
            .catch(error => {
                console.log(error);
            });
      },
      addService() {
        var idServ=this.serviceTemplate.value.id;
        if(idServ && this.selectedContract.id)
        this.$axios.post('/adminarea/contractService/insert', {idServiceTemplate: idServ, idContract: this.selectedContract.id})
          .then(response => {
                if (response.data.status === "OK") {
                    this.selectedService = response.data.service;
                    this.$store.commit("changeService", this.selectedService);
                    this.makeToast(response.data.msg);
                    this.services.push(this.selectedService);
                }
            })
            .catch(error => {
                console.log(error);
            });
      },
      openService(serv) {
        this.$store.commit("changeService",serv);
        this.$router.push("/ServiceContract");
      },
      activateService(serv) {
        serv.state="active";
        this.$axios.post('/adminarea/contractService/update', {service: serv})
          .then(response => {
                if (response.data.status === "OK") {
                    this.makeToast("Servizio attivo");
                }
            })
            .catch(error => {
                console.log(error);
            });
      },
      suspendService(serv) {
        serv.state="suspended";
        this.$axios.post('/adminarea/contractService/update', {service: serv})
          .then(response => {
                if (response.data.status === "OK") {
                    this.makeToast("Servizio sospeso");
                }
            })
            .catch(error => {
                console.log(error);
            });
      },
      deleteService(serv) {
        const isConfirmed = confirm("Confermi la cancellazione?");
        if(isConfirmed) {
        this.$axios.post('adminarea/contractService/delete', {idContractService: serv.id})
          .then(response => {
                if (response.data.status === "OK") {
                    this.makeToast("Servizio eliminato");
                    this.getContractServices();
                }
            })
            .catch(error => {
                console.log(error);
            });
        }
      },
      openDevice(dev) {
        dev.state="active";
        this.selectedDevice=dev;
        this.$store.commit("changeDeviceCustomer", this.selectedDevice);
        this.$router.push("/DeviceCustomer");
      },
      activateDevice(dev) {
        dev.state="active";
        //Enable device in database
        this.$axios.post('/adminarea/deviceCustomer/update', {device: dev})
          .then(response => {
                if (response.data.status === "OK") {
                    this.makeToast("Dispositivo attivo");
                    //Enable device in firewall
                    this.$axios.post('/adminarea/deviceCustomer/enable', {device: dev})
                      .then(response => {
                            if (response.data.status === "OK") {
                                this.makeToast("Dispositivo abilitato nel firewall");
                            }
                            else this.makeToast(response.data.msg);
                        })
                        .catch(error => {
                            console.log(error);
                            this.makeToast("Errore di comunicazione con il firewall");
                        });
                }
            })
            .catch(error => {
                console.log(error);
            });
      },
      suspendDevice(dev) {
        dev.state="suspended";
        //Disable device in database
        this.$axios.post('/adminarea/deviceCustomer/update', {device: dev})
          .then(response => {
                if (response.data.status === "OK") {
                    this.makeToast("Dispositivo sospeso");
                    //Disable device on firewall
                    this.$axios.post('/adminarea/deviceCustomer/disable', {device: dev})
                      .then(response => {
                            if (response.data.status === "OK") {
                                this.makeToast("Dispositivo disabilitato nel firewall");
                            }
                            else this.makeToast(response.data.msg);
                        })
                        .catch(error => {
                            console.log(error);
                            this.makeToast("Errore di comunicazione con il firewall");
                        });
                }
            })
            .catch(error => {
                console.log(error);
            });
      },
      deleteDevice(dev) {
        const isConfirmed = confirm("Confermi la cancellazione?");
        if(isConfirmed) {console.log("Delete confirmed"); return "cancellato";}
        return "";
      },
      async newContract() {
        this.services={};
        this.devices={};
        const valid = true;
        if(valid) {
        this.selectedContract.customerId=this.customer.id;
        this.$axios.post('/adminarea/contract/insert', {contract: this.selectedContract})
          .then(response => {
                if (response.data.status === "OK") {
                  alert("Contratto inserito correttamente");
                  this.selectedContract = response.data.contract;
                  this.$store.commit("changeContract", this.selectedContract);
                  this.makeToast(response.data.msg);
                  this.getContractData();
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
      async saveContract() {
        const valid = true;
        if(valid) {
        this.$axios.post('/adminarea/contract/update', {contract: this.selectedContract})
          .then(response => {
                if (response.data.status === "OK") {
                    this.selectedContract = response.data.contract;
                    this.$store.commit("changeContract", this.selectedContract);
                    this.makeToast(response.data.msg);
                    this.getContractData();
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
      deleteContract: function() {
        const isConfirmed = confirm("Confermi la cancellazione?");
        if(isConfirmed) {
        this.$axios.post('adminarea/contract/delete', {contract: this.selectedContract})
          .then(response => {
                if (response.data.status === "OK") {
                    this.selectedContract = response.data.contract;
                    this.$store.commit("changeContract", this.selectedContract);
                    this.makeToast(response.data.msg);
                    this.getContractData();
                }
            })
            .catch(error => {
                console.log(error);
            });
        }
      },
      populateSelectServiceTemplates() {
        this.optionsServiceTemplates=[];
        this.serviceTemplates.forEach((element,index,array) => {
          this.optionsServiceTemplates.push({
            label: element.category+"--"+element.description+"--"+element.price+"€",
            value: element,
            description: "Modello di servizio predefinito"
          });
          if(index===array.length-1) {
            this.selectedService=this.serviceTemplates[0];
          }
        });
      },
      exit: function() {
        this.$router.push("/Customer");
      },
      makeToast(string) {
        this.$q.notify({color: 'green-4', textColor: 'white', icon: 'info', message: string});
      }
  },
  computed: mapState({
    user: 'user',
    customer: 'customer',
    customerDescription() {
      const customer=this.customer;
      if(customer.vatcode && customer.vatcode!=="")
        return customer.company;
      else
        return customer.lastname+" "+customer.firstname;
    }
    }),
  mounted () {
    this.getContractData();
  },
  created() {

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
.active {
  background-color: rgb(168, 243, 168);
}

.suspended {
  background-color: rgb(177, 171, 171);
}
</style>
