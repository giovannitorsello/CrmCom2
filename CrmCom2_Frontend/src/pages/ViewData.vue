<template>
  <div id="ObjectsQueryAndExport">
    <h5>Ricerche ed esportazione dati</h5>
    <h5 v-if="customer.id">Cliente selezionato: {{customerDescription}}</h5>
    <h5 v-if="contract.id">Contratto selezionato: {{contract.description}}</h5>
    <q-form @submit.prevent="search()">
      <select
        id="objType"
        name="objType"
        placeorder="Tipo di oggetto"
        v-model="objType"
        @change="changeTypeObject"
        class="form-control form-control-user"
        aria-label="Tipo di oggetto"
      >
        <option
          v-for="type in objTypes"
          v-bind:key="type.id"
          v-bind:value="type"
        >{{ type.description }}</option>
      </select>

      <q-input label="Ricerca" v-model="txtSearch" />
    </q-form>

    <q-table
      :data="objectsFound"
      :columns="columnsTableFields"
      :pagination="initialPagination"
      :filter="txtFilter"
    >
      <template v-slot:top-right>
        <q-input borderless dense debounce="300" v-model="txtFilter" placeholder="Ricerca">
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
              style="width: 32px; height: 32px;"
              v-on:click="openObject(props.row)"
            />
            <img
              src="./img/actions/link.png"
              style="width: 32px; height: 32px;"
              v-on:click="connectObject(props.row)"
            />
          </q-td>
          <q-td v-for="col in props.cols" :key="col.name" :props="props">{{ col.value }}</q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>
    

<script lang="js">
import { mapState } from 'vuex'
import {Store} from '../store'
import objTypesJson from '../config/queriesAndExportData.json'

export default {
  data() {
    return {
        objType: {},
        objTypes: objTypesJson,
        txtSearch: "",
        txtFilter: "",
        objectsFound: [],
        initialPagination: {
          sortBy: "desc",
          descending: false,
          page: 2,
          rowsPerPage: 10
        },
        columnsTableFields: []
    }
  },
  methods: {
    changeTypeObject() {
        var fields=this.objType.searchFields.slice();
        this.columnsTableFields=[];
        this.columnsTableFields.push({name: "actions", label: "Azioni", field: "actions"});
        fields.forEach(element => {
          var item={
            name: element,
            label: element,
            field: element
          };
          console.log(item);
          this.columnsTableFields.push(item);
        }); 
    },
    openObject(obj) {
        if(this.objType) {
            const uiCompRoute=this.objType.UiComponent;            
            this.$store.commit("change"+uiCompRoute,obj);
            this.$router.push("/"+uiCompRoute);
        }
    },
    connectObject(obj) {
      console.log("Connect object");
        if(this.objType) {
        console.log(this.objType);
        if(this.objType.type==="deviceCustomer") 
        {
          if(this.contract) obj.contractId=this.contract.id;
          if(this.customer) obj.customerId=this.customer.id;
          console.log(obj);
          console.log(this.customer);
          console.log(this.contract);
        }
          const uiCompRoute="/"+this.objType.UiComponent; 
          console.log("Got "+uiCompRoute);
          console.log(obj);
          this.$store.commit("change"+uiComp,obj);
          this.$router.push(uiCompRoute);
        }
    },
    search() {        
        if(this.objType) {
          const urlRestService=this.objType.findByFieldUrl;        
          const searchObj={"type": this.objType.type, "fields": this.objType.searchFields, "value": this.txtSearch};
          this.$axios.post(urlRestService, {"searchObj": searchObj})
          .then(response => {                
                if (response.data.status === "OK") {
                    this.objectsFound=[];
                    response.data.results.forEach(element =>{
                      this.objectsFound.push(element);  
                    });
                    this.makeToast(response.data.msg);     
                    this.txtFilter=this.txtSearch;              
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
  computed: mapState({
    user: 'user', 
    customer: 'customer',
    contract: 'contract',
    service: 'service',
    deviceCustomer:  'deviceCustomer',
    deviceBackbone:  'deviceBackbone',
    customerDescription() {
      const customer=this.customer;
      if(customer.vatcode && customer.vatcode!=="")
        return customer.company;
      else 
        return customer.lastname+" "+customer.firstname;
    }
  }),
  beforeRouteEnter(to, from, next) {
    var currentUser = Store.state.user;
    console.log(currentUser);
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
</style>