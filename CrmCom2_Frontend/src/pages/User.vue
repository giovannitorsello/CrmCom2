<template>
  <div id="user">
    <h5>Gestione utenti sistema</h5>

    <img src="asset/img/actions/new.png" @click="newUser()" style="width: 48px; height: 48px;" />
    <img src="asset/img/actions/save.png" @click="saveUser()" style="width: 48px; height: 48px;" />
    <img src="asset/img/actions/delete.png" @click="deleteUser()" style="width: 48px; height: 48px;" />
    <img src="asset/img/actions/exit.png" @click="exit()" style="width: 48px; height: 48px;" />

    <ValidationObserver ref="formUsers">
    <q-form ref="userForm" class="q-gutter-md">
      <div class="row">
        <div class="col">
          <ValidationProvider name="Nome" immediate rules="required|alpha_spaces" v-slot="{ errors }">
            <q-input label="Nome" v-model="selectedUser.firstname" />
            <span class="error">{{ errors[0] }}</span>
          </ValidationProvider>
        </div>
        <div class="col">
          <ValidationProvider name="Nome" immediate rules="required|alpha_spaces" v-slot="{ errors }">
            <q-input label="Cognome" v-model="selectedUser.lastname" />
            <span class="error">{{ errors[0] }}</span>
          </ValidationProvider>          
        </div>
        <div class="col">
          <ValidationProvider name="Codice fiscale" immediate rules="required|codfis" v-slot="{ errors }">
            <q-input label="Codice fiscale" v-model="selectedUser.codfis" />
            <span class="error">{{ errors[0] }}</span>
          </ValidationProvider>          
        </div>
        <div class="col">
          <ValidationProvider name="Indirizzo" immediate rules="required|address" v-slot="{ errors }">
            <q-input label="Indirizzo" v-model="selectedUser.address" />
            <span class="error">{{ errors[0] }}</span>
          </ValidationProvider>          
        </div>
      </div>

      <div class="row">
        <div class="col">
          <ValidationProvider name="Email" immediate rules="required|email" v-slot="{ errors }">
            <q-input label="Email" v-model="selectedUser.email" />
            <span class="error">{{ errors[0] }}</span>
          </ValidationProvider>          
        </div>
        <div class="col">
          <ValidationProvider name="Telefono mobile" immediate rules="required|phone" v-slot="{ errors }">
            <q-input label="Telefono mobile" v-model="selectedUser.mobilephone" />
            <span class="error">{{ errors[0] }}</span>
          </ValidationProvider>          
        </div>
        <div class="col">
          <ValidationProvider name="Username" immediate rules="required" v-slot="{ errors }">
            <q-input label="Username" v-model="selectedUser.username" />
            <span class="error">{{ errors[0] }}</span>
          </ValidationProvider>          

        </div>
        <div class="col">
          <ValidationProvider name="Password" immediate rules="required" v-slot="{ errors }">
            <q-input label="Password" v-model="selectedUser.password" />
            <span class="error">{{ errors[0] }}</span>
          </ValidationProvider>          
        </div>
        <div class="col">
          <ValidationProvider name="Ruolo" immediate rules="required" v-slot="{ errors }">
            <q-select label="Ruolo" @input="changeRole" :options="roles" v-model="selectedRole" />
            <span class="error">{{ errors[0] }}</span>
          </ValidationProvider>          
        </div>
      </div>
    </q-form>
    </ValidationObserver>

    <q-table
      title="Utenti"
      :data="users"
      :columns="columnsTableUsers"
      row-key="id"
      virtual-scroll
      :pagination.sync="pagination"
      :rows-per-page-options="[5,10,15]"
      @row-click="openUser"
    >
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
              src="asset/img/actions/open.png"
              v-on:click="openUser(props.row)"
              style="width: 32px; height: 32px;"
            />
            <img
              src="asset/img/actions/unlocked.png"
              v-on:click="activateUser(props.row)"
              style="width: 32px; height: 32px;"
            />
            <img
              src="asset/img/actions/locked.png"
              v-on:click="suspendUser(props.row)"
              style="width: 32px; height: 32px;"
            />
            <img
              src="asset/img/actions/delete.png"
              v-on:click="deleteUser(props.row)"
              style="width: 32px; height: 32px;"
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
import { ValidationProvider, ValidationObserver, extend, localize } from 'vee-validate';
import validator from "./validator"


export default {
  data() {
      return {
        selectedUser: {},
        selectedRole: {},
        users: [],
        pagination: {rowsPerPage: 0},
        roles: [
                  {label: "Ufficio",                    value: "manager",       description: "Ufficio azienda"},                   
                  {label: "Tecnico interno",            value: "technician",    description: "Tecnico azienda"}, 
                  {label: "Installatore esterno",       value: "installer",     description: "Installatore esterno"}, 
                  {label: "Commerciale",                value: "seller",        description: "Rappresentante commerciale esterno"}, 
                  {label: "Administrator",              value: "admin",         description: "Amministrazione sistema"},                 
                  ],    
        columnsTableUsers: [
                  {name: "actions",         label: "Azioni"},
                  {name: "firstname",       label: "Nome",               field: row => row.firstname,  sortable: true},
                  {name: "lastname",        label: "Cognome",            field: row => row.lastname, sortable: true},
                  {name: "username",        label: "Indirizzo",          field: row => row.username, sortable: true},
                  {name: "phone",           label: "Telefono",           field: row => row.mobilephone,    sortable: true},
                  {name: "email",           label: "Email",              field: row => row.email,    sortable: true},
                  {name: "createdAt",       label: "Data inserimento",   field: row => row.createdAt,sortable: true},
                  ],
      }
    },
  methods: {
    newUser: function() {
        this.selectedUser={};        
    },
    openUser: function(usr) {
        this.selectedUser=usr;
        this.roles.forEach(element => {
          if(element.value===usr.role)
            this.selectedRole=element;
        })     
    },
    saveUser: function () {
      console.log(this.selectedUser);
      this.$axios.post('/adminarea/user/update', {user: this.selectedUser})
          .then(response => {                
                if (response.data.status === "OK") {                  
                    this.selectedUser = response.data.user;                        
                    this.makeToast(response.data.msg);                    
                }
                else
                  this.makeToast(response.data.msg);
            })
            .catch(error => {                              
                console.log(error);
            });
    },
    deleteUser: function (usr) {
      const isConfirmed = confirm("Confermi la cancellazione?");
        if(isConfirmed) {
        this.$axios.post('/adminarea/user/delete', {user: usr})
          .then(response => {                
                if (response.data.status === "OK") {
                    this.users.forEach((element, index, array) => {
                      if(element.id===usr.id)  this.users.splice(index,1); 
                    });              

                    this.selectedService = {};                
                    this.makeToast(response.data.msg);                              
                }
                else
                  this.makeToast(response.data.msg);                                     
            })
            .catch(error => {                              
                console.log(error);
            });
        }
    },
    getUserData: function() {
        this.selectedUser=Object.assign({}, this.$store.state.user);        
        this.getAllUsers();
    },
    getAllUsers: function() {
        this.$axios.post('/adminarea/user/getall', {})
            .then(response => {                             
                  if (response.data.status === "OK") {                  
                      this.users = response.data.users;                                                
                      this.makeToast(response.data.msg);                       
                  }                                     
              })
              .catch(error => {                              
                  console.log(error);
              });
    },
    activateUser: function(usr) {
      usr.state="active";
      this.$axios.post('/adminarea/user/update', {user: usr})
        .then(response => {                
              if (response.data.status === "OK") {                  
                  this.selectedUser = response.data.user;                      
                  this.makeToast(response.data.msg);                   
              }                                     
          })
          .catch(error => {                              
              console.log(error);
          });
    },
    suspendUser: function(usr) {
      usr.state="suspended";
      this.$axios.post('/adminarea/user/update', {user: usr})
        .then(response => {                
              if (response.data.status === "OK") {                  
                  this.selectedUser = response.data.user;                      
                  this.makeToast(response.data.msg);                  
              }                                     
          })
          .catch(error => {                              
              console.log(error);
          });
    },
    changeRole() {
      this.selectedUser.role=this.selectedRole.value;
    },
    exit: function() {
      this.$router.push("/AdminDashboard");
    },
    makeToast(string) {        
      this.$q.notify({color: 'green-4', textColor: 'white', icon: 'info', message: string});
    } 
  },
  components: {
    ValidationProvider,
    ValidationObserver
  },
  computed: mapState({
    user: 'user',      
    }),
    created() {
      this.getAllUsers();
    },
    beforeRouteEnter(to, from, next) {
    var currentUser = Store.state.user;
    console.log(currentUser);
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