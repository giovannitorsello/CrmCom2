<template>
  <div id="device">
    <h6>
      Gestione dispositivi
      <strong>{{customerDescription}}</strong>
    </h6>

    <img src="/img/actions/new.png"     @click="newDevice" style="width: 48px; height: 48px;" />
    <img src="/img/actions/save.png"    @click="saveDevice" style="width: 48px; height: 48px;" />
    <img src="/img/actions/delete.png"  @click="deleteDevice" style="width: 48px; height: 48px;" />
    <img src="/img/actions/eye.svg"     @click="monitorDevice" style="width: 48px; height: 48px;" v-bind:class="monitorClassBackground"/>
    <img src="/img/actions/exit.png"    @click="exit" style="width: 48px; height: 48px;" />

    <ValidationObserver ref="FormDeviceCustomer">
    <q-form ref="deviceForm" class="q-gutter-md">
      <div class="row">
        <div class="col">
          <ValidationProvider name="Tecnologia" immediate rules="required" v-slot="{ errors }">
            <select
              id="companyasset"
              name="companyasset"
              placeorder="Tecnologia utilizzata"
              v-model="companyasset"
              class="form-control form-control-user"
              aria-label="Tecnologia internet"
              @change="initDeviceProperties"
            >
              <option
                v-for="companyasset in companyassets"
                v-bind:key="companyasset.id"
                v-bind:value="companyasset"
              >{{ companyasset.company }} ({{companyasset.techasset}})</option>
            </select>
            <span class="error">{{ errors[0] }}</span>
          </ValidationProvider>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <ValidationProvider name="Descrizione" immediate rules="required|alpha" v-slot="{ errors }">
            <q-input label="Descrizione" v-model="selectedDevice.description" />
            <span class="error">{{ errors[0] }}</span>
          </ValidationProvider>
        </div>
        <div class="col">
          <ValidationProvider name="Tipo" immediate rules="required|alpha" v-slot="{ errors }">
            <q-input label="Tipo" v-model="selectedDevice.type" />
            <span class="error">{{ errors[0] }}</span>
          </ValidationProvider>
        </div>
        <div class="col"></div>
        <div class="col">
          <ValidationProvider name="Produttore" immediate rules="required|alpha_spaces" v-slot="{ errors }">
            <q-input label="Produttore" v-model="selectedDevice.vendor" />
            <span class="error">{{ errors[0] }}</span>
          </ValidationProvider>
        </div>
        <div class="col">
          <ValidationProvider name="Modello" immediate rules="required|alpha" v-slot="{ errors }">
            <q-input label="Modello" v-model="selectedDevice.model" />
            <span class="error">{{ errors[0] }}</span>
          </ValidationProvider>          
        </div>
      </div>
      <div class="row">
        <div class="col">
          <ValidationProvider name="Tecnologia" immediate rules="mac" v-slot="{ errors }">
            <q-input label="MAC" v-model="selectedDevice.mac" />
            <span class="error">{{ errors[0] }}</span>
          </ValidationProvider>
        </div>
        <div class="col">
          <ValidationProvider name="Tecnologia" immediate rules="required|ipv4" v-slot="{ errors }">
            <q-input label="ipv4" v-model="selectedDevice.ipv4" />
            <span class="error">{{ errors[0] }}</span>
          </ValidationProvider>          
        </div>
        <div class="col">
          <ValidationProvider name="Tecnologia" immediate rules="ipv6" v-slot="{ errors }">
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
    <template v-if="selectedDevice">
      <h6>Parametri generali</h6>
      <div id="deviceParametersPrimitives" v-if="selectedDevice.objData">
        <div
          class="row"
          v-for="(primitive, primitiveName) in objDataPrimitives"
          v-bind:key="primitive"
        >
          <div class="col">
            <label
              v-bind:for="primitiveName"
              class="form-control form-control-user"
            >{{primitiveName}}</label>
          </div>
          <div class="col">
            <input
              class="form-control form-control-user"
              v-bind:id="primitiveName"
              v-model="selectedDevice.objData[primitiveName]"
            />
          </div>
        </div>
      </div>

      <hr class="separator" />
      <h6>Sezioni specifiche</h6>
      <div id="deviceParametersSections" v-if="selectedDevice.objData">
        <div
          v-for="(section, sectionName, indexSection) in objDataSection"
          v-bind:key="indexSection"
        >
          <h6>
            <p align="left">{{ sectionName}}</p>
          </h6>
          <div class="row">
            <div
              v-for="(devProperty,devPropertyName, indexProperty) in section"
              v-bind:key="indexProperty"
            >
              <div class="col">
                <label
                  v-bind:for="devPropertyName"
                  class="form-control form-control-user"
                >{{devPropertyName}}</label>
                <input
                  class="form-control form-control-user"
                  v-bind:id="devPropertyName"
                  v-model="selectedDevice.objData[sectionName][devPropertyName]"
                />
              </div>
            </div>
          </div>
          <hr class="separator" />
        </div>
      </div>
    </template>
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
      companyassets: companyassetsJson,
      companyasset: {},
      selectedDevice: {},  
      devices: {},
      objDataSection: {},
      objDataPrimitives: {}                   
    }
  },
  components: {
    ValidationProvider,
    ValidationObserver
  },
  methods: {
    initDeviceProperties() {
      if(this.companyasset) {
      this.objDataSection=[];
      this.objDataPrimitives=[];

      this.selectedDevice.objData=this.companyasset.propDeviceStructure;
      this.$store.commit("changeDeviceCustomer", this.selectedDevice);  
      this.parseDeviceObjData(); 
      console.log("Modify device structure");
      console.log(this.selectedDevice);
      }
    },
    getDeviceData: function() {
      this.selectedDevice= Object.assign({}, this.$store.state.deviceCustomer);  
      if(this.selectedDevice===null) this.selectedDevice={objData: {}};
      if(this.selectedDevice.objData===null) this.selectedDevice={objData: {}};
      this.$store.commit("changeDeviceCustomer", this.selectedDevice);
      
      //init correct companyasset in selection
      this.companyassets.forEach(element => {
        if(element.company===this.selectedDevice.companyasset && element.techasset===this.selectedDevice.techasset)
          this.companyasset=element;
      });   
      this.parseDeviceObjData(); 
    },
    parseDeviceObjData: function() {
      if(this.selectedDevice && this.selectedDevice.id && this.selectedDevice.objData)
      for (const sectionName in this.selectedDevice.objData) {
        if(typeof(this.selectedDevice.objData[sectionName])==="object") {
          this.objDataSection[sectionName]=this.selectedDevice.objData[sectionName];
        }
        else
          this.objDataPrimitives[sectionName]=this.selectedDevice.objData[sectionName];          
      }              
    },
    newDevice() {
      this.selectedDevice={};        
      this.$store.commit("changeDeviceCustomer", this.selectedDevice);      
      this.makeToast("Configura un nuovo dispositivo");
    },
    saveDevice: function() {
      this.selectedDevice.companyasset=this.companyasset.company;
      this.selectedDevice.techasset=this.companyasset.techasset;
      this.selectedDevice.state="active";
      this.selectedDevice.contractId=this.contract.id;
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
    this.getDeviceData();       
  },
    beforeRouteEnter(to, from, next) {
    var currentUser = Store.state.user;
    console.log(currentUser);
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