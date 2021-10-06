<template>
  <div id="deviceBackbone">
    <h6>Gestione eventi di manutenzione</h6>
    <p><b>Sito {{selectedSiteBackbone.description}}</b></p>
    <p><b>Dispositivo {{selectedDeviceBackbone.description}}</b></p>
    <q-table
      title="Eventi di manutenzione"
      :data="maintenanceEvents"
      :columns="columnsTablemanteinanceEvents"
      row-key="id"
      :filter="filterMaintenanceEvent"
      virtual-scroll
      :pagination="initialPagination"
      :rows-per-page-options="[0]"
      @row-click="openMaintenanceEvent"
      no-data-label="nessun risultato"
      no-results-label="nessun risultato"
    >
      <template v-slot:top-right>
        <q-input borderless dense debounce="300" v-model="filterMaintenanceEvent" placeholder="Ricerca">
          <q-icon slot="append" name="search" />
        </q-input>
      </template>

      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th auto-width />
          <q-th v-for="col in props.cols" :key="col.name" :props="props">{{ col.label }}</q-th>
        </q-tr>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props" v-bind:class="props.row.state">
          <q-td auto-width>
            <img
              src="./img/actions/open.png"
              v-on:click="openMaintenanceEvent(props.row)"
              style="width: 32px; height: 32px;"
            />
            <img
              src="./img/actions/delete.png"
              v-on:click="deleteMaintenanceEvent(props.row)"
              style="width: 32px; height: 32px; xfill: gray;"
            />                        
          </q-td>
          <q-td v-for="col in props.cols" :key="col.name" :props="props">{{ col.value }}</q-td>
        </q-tr>
      </template>
    </q-table>

    <img src="./img/actions/new.png" @click="newMaintenanceEvent" style="width: 48px; height: 48px;" />
    <img src="./img/actions/save.png" @click="saveMaintenanceEvent" style="width: 48px; height: 48px;" />
    <img src="./img/actions/delete.png" @click="deleteMaintenanceEvent" style="width: 48px; height: 48px;" />    
    <img src="./img/actions/exit.png" @click="exit" style="width: 48px; height: 48px;" />

    <ValidationObserver ref="FormMaintenanceEvent">
      <q-form ref="MaintenanceEventForm" class="q-gutter-md">
          <div class="row">
            <div class="col">
              <ValidationProvider name="Descrizione" immediate rules="required|alpha_spaces" v-slot="{ errors }">
                <q-input label="Descrizione" v-model="selectedMaintenanceEvent.description" />
                <span class="error">{{ errors[0] }}</span>
              </ValidationProvider>
            </div>
            <div class="col">
              <ValidationProvider name="Intervallo in giorni" immediate rules="required|integer" v-slot="{ errors }">
                <q-input label="Intervallo in giorni" v-model="selectedMaintenanceEvent.daysInterval" />
                <span class="error">{{ errors[0] }}</span>
              </ValidationProvider>
            </div>
            <div class="col">
              <ValidationProvider name="Tipo" immediate rules="required|alpha_spaces" v-slot="{ errors }">
                <q-input label="Tipo" v-model="selectedMaintenanceEvent.type" />
                <span class="error">{{ errors[0] }}</span>
              </ValidationProvider>
            </div>
            <div class="col">
              <ValidationProvider name="Data inizio" immediate rules="required" v-slot="{ errors }">   
                <q-input filled v-model="selectedMaintenanceEvent.begin">
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                        <q-date v-model="selectedMaintenanceEvent.begin" :locale="calendarLocale">
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
            </div>
          </div>        
          <div class="row">
            <div class="col">
              <ValidationProvider name="Note" immediate rules="" v-slot="{ errors }">
                <q-input
                  label="Note e dettagli manutenzione"
                  v-model="selectedMaintenanceEvent.note"
                  type="textarea"
                  rows="5"
                  cols="20"
                />
                <span class="error">{{ errors[0] }}</span>
              </ValidationProvider>
            </div>
          </div>
      </q-form>
    </ValidationObserver>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import {Store} from '../store'
import { ValidationProvider, ValidationObserver, extend, localize } from 'vee-validate';
import validator from "./validator"

export default {
  data() {
    return {
      selectedSiteBackbone: {},
      selectedDeviceBackbone: {},
      selectedMaintenanceEvent: {},
      sitesBackbone: {},
          
      //Table events variables
      maintenanceEvents: [],
      filterMaintenanceEvent: "",
      initialPagination: {
        sortBy: "description",
        descending: true,
        page: 2,
        rowsPerPage: 5
      },
      columnsTablemanteinanceEvents: [
        { name: "actions", label: "Azioni" },
        {
          name: "description",
          label: "Descrizione",
          field: row => row.description,
          sortable: true
        },        
        {
          name: "type",
          label: "Tipo",
          field: row => row.type,
          sortable: true
        },
        {
          name: "state",
          label: "Stato",
          field: row => row.state,
          sortable: true
        },
        {
          name: "daysInterval",
          label: "Intervallo in giorni",
          field: row => row.daysInterval,
          sortable: true
        }
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
    };
  },
  components: {
    ValidationProvider,
    ValidationObserver
  },
  computed: {
    siteDescription(dev) {
      return this.sitesBackbone[dev.siteBackboneId];
    }
  },
  mounted() {
    validator.setup();    
    this.selectedSiteBackbone = Object.assign({}, this.$store.state.siteBackbone);
    this.selectedDeviceBackbone = Object.assign({}, this.$store.state.deviceBackbone);
    this.selectedMaintenanceEvent = Object.assign({}, this.$store.state.MaintenanceEvent);
    if (this.selectedMaintenanceEvent == null) this.selectedMaintenanceEvent = {};
    this.getAllMaintenanceEvent();
  },
  methods: {        
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    getAllMaintenanceEvent() {
      this.$axios
        .post("/adminarea/maintenanceEvent/getall", {deviceBackbone: this.selectedDeviceBackbone})
        .then(response => {
          if (response.data.status === "OK") {
            this.maintenanceEvents = response.data.maintenanceEvents;
            console.log(this.maintenanceEvents);
            this.totalRows = this.maintenanceEvents.length;
            this.makeToast(response.data.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
    }, 
    newMaintenanceEvent() {
      this.selectedMaintenanceEvent={};
      this.selectedMaintenanceEvent.objData={}
      this.$store.commit("changeMaintenanceEvent", Object.assign({}, this.selectedMaintenanceEvent));
      this.makeToast("Insert new maintenance event.");
    },
    openMaintenanceEvent(evt) {
      this.selectedMaintenanceEvent = evt;
      this.$store.commit("changeMaintenanceEvent", Object.assign({}, this.selectedMaintenanceEvent));      
    },
    saveMaintenanceEvent() {
      
      //Update
      if(this.selectedMaintenanceEvent.id) {
          this.$axios.post("/adminarea/maintenanceEvent/update", {
            maintenanceEvent: this.selectedMaintenanceEvent
          })
          .then(response => {
            if (response.data.status === "OK") {
              this.selectedMaintenanceEvent = response.data.maintenanceEvent;
              this.$store.commit("changeMaintenanceEvent", Object.assign({}, this.selectedMaintenanceEvent));
              this.makeToast(response.data.msg);
              this.getAllMaintenanceEvent();
            } else this.makeToast(response.data.msg, "danger");
          })
          .catch(error => {
            console.log(error);
          });
      }
      
      //New insert
      if(!this.selectedMaintenanceEvent.id) {
        console.log("New Insert");
      console.log(this.selectedMaintenanceEvent);
        this.selectedMaintenanceEvent.objData={}
        this.selectedMaintenanceEvent.objData.device=this.selectedDeviceBackbone;
        this.$axios
          .post("/adminarea/maintenanceEvent/insert", {
            maintenanceEvent: this.selectedMaintenanceEvent
          })
          .then(response => {
            if (response.data.status === "OK") {
              this.selectedMaintenanceEvent = response.data.maintenanceEvent;
              this.$store.commit("changeMaintenanceEvent", Object.assign({}, this.selectedMaintenanceEvent));              
              this.makeToast(response.data.msg);
              this.getAllMaintenanceEvent();
            } else this.makeToast(response.data.msg, "danger");
          })
          .catch(error => {
            console.log(error);
          });
      }

      
    },
    deleteMaintenanceEvent(evt) {
      const isConfirmed = confirm("Confermi la cancellazione?");
      if (isConfirmed) {
        this.$axios
          .post("/adminarea/maintenanceEvent/delete", {
            maintenanceEvent: evt
          })
          .then(response => {
            if (response.data.status === "OK") {
              this.selectedMaintenanceEvent = {};
              this.$store.commit("changeMaintenanceEvent", Object.assign({}, this.selectedMaintenanceEvent));
              this.makeToast(response.data.msg);
              this.getAllMaintenanceEvent();
            } else this.makeToast(response.data.msg, "danger");
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    makeToast(string) {
      this.$q.notify({
        color: "green-4",
        textColor: "white",
        icon: "info",
        message: string
      });
    },
    exit() {
      this.$router.go(-1);
    }
  },
  computed: {
    monitorClassBackground(dev) {
      return dev.state;
    },
    classRowTableDevices(dev) {
      if (dev && dev.state) {
        return dev.state;
      }
      return "";
    }
  },
    beforeRouteEnter(to, from, next) {
    var currentUser = Store.state.user;
    console.log(currentUser);
    if ((currentUser.role === "admin") ||        
        (currentUser.role === "manager") ||
        (currentUser.role === "ufficio") || 
        (currentUser.role === "technician"))  next();
    else next("/Login");
  }
};
</script>

<style>
.active {
  background-color: rgb(168, 243, 168);
}

.suspended {
  background-color: rgb(177, 171, 171);
}

.monitored {
  background-color: rgb(255, 115, 0);
}

.normal {
  background-color: rgb(0, 217, 255);
}

.error {
  color: rgb(127, 127, 0);
  background-color: yellow;
  font-style: italic;
}
</style>