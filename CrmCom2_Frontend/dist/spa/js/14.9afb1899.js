(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[14],{"3b35":function(e,t,a){},"442e":function(e,t,a){"use strict";a.r(t);var s=function(){var e=this,t=e.$createElement,s=e._self._c||t;return s("div",{attrs:{id:"olos"}},[s("h6",[e._v("\n    Gestione OLO companies\n    "),s("strong",[e._v(e._s(e.selectedOlo.company))])]),s("img",{staticStyle:{width:"48px",height:"48px"},attrs:{src:a("f32a")},on:{click:e.newOlo}}),s("img",{staticStyle:{width:"48px",height:"48px"},attrs:{src:a("40b4")},on:{click:e.saveOlo}}),s("img",{staticStyle:{width:"48px",height:"48px"},attrs:{src:a("c8ed")},on:{click:e.deleteOlo}}),s("ValidationObserver",{ref:"formOlo"},[s("q-form",{ref:"oloForm",staticClass:"q-gutter-md"},[s("q-tabs",{staticClass:"text-teal",model:{value:e.tab,callback:function(t){e.tab=t},expression:"tab"}},[s("q-tab",{attrs:{name:"company",icon:"face",label:"Company"}}),s("q-tab",{attrs:{name:"assurancePhase2",icon:"contacts",label:"Assurance Phase 2"}}),s("q-tab",{attrs:{name:"assurancePhase3",icon:"contacts",label:"Assurance Phase 3"}}),s("q-tab",{attrs:{name:"service",icon:"computer",label:"Servizio di scambio"}}),s("q-tab",{attrs:{name:"migrationMod",icon:"contacts",label:"Modalità di Migrazione"}})],1),s("q-separator"),s("q-tab-panels",{attrs:{animated:""},model:{value:e.tab,callback:function(t){e.tab=t},expression:"tab"}},[s("q-tab-panel",{attrs:{name:"company"}},[s("div",{staticClass:"row"},[s("div",{staticClass:"col"},[s("ValidationProvider",{attrs:{name:"company",immediate:"",rules:"required|alpha_spaces"},scopedSlots:e._u([{key:"default",fn:function(t){var a=t.errors;return[s("q-input",{attrs:{label:"Company"},model:{value:e.selectedOlo.company,callback:function(t){e.$set(e.selectedOlo,"company",t)},expression:"selectedOlo.company"}}),s("span",{staticClass:"error"},[e._v(e._s(a[0]))])]}}])}),s("ValidationProvider",{attrs:{name:"cow",immediate:"",rules:"required|alpha"},scopedSlots:e._u([{key:"default",fn:function(t){var a=t.errors;return[s("q-input",{attrs:{label:"cow"},model:{value:e.selectedOlo.cow,callback:function(t){e.$set(e.selectedOlo,"cow",t)},expression:"selectedOlo.cow"}}),s("span",{staticClass:"error"},[e._v(e._s(a[0]))])]}}])}),s("ValidationProvider",{attrs:{name:"mailConsumer",immediate:"",rules:"email"},scopedSlots:e._u([{key:"default",fn:function(t){var a=t.errors;return[s("q-input",{attrs:{label:"Mail consumer"},model:{value:e.selectedOlo.mailConsumer,callback:function(t){e.$set(e.selectedOlo,"mailConsumer",t)},expression:"selectedOlo.mailConsumer"}}),s("span",{staticClass:"error"},[e._v(e._s(a[0]))])]}}])}),s("ValidationProvider",{attrs:{name:"mailCorporate",immediate:"",rules:"email"},scopedSlots:e._u([{key:"default",fn:function(t){var a=t.errors;return[s("q-input",{attrs:{label:"Mail corporate"},model:{value:e.selectedOlo.mailCorporate,callback:function(t){e.$set(e.selectedOlo,"mailCorporate",t)},expression:"selectedOlo.mailCorporate"}}),s("span",{staticClass:"error"},[e._v(e._s(a[0]))])]}}])})],1)])]),s("q-tab-panel",{attrs:{name:"assurancePhase2"}},[s("div",{staticClass:"row"},[s("div",{staticClass:"col"},[s("ValidationProvider",{attrs:{name:"contactAssurancePhase2FirstName",immediate:"",rules:"alpha"},scopedSlots:e._u([{key:"default",fn:function(t){var a=t.errors;return[s("q-input",{attrs:{label:"Nome"},model:{value:e.selectedOlo.contactAssurancePhase2FirstName,callback:function(t){e.$set(e.selectedOlo,"contactAssurancePhase2FirstName",t)},expression:"selectedOlo.contactAssurancePhase2FirstName"}}),s("span",{staticClass:"error"},[e._v(e._s(a[0]))])]}}])}),s("ValidationProvider",{attrs:{name:"contactAssurancePhase2LastName",immediate:"",rules:"alpha"},scopedSlots:e._u([{key:"default",fn:function(t){var a=t.errors;return[s("q-input",{attrs:{label:"Cognome"},model:{value:e.selectedOlo.contactAssurancePhase2LastName,callback:function(t){e.$set(e.selectedOlo,"contactAssurancePhase2LastName",t)},expression:"selectedOlo.contactAssurancePhase2LastName"}}),s("span",{staticClass:"error"},[e._v(e._s(a[0]))])]}}])}),s("ValidationProvider",{attrs:{name:"contactAssurancePhase2Phone",immediate:"",rules:"phone"},scopedSlots:e._u([{key:"default",fn:function(t){var a=t.errors;return[s("q-input",{attrs:{label:"Phone"},model:{value:e.selectedOlo.contactAssurancePhase2Phone,callback:function(t){e.$set(e.selectedOlo,"contactAssurancePhase2Phone",t)},expression:"selectedOlo.contactAssurancePhase2Phone"}}),s("span",{staticClass:"error"},[e._v(e._s(a[0]))])]}}])}),s("ValidationProvider",{attrs:{name:"contactAssurancePhase2Mail",immediate:"",rules:"email"},scopedSlots:e._u([{key:"default",fn:function(t){var a=t.errors;return[s("q-input",{attrs:{label:"Email"},model:{value:e.selectedOlo.contactAssurancePhase2Mail,callback:function(t){e.$set(e.selectedOlo,"contactAssurancePhase2Mail",t)},expression:"selectedOlo.contactAssurancePhase2Mail"}}),s("span",{staticClass:"error"},[e._v(e._s(a[0]))])]}}])})],1)])]),s("q-tab-panel",{attrs:{name:"assurancePhase3"}},[s("div",{staticClass:"row"},[s("div",{staticClass:"col"},[s("ValidationProvider",{attrs:{name:"contactAssurancePhase3FirstName",immediate:"",rules:"alpha"},scopedSlots:e._u([{key:"default",fn:function(t){var a=t.errors;return[s("q-input",{attrs:{label:"Nome"},model:{value:e.selectedOlo.contactAssurancePhase3FirstName,callback:function(t){e.$set(e.selectedOlo,"contactAssurancePhase3FirstName",t)},expression:"selectedOlo.contactAssurancePhase3FirstName"}}),s("span",{staticClass:"error"},[e._v(e._s(a[0]))])]}}])}),s("ValidationProvider",{attrs:{name:"contactAssurancePhase3LastName",immediate:"",rules:"alpha"},scopedSlots:e._u([{key:"default",fn:function(t){var a=t.errors;return[s("q-input",{attrs:{label:"Cognome"},model:{value:e.selectedOlo.contactAssurancePhase3LastName,callback:function(t){e.$set(e.selectedOlo,"contactAssurancePhase3LastName",t)},expression:"selectedOlo.contactAssurancePhase3LastName"}}),s("span",{staticClass:"error"},[e._v(e._s(a[0]))])]}}])}),s("ValidationProvider",{attrs:{name:"contactAssurancePhase3Phone",immediate:"",rules:"phone"},scopedSlots:e._u([{key:"default",fn:function(t){var a=t.errors;return[s("q-input",{attrs:{label:"Phone"},model:{value:e.selectedOlo.contactAssurancePhase3Phone,callback:function(t){e.$set(e.selectedOlo,"contactAssurancePhase3Phone",t)},expression:"selectedOlo.contactAssurancePhase3Phone"}}),s("span",{staticClass:"error"},[e._v(e._s(a[0]))])]}}])}),s("ValidationProvider",{attrs:{name:"contactAssurancePhase3Mail",immediate:"",rules:"email"},scopedSlots:e._u([{key:"default",fn:function(t){var a=t.errors;return[s("q-input",{attrs:{label:"Email"},model:{value:e.selectedOlo.contactAssurancePhase3Mail,callback:function(t){e.$set(e.selectedOlo,"contactAssurancePhase3Mail",t)},expression:"selectedOlo.contactAssurancePhase3Mail"}}),s("span",{staticClass:"error"},[e._v(e._s(a[0]))])]}}])}),s("ValidationProvider",{attrs:{name:"contactAssurancePhase3Service",immediate:"",rules:""},scopedSlots:e._u([{key:"default",fn:function(t){var a=t.errors;return[s("q-input",{attrs:{label:"Email"},model:{value:e.selectedOlo.contactAssurancePhase3Service,callback:function(t){e.$set(e.selectedOlo,"contactAssurancePhase3Service",t)},expression:"selectedOlo.contactAssurancePhase3Service"}}),s("span",{staticClass:"error"},[e._v(e._s(a[0]))])]}}])})],1)])]),s("q-tab-panel",{attrs:{name:"service"}},[s("div",{staticClass:"row"},[s("div",{staticClass:"col"},[s("ValidationProvider",{attrs:{name:"serviceProtocol",immediate:"",rules:"alpha"},scopedSlots:e._u([{key:"default",fn:function(t){var a=t.errors;return[s("q-input",{attrs:{label:"Protocol"},model:{value:e.selectedOlo.serviceProtocol,callback:function(t){e.$set(e.selectedOlo,"serviceProtocol",t)},expression:"selectedOlo.serviceProtocol"}}),s("span",{staticClass:"error"},[e._v(e._s(a[0]))])]}}])}),s("ValidationProvider",{attrs:{name:"serviceDns",immediate:"",rules:""},scopedSlots:e._u([{key:"default",fn:function(t){var a=t.errors;return[s("q-input",{attrs:{label:"service Dns"},model:{value:e.selectedOlo.serviceDns,callback:function(t){e.$set(e.selectedOlo,"serviceDns",t)},expression:"selectedOlo.serviceDns"}}),s("span",{staticClass:"error"},[e._v(e._s(a[0]))])]}}])}),s("ValidationProvider",{attrs:{name:"servicePort",immediate:"",rules:"phone"},scopedSlots:e._u([{key:"default",fn:function(t){var a=t.errors;return[s("q-input",{attrs:{label:"Service port"},model:{value:e.selectedOlo.servicePort,callback:function(t){e.$set(e.selectedOlo,"servicePort",t)},expression:"selectedOlo.servicePort"}}),s("span",{staticClass:"error"},[e._v(e._s(a[0]))])]}}])}),s("ValidationProvider",{attrs:{name:"serviceContext",immediate:"",rules:""},scopedSlots:e._u([{key:"default",fn:function(t){var a=t.errors;return[s("q-input",{attrs:{label:"Service context"},model:{value:e.selectedOlo.serviceContext,callback:function(t){e.$set(e.selectedOlo,"serviceContext",t)},expression:"selectedOlo.serviceContext"}}),s("span",{staticClass:"error"},[e._v(e._s(a[0]))])]}}])}),s("ValidationProvider",{attrs:{name:"serviceComponent",immediate:"",rules:""},scopedSlots:e._u([{key:"default",fn:function(t){var a=t.errors;return[s("q-input",{attrs:{label:"Service component"},model:{value:e.selectedOlo.serviceComponent,callback:function(t){e.$set(e.selectedOlo,"serviceComponent",t)},expression:"selectedOlo.serviceComponent"}}),s("span",{staticClass:"error"},[e._v(e._s(a[0]))])]}}])}),s("ValidationProvider",{attrs:{name:"serviceOperator",immediate:"",rules:""},scopedSlots:e._u([{key:"default",fn:function(t){var a=t.errors;return[s("q-input",{attrs:{label:"Service operator"},model:{value:e.selectedOlo.serviceOperator,callback:function(t){e.$set(e.selectedOlo,"serviceOperator",t)},expression:"selectedOlo.serviceOperator"}}),s("span",{staticClass:"error"},[e._v(e._s(a[0]))])]}}])}),s("ValidationProvider",{attrs:{name:"serviceFileType",immediate:"",rules:""},scopedSlots:e._u([{key:"default",fn:function(t){var a=t.errors;return[s("q-input",{attrs:{label:"Service filetype"},model:{value:e.selectedOlo.serviceFileType,callback:function(t){e.$set(e.selectedOlo,"serviceFileType",t)},expression:"selectedOlo.serviceFileType"}}),s("span",{staticClass:"error"},[e._v(e._s(a[0]))])]}}])}),s("ValidationProvider",{attrs:{name:"serviceFileName",immediate:"",rules:""},scopedSlots:e._u([{key:"default",fn:function(t){var a=t.errors;return[s("q-input",{attrs:{label:"Service filename"},model:{value:e.selectedOlo.serviceFileName,callback:function(t){e.$set(e.selectedOlo,"serviceFileName",t)},expression:"selectedOlo.serviceFileName"}}),s("span",{staticClass:"error"},[e._v(e._s(a[0]))])]}}])}),s("ValidationProvider",{attrs:{name:"serviceUrl",immediate:"",rules:""},scopedSlots:e._u([{key:"default",fn:function(t){var a=t.errors;return[s("q-input",{attrs:{label:"Service url"},model:{value:e.selectedOlo.serviceUrl,callback:function(t){e.$set(e.selectedOlo,"serviceUrl",t)},expression:"selectedOlo.serviceUrl"}}),s("span",{staticClass:"error"},[e._v(e._s(a[0]))])]}}])}),s("ValidationProvider",{attrs:{name:"serviceCertificates",immediate:"",rules:""},scopedSlots:e._u([{key:"default",fn:function(t){var a=t.errors;return[s("q-input",{attrs:{label:"Service certificates"},model:{value:e.selectedOlo.serviceCertificates,callback:function(t){e.$set(e.selectedOlo,"serviceCertificates",t)},expression:"selectedOlo.serviceCertificates"}}),s("span",{staticClass:"error"},[e._v(e._s(a[0]))])]}}])}),s("ValidationProvider",{attrs:{name:"serviceClientType",immediate:"",rules:""},scopedSlots:e._u([{key:"default",fn:function(t){var a=t.errors;return[s("q-input",{attrs:{label:"Service clientitype"},model:{value:e.selectedOlo.serviceClientType,callback:function(t){e.$set(e.selectedOlo,"serviceClientType",t)},expression:"selectedOlo.serviceClientType"}}),s("span",{staticClass:"error"},[e._v(e._s(a[0]))])]}}])}),s("ValidationProvider",{attrs:{name:"serviceIP",immediate:"",rules:""},scopedSlots:e._u([{key:"default",fn:function(t){var a=t.errors;return[s("q-input",{attrs:{label:"Service IP"},model:{value:e.selectedOlo.serviceIP,callback:function(t){e.$set(e.selectedOlo,"serviceIP",t)},expression:"selectedOlo.serviceIP"}}),s("span",{staticClass:"error"},[e._v(e._s(a[0]))])]}}])}),s("ValidationProvider",{attrs:{name:"serviceNote",immediate:"",rules:""},scopedSlots:e._u([{key:"default",fn:function(t){var a=t.errors;return[s("q-input",{attrs:{label:"Service Note"},model:{value:e.selectedOlo.serviceNote,callback:function(t){e.$set(e.selectedOlo,"serviceNote",t)},expression:"selectedOlo.serviceNote"}}),s("span",{staticClass:"error"},[e._v(e._s(a[0]))])]}}])})],1)])]),s("q-tab-panel",{attrs:{name:"migrationMod"}},[s("div",{attrs:{id:"companyOloFields"}},[s("div",{staticClass:"row"},[s("div",{staticClass:"col"},[e.selectedOlo.objData?s("div",{attrs:{id:"oloMigrationModalitySections"}},e._l(e.selectedOlo.objData.migrationModalities,(function(t,a,o){return s("div",{key:o},[s("h6",[s("p",{attrs:{align:"left"}},[e._v(e._s(a))])]),s("div",{staticClass:"row"},e._l(t,(function(t,o,l){return s("div",{key:l},[s("div",{staticClass:"col"},[s("label",{staticClass:"form-control form-control-user",attrs:{for:o+"_"+a}},[e._v(e._s(o))]),s("input",{directives:[{name:"model",rawName:"v-model",value:e.selectedOlo.objData.migrationModalities[a][o],expression:"\n                              selectedOlo.objData.migrationModalities[\n                                sectionName\n                              ][oloPropertyName]\n                            "}],staticClass:"form-control form-control-user",attrs:{id:o+"_"+a},domProps:{value:e.selectedOlo.objData.migrationModalities[a][o]},on:{input:function(t){t.target.composing||e.$set(e.selectedOlo.objData.migrationModalities[a],o,t.target.value)}}})])])})),0),s("hr",{staticClass:"separator"})])})),0):e._e()])])])])],1)],1)],1),s("q-separator",{attrs:{vertical:"",inset:""}}),e.olos?s("div",[s("q-table",{attrs:{title:"Olo companies",data:e.olos,columns:e.columnsTableOlos,"row-key":"id","virtual-scroll":"",pagination:e.initialPagination,filter:e.txtFilterOloTable},on:{"row-click":e.openOlo},scopedSlots:e._u([{key:"top-right",fn:function(){return[s("q-input",{attrs:{borderless:"",dense:"",debounce:"300",placeholder:"Ricerca"},model:{value:e.txtFilterOloTable,callback:function(t){e.txtFilterOloTable=t},expression:"txtFilterOloTable"}},[s("q-icon",{attrs:{slot:"append",name:"search"},slot:"append"})],1)]},proxy:!0},{key:"header",fn:function(t){return[s("q-tr",{attrs:{props:t}},[s("q-th",{attrs:{"auto-width":""}}),e._l(t.cols,(function(a){return s("q-th",{key:a.name,attrs:{props:t}},[e._v(e._s(a.label))])}))],2)]}},{key:"body",fn:function(t){return[s("q-tr",{class:t.row.state,attrs:{props:t}},[s("q-td",{attrs:{"auto-width":""}},[s("img",{staticStyle:{width:"32px",height:"32px"},attrs:{src:a("d8f6")},on:{click:function(a){return e.openOlo(t.row)}}}),s("img",{staticStyle:{width:"32px",height:"32px",xfill:"gray"},attrs:{src:a("c8ed")},on:{click:function(a){return e.deleteOlo(t.row)}}})]),e._l(t.cols,(function(a){return s("q-td",{key:a.name,attrs:{props:t}},[e._v(e._s(a.value))])}))],2)]}}],null,!1,3167060243)})],1):e._e()],1)},o=[],l=a("2f62"),r=a("4360"),i=a("7bb1"),n=a("2ee0"),c={data(){return{tab:"company",selectedOlo:{},olos:[],oloClassStyleRow:"",txtFilterOloTable:"",initialPagination:{sortBy:"desc",descending:!1,page:2,rowsPerPage:5},pagination:{rowsPerPage:0},columnsTableOlos:[{name:"company",label:"Company",field:e=>e.company,sortable:!0},{name:"cow",label:"Cow",field:e=>e.cow,sortable:!0},{name:"mailConsumer",label:"Mail consumer",field:e=>e.mailConsumer},{name:"mailCorporate",label:"Mail corporate",field:e=>e.mailCorporate}]}},methods:{openOlo:function(e){this.$store.commit("changeOlo",e),this.selectedOlo=e},getAllOlos:function(){this.$axios.post("/adminarea/olo/getall",{}).then((e=>{"OK"===e.data.status&&(this.olos=e.data.olos,this.makeToast(e.data.msg))})).catch((e=>{console.log(e)}))},getOloData:function(){this.$store.state.olo&&(this.selectedOlo=Object.assign({},this.$store.state.olo))},newOlo:function(){this.selectedOlo={},this.$store.commit("changeOlo",this.selectedOlo)},async saveOlo(){const e=!0;e?this.$axios.post("/adminarea/olo/update",{olo:this.selectedOlo}).then((e=>{"OK"===e.data.status&&(this.selectedOlo=e.data.olo,this.$store.commit("changeOlo",this.selectedOlo),this.makeToast(e.data.msg),this.getOloData(),alert("Olo company inserita"))})).catch((e=>{console.log(e)})):alert("Dati errati controlla i campi inseriti")},deleteOlo:function(){const e=confirm("Confermi la cancellazione?");e&&this.$axios.post("/adminarea/olo/delete",{olo:this.selectedOlo}).then((e=>{"OK"===e.data.status&&(this.selectedOlo=e.data.olo,this.$store.commit("changeOlo",this.selectedOlo),this.makeToast(e.data.msg),this.getOloData())})).catch((e=>{console.log(e)}))},makeToast(e){this.$q.notify({color:"green-4",textColor:"white",icon:"info",message:e})}},mounted(){n["a"].setup(),this.getAllOlos()},computed:Object(l["b"])({user:"user",olo:"olo"}),components:{ValidationProvider:i["b"],ValidationObserver:i["a"]},beforeRouteEnter(e,t,a){var s=r["a"].state.user;"admin"===s.role||"manager"===s.role?a():a("/Login")}},d=c,u=(a("ac78"),a("2877")),m=a("0378"),p=a("429b"),v=a("7460"),f=a("eb85"),O=a("adad"),b=a("823b"),h=a("27f9"),P=a("eaac"),_=a("0016"),C=a("bd08"),k=a("357e"),y=a("db86"),g=a("eebe"),x=a.n(g),q=Object(u["a"])(d,s,o,!1,null,"7f0a8776",null);t["default"]=q.exports;x()(q,"components",{QForm:m["a"],QTabs:p["a"],QTab:v["a"],QSeparator:f["a"],QTabPanels:O["a"],QTabPanel:b["a"],QInput:h["a"],QTable:P["a"],QIcon:_["a"],QTr:C["a"],QTh:k["a"],QTd:y["a"]})},ac78:function(e,t,a){"use strict";a("3b35")}}]);