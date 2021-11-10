<template>
  <div id="device">
    <h6>
      Gestione dispositivi
    </h6>
    <p>
      <strong>Cliente: {{ customerDescription }}</strong>
      <br />
      <strong>Contratto: {{ selectedContract.id }}</strong>
      <br />
      <strong>Ip disponibili: <div v-bind:key="ip" v-for="ip in freeIps"> ---> {{ ip }} </div> </strong>
    </p>

    <img
      src="./img/actions/new.png"
      @click="newDevice"
      style="width: 48px; height: 48px;"
    />
    <img
      src="./img/actions/save.png"
      @click="saveDevice"
      style="width: 48px; height: 48px;"
    />
    <img
      src="./img/actions/delete.png"
      @click="deleteDevice"
      style="width: 48px; height: 48px;"
    />
    <img
      src="./img/actions/eye.svg"
      @click="monitorDevice"
      style="width: 48px; height: 48px;"
      v-bind:class="monitorClassBackground"
    />
    <img
      src="./img/actions/exit.png"
      @click="exit"
      style="width: 48px; height: 48px;"
    />

    <ValidationObserver ref="FormDeviceCustomer">
      <q-form ref="deviceForm" class="q-gutter-md">
        <div class="row">
          <div class="col">
            <ValidationProvider
              name="Tecnologia"
              immediate
              rules="required"
              v-slot="{ errors }"
            >
              <q-select
                filled
                label="Asset"
                @input="changeAsset"
                :options="selectAssetOptions"
                v-model="selectedAsset"
                map-options
                option-label="label"
                option-value="value"
              />
              <span class="error">{{ errors[0] }}</span>
            </ValidationProvider>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <ValidationProvider
              name="Descrizione"
              immediate
              rules="required"
              v-slot="{ errors }"
            >
              <q-input
                label="Descrizione"
                v-model="selectedDevice.description"
              />
              <span class="error">{{ errors[0] }}</span>
            </ValidationProvider>
          </div>
          <div class="col">
            <ValidationProvider
              name="Tipo"
              immediate
              rules="required"
              v-slot="{ errors }"
            >
              <q-input label="Tipo" v-model="selectedDevice.type" />
              <span class="error">{{ errors[0] }}</span>
            </ValidationProvider>
          </div>
          <div class="col"></div>
          <div class="col">
            <ValidationProvider
              name="Produttore"
              immediate
              rules="required|alpha_spaces"
              v-slot="{ errors }"
            >
              <q-input label="Produttore" v-model="selectedDevice.vendor" />
              <span class="error">{{ errors[0] }}</span>
            </ValidationProvider>
          </div>
          <div class="col">
            <ValidationProvider
              name="Modello"
              immediate
              rules="required|alpha"
              v-slot="{ errors }"
            >
              <q-input label="Modello" v-model="selectedDevice.model" />
              <span class="error">{{ errors[0] }}</span>
            </ValidationProvider>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <ValidationProvider
              name="Indirizzo MAC"
              immediate
              rules="required|mac"
              v-slot="{ errors }"
            >
              <q-input label="MAC" v-model="selectedDevice.mac" />
              <span class="error">{{ errors[0] }}</span>
            </ValidationProvider>
          </div>
          <div class="col">
            <ValidationProvider
              name="Indirizzo IP"
              immediate
              rules="required|ipv4"
              v-slot="{ errors }"
            >
              <q-input label="ipv4" v-model="selectedDevice.ipv4" />
              <span class="error">{{ errors[0] }}</span>
            </ValidationProvider>
          </div>
          <div class="col">
            <ValidationProvider
              name="Tecnologia"
              immediate
              rules="ipv6"
              v-slot="{ errors }"
            >
              <q-input label="ipv6" v-model="selectedDevice.ipv6" />
              <span class="error">{{ errors[0] }}</span>
            </ValidationProvider>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <q-input
              label="Note sul dispositivo"
              v-model="selectedDevice.note"
              type="textarea"
              rows="5"
              cols="20"
            />
          </div>
        </div>
      </q-form>
    </ValidationObserver>

    <hr class="separator" />
    <div>
      <div id="deviceParametersPrimitives" v-if="selectedDevice.objData">
        <h6>Parametri generali</h6>
        <div
          class="row"
          v-for="(primitive, primitiveName) in objDataPrimitives"
          v-bind:key="primitive"
        >
          <div class="col">
            <q-input
              :label="primitiveName"
              v-bind:id="primitiveName"
              v-model="selectedDevice.objData[primitiveName]"
            />
          </div>
        </div>
      </div>

      <hr class="separator" />
      <div id="deviceParametersSections" v-if="selectedDevice.objData">
        <h6>Sezioni specifiche</h6>
        <div
          v-for="(section, sectionName, indexSection) in objDataSection"
          v-bind:key="indexSection"
        >
          <h6>
            <p align="left">{{ sectionName }}</p>
          </h6>
          <div
            v-for="(devProperty, devPropertyName, indexProperty) in section"
            v-bind:key="indexProperty"
          >
            <div class="row">
              <div class="col">
                <q-input
                  :label="devPropertyName"
                  v-bind:id="devPropertyName"
                  v-model="selectedDevice.objData[sectionName][devPropertyName]"
                />
              </div>
            </div>
          </div>
          <hr class="separator" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="js">
import { mapState } from 'vuex'
import {Store} from '../store'
import { ValidationProvider, ValidationObserver, extend, localize } from 'vee-validate';
import validator from "./validator"
import companyassetsJson from '../config/companyassets.json'

export default {
  data() {
    return {
      selectedCustomer: {},
      selectedContract: {},
      selectedService: {},
      selectedAsset: {},
      contractDescription: "",
      selectAssetOptions: [],
      companyassets: companyassetsJson,
      companyasset: {},
      selectedDevice: {},
      devices: {},
      freeIps: [],
      objDataSection: {},
      objDataPrimitives: {},
    }
  },
  components: {
    ValidationProvider,
    ValidationObserver
  },
  methods: {
    getFreeIps() {
      console.log("Retrieve free ips");
      this.$axios.post('/adminarea/deviceCustomer/getFreeIps')
        .then((response) => {
          console.log(response);
          this.freeIps=response.data.freeIps;
        });
    },
    populateSelectAsset() {
      this.companyassets.forEach(element => {
        this.selectAssetOptions.push({label: element.company+" -- "+element.techasset, value: element});
      });
    },
    changeAsset() {
      this.objDataSection=[];
      this.objDataPrimitives=[];
      this.selectedDevice.objData={};
      this.companyasset=this.selectedAsset.value;
      console.log("Company asset");
      console.log(this.companyasset);
      this.selectedDevice.type="Router";
      this.selectedDevice.vendor=this.companyasset.vendor;
      this.selectedDevice.model=this.companyasset.model;
      this.selectedDevice.mac=this.companyasset.mac;
      this.selectedDevice.ipv4=this.companyasset.ipv4;
      this.selectedDevice.ipv6=this.companyasset.ipv6;
      var res=Object.assign(this.selectedDevice.objData, this.companyasset.propDeviceStructure)
      this.selectedService=this.$store.state.service;
      console.log("Try to copy bandwith from service");
      console.log(this.selectedService);
      if(this.selectedService.objData && this.selectedService.objData.parameters) {
        if(this.selectedDevice.objData && this.selectedDevice.objData.bandwith) {
          console.log("Copy values in device parameters");
          this.selectedDevice.objData.bandwith.upload_max=this.selectedService.objData.parameters.bandwidth_upload;
          this.selectedDevice.objData.bandwith.download_max=this.selectedService.objData.parameters.bandwidth_download;
          this.selectedDevice.objData.bandwith.upload_min=1000;
          this.selectedDevice.objData.bandwith.download_min=1000;
        }  
      }
      console.log(this.selectedDevice);
      this.$store.commit("changeDeviceCustomer", this.selectedDevice);
      this.parseDeviceObjData();
    },
    parseDeviceObjData: function() {
      this.objDataSection={};
      this.objDataPrimitives={};
      if(this.selectedDevice && this.selectedDevice.objData)
      for (const sectionName in this.selectedDevice.objData) {
        if(typeof(this.selectedDevice.objData[sectionName])==="object") {
          console.log("Found object: "+sectionName);
          this.objDataSection[sectionName]=this.selectedDevice.objData[sectionName];
        }
        else {
          console.log("Found simple data: "+sectionName);
          this.objDataPrimitives[sectionName]=this.selectedDevice.objData[sectionName];
        }
      }
    },
    getDeviceData: function() {
      this.selectedDevice= Object.assign({}, this.$store.state.deviceCustomer);
      if(this.selectedDevice===null) this.selectedDevice={objData: {}};
      if(this.selectedDevice.objData===null) this.selectedDevice={objData: {}};
      this.$store.commit("changeDeviceCustomer", this.selectedDevice);

      //init correct companyasset in selection
      this.parseDeviceObjData();
      //compute selectedAsset
      const companyasset=this.selectedDevice.companyasset;
      const techasset=this.selectedDevice.techasset;

      console.log(companyasset);
      console.log(techasset);
      console.log(this.selectAssetOptions);
      this.selectedAsset=this.selectAssetOptions.find((asset) => {
        return ((companyasset===asset.value.company) &&
        (techasset===asset.value.techasset));
      })
      console.log(this.selectedAsset);
    },
    newDevice() {
      this.selectedDevice={};
      this.$store.commit("changeDeviceCustomer", this.selectedDevice);      
      this.makeToast("Configura un nuovo dispositivo");
    },
    saveDevice: function() {
      this.companyasset=this.selectedAsset.value;
      if(this.companyasset) {
        this.selectedDevice.companyasset=this.companyasset.company;
        this.selectedDevice.techasset=this.companyasset.techasset;        
      }
      this.selectedDevice.state="active";
      this.selectedDevice.contractId=this.contract.id;
      console.log(this.companyasset);
      this.$axios.post('/adminarea/deviceCustomer/update', {device: this.selectedDevice})
        .then((response) => {
              if (response.data.status === "OK") {
                  this.selectedDevice = response.data.deviceCustomer;
                  this.$store.commit("changeDeviceCustomer", this.selectedDevice);
                  this.makeToast(response.data.msg);
              }
          })
          .catch(error => {
              console.log(error);
          });
    },
    deleteDevice: function() {
      const isConfirmed = confirm("Confermi la cancellazione?");
      if(isConfirmed) {
      this.$axios.post('/adminarea/deviceCustomer/delete', {device: this.selectedDevice})
        .then(response => {
              if (response.data.status === "OK") {
                  this.selectedDevice = response.data.deviceCustomer;
                  this.$store.commit("changeDeviceCustomer", this.selectedDevice);
                  this.makeToast(response.data.msg);
                  this.exit();
              }
          })
          .catch(error => {
              console.log(error);
          });
      }
    },
    exit: function() {
      this.$router.push("/Contract");
    },
    monitorDevice() {
      this.selectedDevice=Object.assign({}, this.$store.state.deviceCustomer)
      if (this.selectedDevice) {
        if (this.selectedDevice.monitored !== "monitored") this.selectedDevice.monitored = "monitored";
        else this.selectedDevice.monitored = "";
        this.saveDevice();
      }
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
    device: 'device',
    customerDescription() {
      const customer=this.customer;
      if(customer.vatcode && customer.vatcode!=="")
        return customer.company;
      else
        return customer.lastname+" "+customer.firstname;
    },
    monitorClassBackground() {
      return this.selectedDevice.monitored;
    }
  }),
  mounted () {
    this.selectedCustomer=Object.assign({}, this.$store.state.customer);
    this.selectedContract=Object.assign({}, this.$store.state.contract);
    this.populateSelectAsset();
    this.getDeviceData();
    this.getFreeIps();
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

.monitored {
  background-color: rgb(255, 123, 0);
}
</style>
