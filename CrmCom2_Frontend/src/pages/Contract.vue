<template>
  <div id="contracts">
    <p>
      Gestione <strong>{{ customerDescription }}</strong>
      <br />
      <span v-if="contract">Contratto: {{ contract.description }}</span>
      <br />
      <span v-if="selectedService">Servizio: {{ selectedService.description }}</span>
      <br />
      <span v-if="selectedDevice">Dispositivo: {{ selectedDevice.description }} -- {{ selectedDevice.ipv4 }} -- {{ selectedDevice.ipv6 }}</span>
      <br />
    </p>
    <img
      src="./img/actions/new.png"
      @click="newContract"
      style="width: 48px; height: 48px"
    />
    <img
      src="./img/actions/save.png"
      @click="saveContract"
      style="width: 48px; height: 48px"
    />
    <img
      src="./img/actions/delete.png"
      @click="deleteContract"
      style="width: 48px; height: 48px"
    />
    <img
      src="./img/actions/exit.png"
      @click="exit"
      style="width: 48px; height: 48px"
    />
    <img
      src="./img/actions/print.png"
      @click="printContract"
      style="width: 48px; height: 48px"
    />

    <!--Tab division of contract sections-->
    <ValidationObserver ref="FormDeviceCustomer">
      <q-form ref="contractForm" class="q-gutter-md">
        <q-tabs v-model="tab" class="text-teal">
          <q-tab name="general" icon="article" label="Generale" />
          <q-tab name="services" icon="euro_symbol" label="Servizi" />
          <q-tab name="documents" icon="card_membership" label="Documenti" />
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
                    :change="changeAddress()"
                    v-model="selectedContract.address"
                  />
                  <span class="error">{{ errors[0] }}</span>
                </ValidationProvider>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <ValidationProvider name="Data inizio" immediate rules="required" v-slot="{ errors }">   
                  <q-input filled v-model="selectedContract.startdate" mask="####-##-##">
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                          <q-date v-model="selectedContract.startdate" :locale="calendarLocale" mask="YYYY-MM-DD" @input="calculateDays">
                            <div class="row items-center justify-end">
                              <q-btn v-close-popup label="Close" color="primary" flat />
                            </div>
                          </q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                  <span class="error">{{ errors[0] }}</span>
                </ValidationProvider>
                <ValidationProvider name="Data fine" immediate rules="required" v-slot="{ errors }">   
                  <q-input filled v-model="selectedContract.enddate" mask="####-##-##">
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                          <q-date v-model="selectedContract.enddate" :locale="calendarLocale" mask="YYYY-MM-DD" @input="calculateDays">
                            <div class="row items-center justify-end">
                              <q-btn v-close-popup label="Close" color="primary" flat />
                            </div>
                          </q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                  <span class="error">{{ errors[0] }}</span>
                </ValidationProvider>                                
                <ValidationProvider
                  name="Durata in giorni"
                  immediate
                  rules="integer"
                  v-slot="{ errors }"
                  >
                  <q-input
                    label="Durata in giorni"
                    v-model="selectedContract.duration"
                    disable
                  />
                  <span class="error">{{ errors[0] }}</span>
                </ValidationProvider>                                
              </div>
            </div>
            <div class="row">  
              <div class="col">                
                <ValidationProvider
                  name="Rinnovo automatico"
                  immediate
                  rules="required"
                  v-slot="{ errors }"
                  >
                  <q-checkbox
                    label="Rinnovo Automatico"
                    v-model="selectedContract.automaticrenew"
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
                    v-model="selectedContract.businessflag"
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
                  map-options
                  v-model="selectedCategory"
                  option-label="description"
                />
                <q-select
                  filled
                  label="Modelli di servizio"
                  v-model="selectedServiceTemplate"
                  :options="serviceTemplates"
                  option-label="description"
                  emit-value
                  map-options
                />
                <div class="col">
                  <img
                    src="./img/actions/new.png"
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
                  <q-tr :props="props" v-bind:class="props.row.state"  @click.native="selectService(props.row)">
                    <q-td auto-width>
                      <img
                        src="./img/actions/open.png"
                        style="width: 32px; height: 32px"
                        v-on:click="openService(props.row)"
                      />
                      <img
                        src="./img/actions/unlocked.png"
                        style="width: 32px; height: 32px; xfill: green"
                        v-on:click="activateService(props.row)"
                      />
                      <img
                        src="./img/actions/locked.png"
                        style="width: 32px; height: 32px; xfill: red"
                        v-on:click="suspendService(props.row)"
                      />
                      <img
                        src="./img/actions/delete.png"
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

          <q-tab-panel name="documents">
            <!-- Identity card -->            
          <div class="row">
            <div class="col">
              <ValidationProvider
                name="Numero documento"
                immediate
                rules="required"
                v-slot="{ errors }"
              >
                <q-input
                  label="Numero documento"
                  v-model="selectedCustomer.numci"                      
                />
                <span class="error">{{ errors[0] }}</span>
              </ValidationProvider>
            </div>
          </div>

          <div class="row">
            <div class="col">
              <q-btn                    
                color="primary"
                style="width: 300px"
                label="Carta identità retro (camera)"
                @click="captureCiFront"
              >
                <img :src="imageCiFront" style="width: 100px" />
              </q-btn>
              <q-uploader                    
                auto-upload
                :factory="uploadCiFront"
                accept=".jpg"
                max-file-size="2048000"
                style="max-width: 300px"
                label="Acquisizione da file (solo jpg)"
              />
            </div>
          </div>

          <div class="row">
            <div class="col">
              <q-btn                    
                color="primary"
                style="width: 300px"
                label="Carta identità retro (camera)"
                @click="captureCiBack"
              >
                <img :src="imageCiBack" style="width: 100px" />
              </q-btn>
              <q-uploader                   
                auto-upload
                :factory="uploadCiBack"
                accept=".jpg"
                max-file-size="2048000"
                style="max-width: 300px"
                label="Acquisizione da file (solo jpg)"
              />
            </div>
          </div>
          

          <!--Identity fiscalcode/health card -->
          <div class="row">
            <div class="col">
              <ValidationProvider
                name="Codice fiscale"
                immediate
                rules="required|codfis"
                v-slot="{ errors }"
              >
                <q-input
                  label="Codice fiscale"
                  v-model="selectedCustomer.codfis"
                  type="codfis"
                />
                <span class="error">{{ errors[0] }}</span>
              </ValidationProvider>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <q-btn                    
                color="primary"
                style="width: 300px"
                label="Codice fiscale fronte (camera)"
                @click="captureCfFront"
              >
                <img :src="imageCfFront" style="width: 100px" />
              </q-btn>
              <q-uploader                    
                auto-upload
                :factory="uploadCfFront"
                max-file-size="2048000"
                accept=".jpg"
                style="max-width: 300px"
                label="Acquisizione da file (solo jpg)"
              />
            </div>
          </div>

          <div class="row" style="with: 100%">
            <div class="col">
              <q-btn                    
                color="primary"
                style="width: 300px"
                label="Codice fiscale retro (camera)"
                @click="captureCfBack"
              >
                <img :src="imageCfBack" style="width: 100px" />
              </q-btn>
              <q-uploader                    
                auto-upload
                :factory="uploadCfBack"
                max-file-size="2048000"
                accept=".jpg"
                style="max-width: 300px"
                label="Acquisizione da file (solo jpg)"
              />
            </div>
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

              <q-btn @click="addDevice">Aggiungi dispositivo</q-btn>
              
              <q-table
                title="Dispositivi associati al contratto"
                :data="devices"
                :columns="columnsTableDevices"
                row-key="id"                
                virtual-scroll
                :pagination.sync="pagination"
                :rows-per-page-options="[0]"
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
                  <q-tr :props="props" v-bind:class="props.row.state" @click.native="selectDevice(props.row)">
                    <q-td auto-width>
                      <img
                        src="./img/actions/open.png"
                        style="width: 32px; height: 32px"
                        v-on:click="openDevice(props.row)"
                      />
                      <img
                        src="./img/actions/unlocked.png"
                        style="width: 32px; height: 32px; xfill: green"
                        v-on:click="activateDevice(props.row)"
                      />
                      <img
                        src="./img/actions/locked.png"
                        style="width: 32px; height: 32px; xfill: red"
                        v-on:click="suspendDevice(props.row)"
                      />
                      <img
                        src="./img/actions/delete.png"
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
import { Plugins, CameraResultType } from '@capacitor/core'
const { Camera } = Plugins

export default {
  data() {
    return {
        tab: "general",
        contractDocumentUrl: "",
        serviceCategories: [],
        selectedCategory: {description: "Vuoto", id: "0"},        
        selectedCustomer: {},
        selectedContract: {},
        selectedService: {},
        selectedDevice: {},        
        selectedServiceTemplate: {description: "Vuoto", id: "0"},
        contracts: [],
        devices: [],
        services: [],
        serviceTemplates: [],
        imageCfFront: '',
        imageCfBack: '',
        imageCiFront: '',
        imageCiBack: '',
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
                  {name: "ipv4",        label: "Ip",             field: row => {if(row.ipv6) return row.ipv4+" --- "+row.ipv6; else return row.ipv4;}, sortable: true},
                  {name: "mac",         label: "Mac",            field: row => row.mac}
                  ],
        //Date picker variables
        calendarLocale: {
          /* starting with Sunday */
          days: 'Domenica_Linedì_Martedì_Mercoledì_Giovedì_Venerdì_Sabato'.split('_'),
          daysShort: 'Dom_Lun_Mar_Mer_Gio_Ven_Sab'.split('_'),
          months: 'Gennaio_Febbraio_Marzo_Aprile_Maggio_Giugno_Luglio_Agosto_Settembre_Ottobre_Novembre_Dicembre'.split('_'),
          monthsShort: 'Gen_Feb_Mar_Apr_Mag_Giu_Lug_Ago_Set_Ott_Nov_Dic'.split('_'),
          firstDayOfWeek: 1
        }
    }
  },
  methods: {          
      calculateDays() {
        if(!this.selectedContract.startdate) return;
        if(!this.selectedContract.enddate) return;
        var start = this.selectedContract.startdate.split("-");
        var end = this.selectedContract.enddate.split("-");
        var begin = new Date(start[0], start[1] - 1, start[2]);
        var end = new Date(end[0], end[1] - 1, end[2]);
        var duration=end.getTime()-begin.getTime();                
        this.selectedContract.duration=duration/86400000;
      },
      initContractData() {
        this.selectedCustomer=Object.assign({}, this.$store.state.customer);
        this.services=[];
        this.devices=[];
        this.selectedContract.description="Internet Home";
        this.selectedContract.duration=365;
        this.selectedContract.automaticrenew=true;
        this.selectedContract.businessflag=true;
        this.selectedContract.address=this.selectedCustomer.address;
        this.selectedContract.invoiceAddress=this.selectedCustomer.address;
        this.selectedContract.invoiceCity=this.selectedCustomer.city;
        this.selectedContract.invoiceCAP=this.selectedCustomer.postalcode;
        this.selectedContract.invoiceProvince="LE";
        if(this.selectedCustomer.vatcode) {
          this.selectedContract.description="Internet Businness";
          this.selectedContract.address=this.selectedCustomer.companyaddress;
          this.selectedContract.invoiceAddress=this.selectedCustomer.companyaddress;
          this.selectedContract.invoiceCity=this.selectedCustomer.city;
          this.selectedContract.invoiceCAP=this.selectedCustomer.postalcode;          
        }        
      },
      getContractData() {
        const store=this.$store;
        this.selectedContract=Object.assign({}, this.$store.state.contract);
        this.selectedCustomer=Object.assign({}, this.$store.state.customer);
        this.getAllServiceCategories();
        this.getServiceTemplates();
        this.getContractServices();
        this.getContractDevices();
        
        if(!this.selectedContract.id) {
          //Copy customer Address in Contract Data
          this.initContractData();
        }
        console.log(this.selectedContract);
      },
      printContract: function() {
        this.$store.commit("changeCustomer", this.selectedCustomer);
        this.$store.commit("changeContract", this.selectedContract);
        this.$axios.post('/adminarea/registration/generate_final_document', {
          customer: this.selectedCustomer,
          contract: this.selectedContract,
          services: this.services
        })
        .then(response => {
            if (response.data.status === "OK") {
              this.contractDocumentUrl=response.data.results.urlFinalDocument;
              console.log(this.contractDocumentUrl);
              window.open(this.contractDocumentUrl);
              this.makeToast(response.data.msg);
            }
          })
          .catch(error => {
            console.log(error);
            this.makeToast("Si è verificato un errore");
          });
      },
      changeCategory: function() {
        const store=this.$store;
        console.log(this.selectedCategory);
        this.$axios.post('/adminarea/serviceTemplate/getByCategory', {category: this.selectedCategory})
          .then(response => {
                if (response.data.status === "OK") {
                    this.serviceTemplates = response.data.serviceTemplates;
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
                        this.serviceCategories=response.data.serviceCategories;
                        /*response.data.serviceCategories.forEach(element => {
                          this.serviceCategories.push({label: element.description, value: element, icon: ''})
                        });*/
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
        if(!this.selectedContract.id) this.makeToastError("Salva il contratto prima di aggiungere i servizi.");
        var idServ=this.selectedServiceTemplate.id;
        if(idServ && this.selectedContract.id)
        this.$axios.post('/adminarea/contractService/insert', {idServiceTemplate: idServ, idContract: this.selectedContract.id})
          .then(response => {
                if (response.data.status === "OK") {
                    this.selectedService = response.data.service;
                    this.$store.commit("changeService", this.selectedService);
                    this.makeToast(response.data.msg);
                    this.services.push(this.selectedService);
                    this.getContractServices();
                }
            })
            .catch(error => {
                console.log(error);
            });
      },
      openService(serv) {
        console.log(serv);
        this.selectedService=serv;
        this.$store.commit("changeService",serv);
        this.$router.push("/ServiceContract");
      },
      selectService(serv) {
        console.log(serv);
        this.selectedService=serv;
        this.$store.commit("changeService",serv);        
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
      selectDevice(dev) {
        this.selectedDevice=dev;
        this.$store.commit("changeDeviceCustomer", this.selectedDevice);        
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
      addDevice() {        
        if(!this.selectedService || !this.selectedService.id || this.selectedService.id===0 || this.selectedService.id==="0") {
          this.makeToastError("Servizio non selezionato, torna alla schermata servizi del contratto.");
          this.makeToastError("Associare il dispositivo ad un servizio");
        }
        else
        {
          this.$store.commit("changeContract", this.selectedContract);
          this.$store.commit("changeDeviceCustomer", {});
          this.$router.push("/DeviceCustomer");
        }
      },  
      deleteDevice(dev) {
        const isConfirmed = confirm("Confermi la cancellazione?");
        if(isConfirmed)                   
        this.$axios.post('/adminarea/deviceCustomer/delete', {device: dev})
        .then(response => {
              if (response.data.status === "OK") {
                  this.selectedDevice = {};
                  this.$store.commit("changeDeviceCustomer", {});
                  this.makeToast(response.data.msg);
                  this.getContractDevices();
              }
        })
        .catch(error => {
            console.log(error);
        });            
      },      
      async newContract() {        
        this.initContractData();
        this.selectedContract.id=null;
        this.makeToast("Nuovo contratto, compila, salva ed aggiungi i servizi.");      
      },
      async saveContract() {
        //Insert contract
        if(!this.selectedContract.id || this.selectedContract.id===null) {
          this.selectedContract.customerId=this.selectedCustomer.id;
          this.$axios.post('/adminarea/contract/insert', {contract: this.selectedContract})
            .then(response => {
                  if (response.data.status === "OK") {
                    this.$store.commit("changeContract", response.data.contract);
                    this.selectedContract = {};                    
                    //this.selectedContract=Object.assign({}, this.$store.state.contract);
                    this.makeToast(response.data.msg);
                    this.getContractData();
                    this.makeToast("New contract.");
                  }
                  else {
                    this.makeToastError(response.data.msg);
                  }

            })
            .catch(error => {
                console.log(error);
                this.makeToast("Error in contract insert.");
            });
        }
        
        //Update contract        
        else if(this.selectedContract.id && this.selectedContract.id!==0 && this.selectedContract.id!=="0"){
          this.selectedContract.customerId=this.selectedCustomer.id;                 
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
                  this.makeToast("Error on save contract.");
                  console.log(error);
              });
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
                this.makeToast("Error on delete contract.");
                console.log(error);
            });
        }
      },
      captureCiFront () {
        Camera.getPhoto({width: 600, height: 350, quality: 100, allowEditing: true, resultType: CameraResultType.base64}).then(image => {
          this.imageCiFront = "data:image/png;base64, "+image.base64String;
          this.uploadIdentityDocumentImage("CiFront-"+this.uuid, image.base64String);
        })
        .catch(err => console.log("No image: " +err));
      },
      captureCiBack () {
        Camera.getPhoto({width: 600, height: 350, quality: 100, allowEditing: true, resultType: CameraResultType.base64}).then(image => {
          this.imageCiBack = "data:image/png;base64, "+image.base64String;
          this.uploadIdentityDocumentImage("CiBack-"+this.uuid, image.base64String);
        })
        .catch(err => console.log("No image: " +err));
      },
      captureCfFront () {
        Camera.getPhoto({width: 600, height: 350, quality: 100, allowEditing: true, resultType: CameraResultType.base64}).then(image => {
          this.imageCfFront = "data:image/png;base64, "+image.base64String
          this.uploadIdentityDocumentImage("CfFront-"+this.uuid, image.base64String);
        })
        .catch(err => console.log("No image: " +err));
      },
      captureCfBack () {
        Camera.getPhoto({width: 600, height: 350, quality: 100, allowEditing: true, resultType: CameraResultType.base64}).then(image => {
          this.imageCfBack = "data:image/png;base64, "+image.base64String;
          this.uploadIdentityDocumentImage("CfBack-"+this.uuid, image.base64String);
        })
        .catch(err => console.log("No image: " +err));
      },
      uploadCiFront(file) {
        let fileName="CiFront-"+this.selectedContract.uid+".jpg";
        this.uploadIdentityDocumentFile(fileName,file);
      },
      uploadCiBack(file) {
        let fileName="CiBack-"+this.selectedContract.uuid+".jpg";
        this.uploadIdentityDocumentFile(fileName,file);
      },
      uploadCfFront(file) {
        let fileName="CfFront-"+this.selectedContract.uuid+".jpg";
        this.uploadIdentityDocumentFile(fileName,file);
      },
      uploadCfBack(file) {
        let fileName="CfBack-"+this.selectedContract.uuid+".jpg";
        this.uploadIdentityDocumentFile(fileName,file);
      },
      uploadIdentityDocumentImage(imageName, imageData) {
        let data = new FormData();
        data.append('imageName', imageName);
        data.append('file', imageData);
        this.$axios.post('/adminarea/upload/identity_document/image', data, {header : {'Content-Type' : 'image/png'}})
          .then(response => {
              if (response.data.status === "OK") {
                  this.makeToast(response.data.msg);
              }
            })
            .catch(error => {
                console.log(error);
                this.makeToast("Si è verificato un errore");
            });
      },
      uploadIdentityDocumentFile (fileName, file) {
        let data = new FormData();
        data.append('fileName', fileName);
        data.append('file', file[0]);
        this.$axios.post('/adminarea/upload/identity_document/file', data, {headers: {'Content-Type': 'multipart/form-data'}})
        .then(response => {
            if (response.data.status === "OK") {
                this.makeToast(response.data.msg);
            }
          })
          .catch(error => {
              console.log(error);
              this.makeToast("Si è verificato un errore");
          });
      },
      exit: function() {
        this.$router.push("/Customer");
      },
      makeToast(string) {
        this.$q.notify({color: 'green-4', textColor: 'white', icon: 'info', message: string});
      },
      makeToastError(string) {
        this.$q.notify({color: 'red-4', textColor: 'white', icon: 'error', message: string});
      },
      changeAddress() {
        this.selectedContract.invoiceAddress=this.selectedContract.address;
      }
  },
  computed: mapState({
    user: 'user',
    customer: 'customer',
    contract: 'contract',
    service: 'service',
    device: 'device',
    customerDescription() {
      const customer=this.customer;
      if(customer.vatcode && customer.vatcode!=="")
        return customer.company;
      else
        return customer.lastname+" "+customer.firstname;
    }
    }),
  mounted () {
    this.$store.commit("changeContract", {});
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
