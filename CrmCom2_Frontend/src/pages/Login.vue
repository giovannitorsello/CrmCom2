
<template>
  
  <div id="login" class="absolute-center q-pa-md" style="max-width: 400px">
    
    <q-form ref="loginForm" @submit="onSubmit" @reset="onReset" class="q-gutter-md">
       <q-img
          src="/icons/logo_wifinetcom.png"
        />
      <q-input
        label="Nome utente"
        v-model="username"
        type="text"
        lazy-rules
        :rules="[ val => val && val.length > 0]"
      />
      <q-input
        label="Password"
        v-model="password"
        type="password"
        lazy-rules
        :rules="[ val => val && val.length > 0]"
      />

      <div>
        <q-btn label="Login" type="submit" color="primary" />
        <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
      </div>
    </q-form>
  </div>
</template>

<script lang="js">
import { mapState } from 'vuex'


export default {
  data() {
    return { username: 'admin', password: 'admin', accept: false}
  },
  methods: {
    onSubmit () {
      this.$refs.loginForm.validate().then(success => {
        if(success)
          this.login();
        else
          this.$q.notify({color: 'red-5',textColor: 'white',icon: 'warning',message: 'Inserisci le credenziali di accesso'});
      });
    },
    onReset () {
      this.username = null;
      this.password = null;
      this.accept = false;
      this.$refs.loginForm.resetValidation();
    },
    
    login() {
      const store=this.$store;
      this.$axios.post('/adminarea/login', {username: this.username, password: this.password})
      .then((response) => {                     
                if(response.data.status==="OK"){
                  const user=response.data.user;                                    
                  store.commit("changeUser", response.data.user);
                  this.initSession();
                  this.$q.notify({color: 'green-4', textColor: 'white', icon: 'cloud_done', message: 'Avvio connessione'});
                  if(user.role=="admin")      this.$router.push("/MainLayout");
                  if(user.role=="manager")    this.$router.push("/MainLayout");
                  if(user.role=="technician") this.$router.push("/MainLayout");
                  if(user.role=="installer")  this.$router.push("/MainLayout");                  
                  if(user.role=="seller")     this.$router.push("/MainLayout");
                }
                else {
                  this.$q.notify({color: 'red-4', textColor: 'white', icon: 'error', message: 'Credenziali errate'});
                }
            })
            .catch(function (error) {
                console.log(error);
                this.$q.notify({color: 'red-5', textColor: 'white', icon: 'error', message: 'Il server non risponde'});
            });
    },
    initSession() {
      this.$store.commit("changeCustomer", {});
      this.$store.commit("changeContract", {});
      this.$store.commit("changeService", {});
      this.$store.commit("changeServiceTemplate", {});
      this.$store.commit("changeInvoice", {});
      this.$store.commit("changeInvoiceEntry", {});
      this.$store.commit("changeDeviceCustomer", {});
      this.$store.commit("changeDeviceBackbone", {});
      this.$store.commit("changeSiteBackbone", {});
    }
  },
  computed: mapState({user: 'user'})
}
</script>

<style>
p.errorValidationClass {
  font-size: 10pt;
  color: red;
}
</style>