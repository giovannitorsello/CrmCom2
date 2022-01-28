(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[8],{"46b2":function(e,t,s){"use strict";s("6c92")},"6c92":function(e,t,s){},"94eb":function(e,t,s){"use strict";s.r(t);var a=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{attrs:{id:"customers"}},[a("h6",[e._v("\n    Gestione del cliente\n    "),a("strong",[e._v(e._s(e.customerDescription))])]),a("ValidationObserver",{ref:"obs",scopedSlots:e._u([{key:"default",fn:function(t){return[a("img",{staticStyle:{width:"48px",height:"48px"},attrs:{src:s("f32a"),disabled:t.invalid},on:{click:e.newCustomer}}),a("img",{staticStyle:{width:"48px",height:"48px"},attrs:{src:s("40b4"),disabled:t.invalid},on:{click:e.saveCustomer}}),a("img",{staticStyle:{width:"48px",height:"48px"},attrs:{src:s("c8ed")},on:{click:e.deleteCustomer}}),a("img",{staticStyle:{width:"48px",height:"48px"},attrs:{src:s("5df3")},on:{click:e.exit}}),a("q-form",{ref:"customerForm",staticClass:"q-gutter-md"},[a("div",{staticClass:"row"},[a("div",{staticClass:"col"},[a("q-toggle",{attrs:{label:"Azienda"},model:{value:e.isCompany,callback:function(t){e.isCompany=t},expression:"isCompany"}})],1),a("div",{staticClass:"col"},[a("q-checkbox",{attrs:{label:"Da fatturare"},on:{input:function(t){return e.changeBusinness()}},model:{value:e.isBusinness,callback:function(t){e.isBusinness=t},expression:"isBusinness"}})],1)]),a("q-tabs",{staticClass:"text-teal",model:{value:e.tab,callback:function(t){e.tab=t},expression:"tab"}},[a("q-tab",{attrs:{name:"person",icon:"face",label:""}},[a("p",[e._v("\n            Intestatario\n            "),a("br"),e._v("Legale rappresentate\n          ")])]),a("q-tab",{attrs:{name:"address",icon:"contacts",label:"Indirizzo"}}),e.isCompany?a("q-tab",{attrs:{name:"company",icon:"building",label:"Azienda"}}):e._e(),a("q-tab",{attrs:{name:"contacts",icon:"phone",label:"Contatti"}}),a("q-tab",{attrs:{name:"security",icon:"security",label:"Credenziali"}})],1),a("q-separator"),a("q-tab-panels",{attrs:{animated:""},model:{value:e.tab,callback:function(t){e.tab=t},expression:"tab"}},[a("q-tab-panel",{attrs:{name:"person"}},[a("div",{staticClass:"row"},[a("div",{staticClass:"col"},[a("ValidationProvider",{attrs:{name:"Nome",immediate:"",rules:"required|alpha_spaces_apostrophe"},scopedSlots:e._u([{key:"default",fn:function(t){var s=t.errors;return[a("q-input",{attrs:{label:"Nome"},model:{value:e.selectedCustomer.firstname,callback:function(t){e.$set(e.selectedCustomer,"firstname",t)},expression:"selectedCustomer.firstname"}}),a("span",{staticClass:"error"},[e._v(e._s(s[0]))])]}}],null,!0)}),a("ValidationProvider",{attrs:{name:"Cognome",immediate:"",rules:"required|alpha_spaces_apostrophe"},scopedSlots:e._u([{key:"default",fn:function(t){var s=t.errors;return[a("q-input",{attrs:{label:"Cognome"},model:{value:e.selectedCustomer.lastname,callback:function(t){e.$set(e.selectedCustomer,"lastname",t)},expression:"selectedCustomer.lastname"}}),a("span",{staticClass:"error"},[e._v(e._s(s[0]))])]}}],null,!0)}),a("ValidationProvider",{attrs:{name:"Codice Fiscale",immediate:"",rules:"required|codfis"},scopedSlots:e._u([{key:"default",fn:function(t){var s=t.errors;return[a("q-input",{attrs:{label:"Codice Fiscale"},model:{value:e.selectedCustomer.codfis,callback:function(t){e.$set(e.selectedCustomer,"codfis",t)},expression:"selectedCustomer.codfis"}}),a("span",{staticClass:"error"},[e._v(e._s(s[0]))])]}}],null,!0)})],1)])]),a("q-tab-panel",{attrs:{name:"address"}},[a("div",{staticClass:"row"},[a("div",{staticClass:"col"},[a("ValidationProvider",{attrs:{name:"Indirizzo",immediate:"",rules:"required|address"},scopedSlots:e._u([{key:"default",fn:function(t){var s=t.errors;return[a("q-input",{attrs:{label:"Indirizzo"},model:{value:e.selectedCustomer.address,callback:function(t){e.$set(e.selectedCustomer,"address",t)},expression:"selectedCustomer.address"}}),a("span",{staticClass:"error"},[e._v(e._s(s[0]))])]}}],null,!0)}),a("ValidationProvider",{attrs:{name:"CAP",immediate:"",rules:"required|alpha_num"},scopedSlots:e._u([{key:"default",fn:function(t){var s=t.errors;return[a("q-input",{attrs:{label:"CAP"},model:{value:e.selectedCustomer.postalcode,callback:function(t){e.$set(e.selectedCustomer,"postalcode",t)},expression:"selectedCustomer.postalcode"}}),a("span",{staticClass:"error"},[e._v(e._s(s[0]))])]}}],null,!0)}),a("ValidationProvider",{attrs:{name:"Città",immediate:"",rules:"required|alpha"},scopedSlots:e._u([{key:"default",fn:function(t){var s=t.errors;return[a("q-input",{attrs:{label:"Città"},model:{value:e.selectedCustomer.city,callback:function(t){e.$set(e.selectedCustomer,"city",t)},expression:"selectedCustomer.city"}}),a("span",{staticClass:"error"},[e._v(e._s(s[0]))])]}}],null,!0)}),a("ValidationProvider",{attrs:{name:"Stato",immediate:"",rules:"required|alpha"},scopedSlots:e._u([{key:"default",fn:function(t){var s=t.errors;return[a("q-input",{attrs:{label:"Stato"},model:{value:e.selectedCustomer.state,callback:function(t){e.$set(e.selectedCustomer,"state",t)},expression:"selectedCustomer.state"}}),a("span",{staticClass:"error"},[e._v(e._s(s[0]))])]}}],null,!0)})],1)])]),a("q-tab-panel",{attrs:{name:"company"}},[e.isCompany?a("div",{attrs:{id:"companyFields"}},[a("div",{staticClass:"row"},[a("div",{staticClass:"col"},[a("ValidationProvider",{attrs:{name:"Denominazone Azienda",immediate:"",rules:"required"},scopedSlots:e._u([{key:"default",fn:function(t){var s=t.errors;return[a("q-input",{attrs:{label:"Denominazione Azienda"},model:{value:e.selectedCustomer.company,callback:function(t){e.$set(e.selectedCustomer,"company",t)},expression:"selectedCustomer.company"}}),a("span",{staticClass:"error"},[e._v(e._s(s[0]))])]}}],null,!0)}),a("ValidationProvider",{attrs:{name:"Indirizzo Sede Azienda",immediate:"",rules:"required|address"},scopedSlots:e._u([{key:"default",fn:function(t){var s=t.errors;return[a("q-input",{attrs:{label:"Indirizzo Sede Azienda"},model:{value:e.selectedCustomer.companyaddress,callback:function(t){e.$set(e.selectedCustomer,"companyaddress",t)},expression:"selectedCustomer.companyaddress"}}),a("span",{staticClass:"error"},[e._v(e._s(s[0]))])]}}],null,!0)}),a("ValidationProvider",{attrs:{name:"Telefono principale aziendale",immediate:"",rules:"required|phone"},scopedSlots:e._u([{key:"default",fn:function(t){var s=t.errors;return[a("q-input",{attrs:{label:"Telefono principale aziendale",type:"tel"},model:{value:e.selectedCustomer.companyphone,callback:function(t){e.$set(e.selectedCustomer,"companyphone",t)},expression:"selectedCustomer.companyphone"}}),a("span",{staticClass:"error"},[e._v(e._s(s[0]))])]}}],null,!0)})],1)]),a("div",{staticClass:"row"},[a("div",{staticClass:"col"},[a("ValidationProvider",{attrs:{name:"Partita IVA",rules:"required|vatcode"},scopedSlots:e._u([{key:"default",fn:function(t){var s=t.errors;return[a("q-input",{attrs:{label:"Partita IVA"},model:{value:e.selectedCustomer.vatcode,callback:function(t){e.$set(e.selectedCustomer,"vatcode",t)},expression:"selectedCustomer.vatcode"}}),a("span",{staticClass:"error"},[e._v(e._s(s[0]))])]}}],null,!0)}),a("ValidationProvider",{attrs:{name:"Codice univoco SDI",rules:"required|alpha_num"},scopedSlots:e._u([{key:"default",fn:function(t){var s=t.errors;return[a("q-input",{attrs:{label:"Codice Univoco SDI"},model:{value:e.selectedCustomer.sdicode,callback:function(t){e.$set(e.selectedCustomer,"sdicode",t)},expression:"selectedCustomer.sdicode"}}),a("span",{staticClass:"error"},[e._v(e._s(s[0]))])]}}],null,!0)}),a("ValidationProvider",{attrs:{name:"Email PEC",rules:"required|email"},scopedSlots:e._u([{key:"default",fn:function(t){var s=t.errors;return[a("q-input",{attrs:{label:"Email PEC",type:"email"},model:{value:e.selectedCustomer.companypec,callback:function(t){e.$set(e.selectedCustomer,"companypec",t)},expression:"selectedCustomer.companypec"}}),a("span",{staticClass:"error"},[e._v(e._s(s[0]))])]}}],null,!0)})],1)])]):e._e()]),a("q-tab-panel",{attrs:{name:"contacts"}},[a("div",{staticClass:"row .offset-md-4"},[a("div",{staticClass:"col"},[a("ValidationProvider",{attrs:{name:"Email",immediate:"",rules:"required|email"},scopedSlots:e._u([{key:"default",fn:function(t){var s=t.errors;return[a("q-input",{attrs:{label:"Email",change:e.changeEmail(),type:"email"},model:{value:e.selectedCustomer.email,callback:function(t){e.$set(e.selectedCustomer,"email",t)},expression:"selectedCustomer.email"}}),a("span",{staticClass:"error"},[e._v(e._s(s[0]))])]}}],null,!0)}),a("ValidationProvider",{attrs:{name:"Tel. Mobile",immediate:"",rules:"required|phone"},scopedSlots:e._u([{key:"default",fn:function(t){var s=t.errors;return[a("q-input",{attrs:{label:"Tel. Mobile",type:"tel"},model:{value:e.selectedCustomer.mobilephone,callback:function(t){e.$set(e.selectedCustomer,"mobilephone",t)},expression:"selectedCustomer.mobilephone"}}),a("span",{staticClass:"error"},[e._v(e._s(s[0]))])]}}],null,!0)}),a("ValidationProvider",{attrs:{name:"Tel. Fisso",immediate:"",rules:"required|phone"},scopedSlots:e._u([{key:"default",fn:function(t){var s=t.errors;return[a("q-input",{attrs:{label:"Tel. Fisso",type:"tel"},model:{value:e.selectedCustomer.phone,callback:function(t){e.$set(e.selectedCustomer,"phone",t)},expression:"selectedCustomer.phone"}}),a("span",{staticClass:"error"},[e._v(e._s(s[0]))])]}}],null,!0)})],1)])]),a("q-tab-panel",{attrs:{name:"security"}},[a("div",{staticClass:"row"},[a("div",{staticClass:"col"},[a("ValidationProvider",{attrs:{name:"Nome utente",immediate:"",rules:"required|email"},scopedSlots:e._u([{key:"default",fn:function(t){var s=t.errors;return[a("q-input",{attrs:{label:"Nome utente"},model:{value:e.selectedCustomer.username,callback:function(t){e.$set(e.selectedCustomer,"username",t)},expression:"selectedCustomer.username"}}),a("span",{staticClass:"error"},[e._v(e._s(s[0]))])]}}],null,!0)}),a("ValidationProvider",{attrs:{name:"Password",immediate:"",rules:"required"},scopedSlots:e._u([{key:"default",fn:function(t){var s=t.errors;return[a("q-input",{attrs:{label:"Password",filled:"",type:e.isPwd?"password":"text"},scopedSlots:e._u([{key:"append",fn:function(){return[a("q-icon",{staticClass:"cursor-pointer",attrs:{name:e.isPwd?"visibility_off":"visibility"},on:{click:function(t){e.isPwd=!e.isPwd}}})]},proxy:!0}],null,!0),model:{value:e.selectedCustomer.password,callback:function(t){e.$set(e.selectedCustomer,"password",t)},expression:"selectedCustomer.password"}}),a("span",{staticClass:"error"},[e._v(e._s(s[0]))])]}}],null,!0)})],1)])])],1)],1)]}}])}),a("q-separator",{attrs:{vertical:"",inset:""}}),a("q-btn",{on:{click:e.addContract}},[e._v("Aggiungi contratto")]),e.contracts?a("div",[a("q-table",{attrs:{title:"Contratti",data:e.contracts,columns:e.columnsTableContracts,"row-key":"id","virtual-scroll":"",pagination:e.pagination,"rows-per-page-options":[0]},on:{"update:pagination":function(t){e.pagination=t},"row-click":e.openContract},scopedSlots:e._u([{key:"header",fn:function(t){return[a("q-tr",{attrs:{props:t}},[a("q-th",{attrs:{"auto-width":""}}),e._l(t.cols,(function(s){return a("q-th",{key:s.name,attrs:{props:t}},[e._v(e._s(s.label))])}))],2)]}},{key:"body",fn:function(t){return[a("q-tr",{class:t.row.state,attrs:{props:t},nativeOn:{click:function(s){return e.selectContract(t.row)}}},[a("q-td",{attrs:{"auto-width":""}},[a("img",{staticStyle:{width:"32px",height:"32px"},attrs:{src:s("d8f6")},on:{click:function(s){return e.openContract(t.row)}}}),a("img",{staticStyle:{width:"32px",height:"32px",xfill:"green"},attrs:{src:s("a3a3")},on:{click:function(s){return e.activateContract(t.row)}}}),a("img",{staticStyle:{width:"32px",height:"32px",xfill:"red"},attrs:{src:s("9b70")},on:{click:function(s){return e.suspendContract(t.row)}}}),a("img",{staticStyle:{width:"32px",height:"32px",xfill:"gray"},attrs:{src:s("c8ed")},on:{click:function(s){return e.deleteContract(t.row)}}})]),e._l(t.cols,(function(s){return a("q-td",{key:s.name,attrs:{props:t}},[e._v(e._s(s.value))])}))],2)]}}],null,!1,4270569272)})],1):e._e()],1)},o=[],r=(s("e01a"),s("2f62")),n=s("4360"),i=s("7bb1"),l=s("2ee0"),c={data(){return{tab:"person",isPwd:!0,isCompany:!1,isBusinness:!0,selectedCustomer:{},selectedContract:{},contracts:[],contractClassStyleRow:"",pagination:{rowsPerPage:0},columnsTableContracts:[{name:"actions",label:"Azioni"},{name:"Stato",label:"state",field:e=>e.state},{name:"description",label:"Descrizione",field:e=>e.description,sortable:!0},{name:"address",label:"Indirizzo",field:e=>e.address,sortable:!0},{name:"duration",label:"Durata",field:e=>e.duration},{name:"createdAt",label:"Data inserimento",field:e=>e.createdAt}],columnsTableDevices:[{name:"description",label:"Descrizione",field:e=>e.description,sortable:!0},{name:"ipv4",label:"Ip",field:e=>e.address,sortable:!0},{name:"mac",label:"Mac",field:e=>e.duration},{name:"Stato",label:"state",field:e=>e.state}]}},methods:{addContract:function(){this.$store.commit("changeCustomer",this.selectedCustomer),this.$store.commit("changeContract",{}),this.$router.push("/Contract")},openContract:function(e){this.$store.commit("changeContract",e),this.$router.push("/Contract")},selectContract:function(e){this.selectContract=e,this.$store.commit("changeContract",e)},activateContract:function(e){e.state="active",this.$axios.post("/adminarea/contract/update",{contract:e}).then((e=>{"OK"===e.data.status&&(this.selectedContract=e.data.contract,this.$store.commit("changeContract",this.selectedContract))})).catch((e=>{console.log(e)}))},suspendContract:function(e){e.state="suspended",this.$axios.post("/adminarea/contract/update",{contract:e}).then((e=>{"OK"===e.data.status&&(this.selectedContract=e.data.contract,this.$store.commit("changeContract",this.selectedContract))})).catch((e=>{console.log(e)}))},deleteContract:function(e){const t=confirm("Confermi la cancellazione?");return t&&this.$axios.post("/adminarea/contract/delete",{contract:e}).then((e=>{"OK"===e.data.status&&(this.selectedContract=e.data.contract,this.$store.commit("changeContract",{}),this.getCustomerContracts())})).catch((e=>{console.log(e)})),""},getCustomerData:function(){this.$store.state.customer&&(this.selectedCustomer=Object.assign({},this.$store.state.customer),this.selectedCustomer.vatcode&&""!==this.selectedCustomer.vatcode?(this.isCompany=!0,this.tab="company"):this.isCompany=!1,this.isBusinness=this.selectedCustomer.businessflag,this.getCustomerContracts())},getCustomerContracts:function(){this.$store;this.showCustomerSearch=!0,this.$axios.post("/adminarea/contract/get_all_by_customer",{idCustomer:this.selectedCustomer.id}).then((e=>{"OK"===e.data.status&&(this.contracts=e.data.contracts)})).catch((e=>{console.log(e)}))},changeCustomerType:function(){!1===this.isCompanyBtn.value?(this.selectedCustomer.vatcode="",this.isCompanyBtn.value=!0,this.isCompanyBtn.caption="<span><i class='fa fa-industry'></i> Azienda</span>"):!0===this.isCompanyBtn.value&&(this.selectedCustomer.vatcode="",this.isCompanyBtn.value=!1,this.isCompanyBtn.caption="<span><i class='fa fa-home'></i> Privato</span>"),this.isCompany=this.isCompanyBtn.value},changeBusinness:function(){!1===this.isBusinness?this.selectedCustomer.businessflag=!1:!0===this.isBusinness&&(this.selectedCustomer.businessflag=!0)},changeEmail:function(){this.selectedCustomer.username=this.selectedCustomer.email,this.selectedCustomer.password=this.randomPassword(8)},randomPassword:function(e){var t="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz@!#[]{}£$%&^?=().,;:",s=e,a=Array(s).fill(t).map((function(e){return e[Math.floor(Math.random()*e.length)]})).join("");return a},newCustomer:function(){this.selectedCustomer={},this.contracts=[],this.selectedContract={},this.$store.commit("changeCustomer",this.selectedCustomer)},async saveCustomer(){!1===this.isCompany&&(console.log("Set company field empty. User is not a company"),this.selectedCustomer.vatcode="",this.selectedCustomer.sdicode="",this.selectedCustomer.company="",this.selectedCustomer.companyphone="",this.selectedCustomer.companyaddress="",this.selectedCustomer.companypec=""),this.$axios.post("/adminarea/customer/update",{customer:this.selectedCustomer}).then((e=>{"OK"===e.data.status&&(this.selectedCustomer=e.data.customer,this.$store.commit("changeCustomer",this.selectedCustomer),this.makeToast(e.data.msg),this.getCustomerData())})).catch((e=>{console.log(e)}))},deleteCustomer:function(){const e=confirm("Confermi la cancellazione?");e&&this.$axios.post("/adminarea/customer/delete",{customer:this.selectedCustomer}).then((e=>{"OK"===e.data.status&&(this.selectedCustomer=e.data.customer,this.$store.commit("changeCustomer",this.selectedCustomer),this.makeToast(e.data.msg),this.getCustomerData())})).catch((e=>{console.log(e)}))},exit:function(){this.$router.push("/AdminDashboard")},makeToast(e){this.$q.notify({color:"green-4",textColor:"white",icon:"info",message:e})}},mounted(){l["a"].setup(),this.getCustomerData()},computed:Object(r["b"])({user:"user",customer:"customer",customerDescription(){const e=this.customer;return e.vatcode&&""!==e.vatcode?e.company:e.lastname&&e.firstname?e.lastname+" "+e.firstname:"Ricerca o inserisci un nuovo cliente"}}),components:{ValidationProvider:i["b"],ValidationObserver:i["a"]},beforeRouteEnter(e,t,s){var a=n["a"].state.user;"admin"===a.role||"manager"===a.role||"technician"===a.role?s():s("/Login")}},d=c,u=(s("46b2"),s("2877")),m=s("0378"),p=s("9564"),C=s("8f8e"),h=s("429b"),f=s("7460"),v=s("eb85"),b=s("adad"),y=s("823b"),_=s("27f9"),g=s("0016"),k=s("9c40"),q=s("eaac"),x=s("bd08"),w=s("357e"),$=s("db86"),S=s("eebe"),P=s.n(S),z=Object(u["a"])(d,a,o,!1,null,"272cce62",null);t["default"]=z.exports;P()(z,"components",{QForm:m["a"],QToggle:p["a"],QCheckbox:C["a"],QTabs:h["a"],QTab:f["a"],QSeparator:v["a"],QTabPanels:b["a"],QTabPanel:y["a"],QInput:_["a"],QIcon:g["a"],QBtn:k["a"],QTable:q["a"],QTr:x["a"],QTh:w["a"],QTd:$["a"]})}}]);