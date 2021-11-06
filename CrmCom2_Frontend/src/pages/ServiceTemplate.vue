<template>
  <div id="serviceTemplate">
    <h6 class="h4 text-gray-900 mb-4">Configurazione Modelli di Servizio</h6>

    <img
      src="./img/actions/new.png"
      v-on:click="newServiceTemplate()"
      style="width: 32px; height: 32px"
    />
    <img
      src="./img/actions/save.png"
      v-on:click="saveServiceTemplate()"
      style="width: 32px; height: 32px"
    />
    <img
      src="./img/actions/delete.png"
      v-on:click="deleteServiceTemplate()"
      style="width: 32px; height: 32px"
    />
    <ValidationObserver ref="formServiceTemplate">
      <q-form ref="serviceForm" class="q-gutter-md">
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
                v-model="selectedServiceTemplate.description"
              />
              <span class="error">{{ errors[0] }}</span>
            </ValidationProvider>
          </div>
          <div class="col">
            <ValidationProvider
              name="Category"
              immediate
              rules="required"
              v-slot="{ errors }"
            >
              <q-select
                filled
                label="Categoria"
                @input="changeCategory"
                :options="serviceCategories"
                v-model="selectedCategory"
              />
              <span class="error">{{ errors[0] }}</span>
            </ValidationProvider>
          </div>
          <div class="col">
            <ValidationProvider
              name="Unità"
              immediate
              rules="required|alpha_spaces"
              v-slot="{ errors }"
            >
              <q-input label="Unità" v-model="selectedServiceTemplate.unit" />
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
                v-model="selectedServiceTemplate.billingPeriod"
              />
              <span class="error">{{ errors[0] }}</span>
            </ValidationProvider>
          </div>
        </div>

        <div class="row">
          <div class="col">
            <ValidationProvider
              name="Costo di attivazione"
              immediate
              rules="required|decimal"
              v-slot="{ errors }"
            >
              <q-input
                label="Costo di attivazione"
                v-model="selectedServiceTemplate.activationPrice"
              />
              <span class="error">{{ errors[0] }}</span>
            </ValidationProvider>
          </div>
          <div class="col">
            <ValidationProvider
              name="Prezzo"
              immediate
              rules="required|decimal"
              v-slot="{ errors }"
            >
              <q-input label="Prezzo" v-model="selectedServiceTemplate.price" />
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
              <q-input label="IVA" v-model="selectedServiceTemplate.vat" />
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
                v-model="selectedServiceTemplate.dayinvoicereminder"
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
                v-model="selectedServiceTemplate.nopaydaysbeforedeactivation"
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
                v-model="selectedServiceTemplate.dayforexpirationwarning"
              />
              <span class="error">{{ errors[0] }}</span>
            </ValidationProvider>
          </div>
        </div>
      </q-form>
    </ValidationObserver>

    <hr class="separator" />
    <div id="serviceTemplateParameters" v-if="selectedServiceTemplate.objData">
      <h6>Parametri servizio</h6>
      <div
        class="row"
        v-for="(primitive, primitiveName) in selectedServiceTemplate.objData
          .parameters"
        v-bind:key="primitiveName"
      >
        <div class="col">
          <q-input
            :label="primitiveName"
            v-bind:id="primitiveName"
            v-model="selectedServiceTemplate.objData.parameters[primitiveName]"
          />
        </div>
      </div>
    </div>

    <q-table
      title="Modelli di servizio"
      :data="serviceTemplates"
      :columns="columnsTableServiceTemplates"
      :pagination="initialPagination"
      :filter="txtFilter"
      row-key="id"
      virtual-scroll
    >
      <template v-slot:top-right>
        <q-input
          borderless
          dense
          debounce="300"
          v-model="txtFilter"
          placeholder="Ricerca"
        >
          <q-icon slot="append" name="search" />
        </q-input>
      </template>

      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th auto-width />
          <q-th v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>

      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td auto-width>
            <img
              src="./img/actions/open.png"
              style="width: 32px; height: 32px; fill: greenyellow"
              v-on:click="selectServiceTemplate(props.row)"
            />
            <img
              src="./img/actions/unlocked.png"
              style="width: 32px; height: 32px; xfill: green"
              v-on:click="activateServiceTemplate(props.row)"
            />
            <img
              src="./img/actions/locked.png"
              style="width: 32px; height: 32px; xfill: red"
              v-on:click="suspendServiceTemplate(props.row)"
            />
            <img
              src="./img/actions/delete.png"
              style="width: 32px; height: 32px; xfill: gray"
              v-on:click="deleteServiceTemplate(props.row)"
            />
          </q-td>
          <q-td v-for="col in props.cols" :key="col.name" :props="props">
            {{ col.value }}
          </q-td>
        </q-tr>
      </template>
    </q-table>
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
        selectedServiceTemplate: {},
        serviceTemplates: [],
        serviceCategories: [],
        selectedCategoryObject: {},
        selectedCategory: {label: '', value: '', icon: ''},
        txtFilter: "",
        initialPagination: {
          sortBy: "category",
          descending: false,
          page: 1,
          rowsPerPage: 5
        },
        columnsTableServiceTemplates: [
          { name: "actions", label: "Azioni" },
          {
            name: "description",
            label: "Descrizione",
            field: "description",
            sortable: true
          },
          {
            name: "code",
            label: "Codice",
            field: "code",
            sortable: true
          },
          {
            name: "category",
            label: "Categoria",
            field: "category",
            sortable: true
          },
          {
            name: "unit",
            label: "Unità",
            field: "unit",
            sortable: true
          },
          {
            name: "price",
            label: "Prezzo",
            field: "price",
            sortable: true
          },
          {
            name: "createdAt",
            label: "Data inserimento",
            field: "createdAt",
            sortable: true
          },
          {
            name: "updatedAt",
            label: "Aggiornato il",
            field: "updatedAt",
            sortable: true
          }
      ]
      }
  },
  components: {
    ValidationProvider,
    ValidationObserver
  },
  methods: {
    getServiceTemplateData: function() {
        this.getAllServiceTemplates();
        this.getAllServiceCategories();
    },
    getAllServiceTemplates: function() {
      this.serviceTemplates=[];
        this.$axios.post('/adminarea/serviceTemplate/getall', {})
            .then(response => {
                  if (response.data.status === "OK") {
                    this.serviceTemplates = response.data.serviceTemplates;
                    this.makeToast(response.data.msg);
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
                        this.serviceCategories.push({label: element.description, description: element.description, value: element, icon: ''})
                      });
                      this.makeToast(response.data.msg);
                  }
              })
              .catch(error => {
                  console.log(error);
              });
    },
    changeCategory: function() {
      this.selectedCategoryObject=this.selectedCategory.value;
      this.selectedServiceTemplate.category=this.selectedCategoryObject.value;
      console.log("Change service category");
      console.log(this.selectedCategoryObject);
      //Set parameters for services
      console.log(this.selectedCategoryObject.value);
      if(this.selectedCategoryObject.parameters)
      {
        console.log("Init objData parameters for serviceTemplate");
        this.selectedServiceTemplate.objData={};
        this.selectedServiceTemplate.objData.parameters=this.selectedCategoryObject.parameters;
      }
    },
    newServiceTemplate: function (){
      delete this.selectedServiceTemplate.id;
      this.saveServiceTemplate();
    },
    saveServiceTemplate: function (){
        let relUrl="";
        if((!this.selectedServiceTemplate.id) || (this.selectedServiceTemplate.id==="")) {
          relUrl='/adminarea/serviceTemplate/insert';
          this.selectedServiceTemplate.state="active"; //New services start active
        }
        else relUrl='/adminarea/serviceTemplate/update';
        
        this.$axios.post(relUrl, {serviceTemplate: this.selectedServiceTemplate})
            .then(response => {
                  if (response.data.status === "OK") {
                      this.selectedServiceTemplate = response.data.serviceTemplate;
                      this.$store.commit("changeServiceTemplate",Object.assign({}, this.selectedServiceTemplate));
                      if(relUrl==='/adminarea/serviceTemplate/insert') this.serviceTemplates.push(this.selectedServiceTemplate);
                  }
                  this.makeToast(response.data.msg);
              })
              .catch(error => {
                  console.log(error);
              });
    },
    selectServiceTemplate: function (srv) {
      console.log(srv);
      this.selectedServiceTemplate=srv;
      this.$store.commit("changeServiceTemplate",Object.assign({}, this.selectedServiceTemplate));
    },
    deleteServiceTemplate: function (srv) {
      const isConfirmed = confirm("Confermi la cancellazione?");
      if(isConfirmed) {
      const parent=this.$parent;
      this.$axios.post('/adminarea/serviceTemplate/delete', {serviceTemplate: srv})
          .then(response => {
                if (response.data.status === "OK") {
                    this.serviceTemplates.forEach((element, index, array) => {
                      if(element.id===srv.id)  this.serviceTemplates.splice(index,1);
                    });
                    this.selectedServiceTemplate = {};
                    this.makeToast(response.data.msg);
                }
            })
            .catch(error => {
                console.log(error);
            });
        }
    },
    activateServiceTemplate: function(srv) {
      srv.state="active";
      this.$axios.post('/adminarea/serviceTemplate/update', {serviceTemplate: srv})
        .then(response => {
              if (response.data.status === "OK") {
                  this.selectedServiceTemplate = response.data.serviceTemplate;
                  this.makeToast(response.data.msg);
              }
          })
          .catch(error => {
              console.log(error);
          });
    },
    suspendServiceTemplate: function(srv) {
      srv.state="suspended";
      this.$axios.post('/adminarea/serviceTemplate/update', {serviceTemplate: srv})
        .then(response => {
              if (response.data.status === "OK") {
                  this.selectedServiceTemplate = response.data.serviceTemplate;
                  this.makeToast(response.data.msg);
              }
          })
          .catch(error => {
              console.log(error);
          });
    },
    exit: function() {
      this.$parent.$emit("selectedCustomer");
    },
    makeToast(string) {
      this.$q.notify({color: 'green-4', textColor: 'white', icon: 'info', message: string});
    }
  },
  computed: mapState({
    serviceTemplate: 'serviceTemplate',
    }),
    created() {
      this.getServiceTemplateData();
    },
    beforeRouteEnter(to, from, next) {
    var currentUser = Store.state.user;
    if (currentUser.role === "admin")
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

.error {
  color: rgb(127, 127, 0);
  background-color: yellow;
  font-style: italic;
}
</style>
