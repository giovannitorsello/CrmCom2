(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([[17],{"65f9":function(e,t,i){"use strict";i.r(t);var s=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{attrs:{id:"siteBackbone"}},[i("d3-network",{attrs:{"net-nodes":e.nodesSiteBackbone,"net-links":e.linksSiteBackbone,options:e.optionsD3Component,selection:e.selectionsD3Component},on:{"node-click":e.onSiteClick}}),i("q-table",{attrs:{title:"Siti",data:e.sitesBackbone,columns:e.columnsTableSites,"row-key":"id",filter:e.siteFilter,"virtual-scroll":"",pagination:e.initialPagination,"rows-per-page-options":[0],"no-data-label":"nessun risultato","no-results-label":"nessun risultato"},on:{"row-click":e.openSiteBackbone},scopedSlots:e._u([{key:"top-right",fn:function(){return[i("q-input",{attrs:{borderless:"",dense:"",debounce:"300",placeholder:"Ricerca"},model:{value:e.siteFilter,callback:function(t){e.siteFilter=t},expression:"siteFilter"}},[i("q-icon",{attrs:{slot:"append",name:"search"},slot:"append"})],1)]},proxy:!0},{key:"header",fn:function(t){return[i("q-tr",{attrs:{props:t}},[i("q-th",{attrs:{"auto-width":""}}),e._l(t.cols,(function(s){return i("q-th",{key:s.name,attrs:{props:t}},[e._v(e._s(s.label))])}))],2)]}},{key:"body",fn:function(t){return[i("q-tr",{class:t.row.state,attrs:{props:t}},[i("q-td",{attrs:{"auto-width":""}},[i("img",{staticStyle:{width:"32px",height:"32px"},attrs:{src:"/img/actions/open.png"},on:{click:function(i){return e.openSiteBackbone(t.row)}}}),e.selectedSiteBackbone.id?i("img",{staticStyle:{width:"32px",height:"32px",xfill:"gray"},attrs:{src:"/img/actions/link.png"},on:{click:function(i){return e.connectSiteBackbone(t.row)}}}):e._e(),i("img",{staticStyle:{width:"32px",height:"32px",xfill:"gray"},attrs:{src:"/img/actions/delete.png"},on:{click:function(i){return e.deleteSiteBackbone(t.row)}}})]),e._l(t.cols,(function(s){return i("q-td",{key:s.name,attrs:{props:t}},[e._v(e._s(s.value))])}))],2)]}}])}),i("h5",[e._v("\n    Parametri sito\n    "),i("b",[e._v(e._s(e.selectedSiteBackbone.description))])]),i("img",{staticStyle:{width:"64px",height:"64px"},attrs:{src:"/img/actions/new.png"},on:{click:function(t){return e.newSiteBackbone()}}}),i("img",{staticStyle:{width:"64px",height:"64px"},attrs:{src:"/img/actions/save.png"},on:{click:function(t){return e.saveSiteBackbone()}}}),i("q-form",{ref:"userForm",staticClass:"q-gutter-md"},[i("div",{staticClass:"row"},[i("div",{staticClass:"col"},[i("q-input",{attrs:{label:"Descrizione"},model:{value:e.selectedSiteBackbone.description,callback:function(t){e.$set(e.selectedSiteBackbone,"description",t)},expression:"selectedSiteBackbone.description"}})],1),i("div",{staticClass:"col"},[i("q-input",{attrs:{label:"Indirizzo"},model:{value:e.selectedSiteBackbone.address,callback:function(t){e.$set(e.selectedSiteBackbone,"address",t)},expression:"selectedSiteBackbone.address"}})],1)]),i("div",{staticClass:"row"},[i("div",{staticClass:"col"},[i("q-input",{attrs:{label:"Latitude"},model:{value:e.selectedSiteBackbone.latitude,callback:function(t){e.$set(e.selectedSiteBackbone,"latitude",t)},expression:"selectedSiteBackbone.latitude"}})],1),i("div",{staticClass:"col"},[i("q-input",{attrs:{label:"Longitude"},model:{value:e.selectedSiteBackbone.longitude,callback:function(t){e.$set(e.selectedSiteBackbone,"longitude",t)},expression:"selectedSiteBackbone.longitude"}})],1)]),i("div",{staticClass:"row"},[i("q-input",{attrs:{label:"Note",type:"textarea",cols:"100",rows:"5"},model:{value:e.selectedSiteBackbone.note,callback:function(t){e.$set(e.selectedSiteBackbone,"note",t)},expression:"selectedSiteBackbone.note"}})],1)]),i("hr",{staticClass:"separator"}),e.isConnected?i("div",[i("h6",[e._v("Siti connessi")]),e._l(e.selectedSiteBackbone.objData.connectedSites,(function(t){return i("div",{key:t.id,staticClass:"row"},[i("div",{staticClass:"col"},[i("span",[e._v(e._s(t.description))])]),i("div",{staticClass:"col"},[i("img",{staticStyle:{width:"32px",height:"32px"},attrs:{src:"/img/actions/open.png",alt:"apri"},on:{click:function(i){return e.openSiteBackbone(t)}}}),i("img",{staticStyle:{width:"32px",height:"32px",xfill:"gray"},attrs:{src:"/img/actions/delete.png",alt:"elimina"},on:{click:function(i){return e.disconnectSiteBackbone(t)}}})])])}))],2):e._e()],1)},a=[],n=(i("e01a"),i("a434"),i("a5b7")),o=i.n(n),c={components:{D3Network:o.a},data(){return{siteFilter:"",initialPagination:{sortBy:"desc",descending:!1,page:2,rowsPerPage:5},columnsTableSites:[{name:"actions",label:"Azioni"},{name:"description",label:"Descrizione",field:e=>e.description,sortable:!0},{name:"address",label:"indirizzo",field:e=>e.address,sortable:!0},{name:"longitude",label:"Longitudine",field:e=>e.username,sortable:!0},{name:"latitude",label:"Latitudine",field:e=>e.mobilephone,sortable:!0},{name:"Note",label:"note",field:e=>e.note,sortable:!0}],selectionsD3Component:{nodes:[],links:[]},optionsD3Component:{force:3e3,size:{w:800,h:1e3},nodeSize:30,linkWidth:4,fontSize:12,nodeLabels:!0,linkLabels:!1,canvas:!1},nodesSiteBackbone:[],linksSiteBackbone:[],selectedSiteBackbone:{},sitesBackbone:[],linksBackbone:{},objDataSection:{},objDataPrimitives:{}}},computed:{sortOptions(){return this.fields.filter(e=>e.sortable).map(e=>({text:e.label,value:e.key}))},isConnected(){return!!(this.selectedSiteBackbone.objData&&this.selectedSiteBackbone.objData.connectedSites&&this.selectedSiteBackbone.objData.connectedSites.length>0)}},mounted(){this.getSiteBackboneData(),this.getAllSitesBackbone(),this.totalRows=this.sitesBackbone.length},methods:{initD3Component(){this.nodesSiteBackbone=[],this.linksSiteBackbone=[],this.selectionsD3Component={nodes:[],links:[]},this.sitesBackbone&&this.sitesBackbone.forEach(e=>{let t="blue";if(e.id===this.selectedSiteBackbone.id&&(t="orange"),this.nodesSiteBackbone.push({id:e.id,name:e.description,_color:t}),e.objData&&e.objData.connectedSites){const t=e.objData.connectedSites;t&&t.forEach(t=>{let i="blue";e.id!==this.selectedSiteBackbone.id&&t.id!==this.selectedSiteBackbone.id||(i="orange"),this.linksSiteBackbone.push({sid:e.id,tid:t.id,_color:i})})}})},onSiteClick(e,t){this.sitesBackbone.forEach(e=>{e.id===t.id&&this.openSiteBackbone(e)})},getAllSitesBackbone:function(){this.$axios.post("/adminarea/siteBackbone/getall",{}).then(e=>{"OK"===e.data.status&&(this.sitesBackbone=e.data.sitesBackbone,this.totalRows=this.sitesBackbone.length,this.makeToast(e.data.msg),this.initD3Component())}).catch(e=>{console.log(e)})},getSiteBackboneData:function(){this.selectedSiteBackbone=Object.assign({},this.$store.state.siteBackbone)},parseSiteBackboneObjData:function(){if(this.selectedSiteBackbone.objData)for(const e in this.selectedSiteBackbone.objData)"object"===typeof this.selectedSiteBackbone.objData[e]?this.objDataSection[e]=this.selectedSiteBackbone.objData[e]:this.objDataPrimitives[e]=this.selectedSiteBackbone.objData[e]},disconnectSiteBackbone(e){e&&this.selectedSiteBackbone&&this.selectedSiteBackbone.objData.connectedSites.forEach((t,i,s)=>{t.id===e.id&&(this.selectedSiteBackbone.objData.connectedSites.splice(i,1),this.saveSiteBackbone())})},connectSiteBackbone(e){if(this.selectedSiteBackbone&&e)if(this.selectedSiteBackbone.objData||(this.selectedSiteBackbone.objData={}),this.selectedSiteBackbone.objData.connectedSites||(this.selectedSiteBackbone.objData.connectedSites=[]),0===this.selectedSiteBackbone.objData.connectedSites.length)this.selectedSiteBackbone.objData.connectedSites.push(e),this.saveSiteBackbone();else{const t=this.selectedSiteBackbone.objData.connectedSites.some(t=>t.id===e.id);t?this.makeToast("Sito già collegato"):(this.selectedSiteBackbone.objData.connectedSites.push(e),this.saveSiteBackbone())}},openSiteBackbone(e){this.selectedSiteBackbone=e,this.$store.commit("changeSiteBackbone",Object.assign({},e)),this.makeToast("Sito aperto per la modifica"),this.initD3Component()},newSiteBackbone(){this.$axios.post("/adminarea/siteBackbone/insert",{siteBackbone:this.selectedSiteBackbone}).then(e=>{"OK"===e.data.status?(this.selectedSiteBackbone=e.data.siteBackbone,this.makeToast(e.data.msg),this.sitesBackbone=[this.selectedSiteBackbone],this.$store.commit("changeSelectedSite",Object.assign({},this.sitesBackbone))):this.makeToast(e.data.msg)}).catch(e=>{console.log(e)})},saveSiteBackbone:function(){this.$axios.post("/adminarea/siteBackbone/update",{siteBackbone:this.selectedSiteBackbone}).then(e=>{"OK"===e.data.status?(this.selectedSiteBackbone=e.data.siteBackbone,this.getAllSitesBackbone(),this.makeToast(e.data.msg),this.$store.commit("changeSelectedSite",Object.assign({},this.selectedSiteBackbone))):this.makeToast(e.data.msg,"danger")}).catch(e=>{console.log(e)})},deleteSiteBackbone:function(e){const t=confirm("Confermi la cancellazione?");t&&this.$axios.post("/adminarea/siteBackbone/delete",{siteBackbone:e}).then(e=>{"OK"===e.data.status?(this.selectedSiteBackbone=e.data.siteBackbone,this.makeToast(e.data.msg),this.getAllSitesBackbone(),this.$store.commit("changeSelectedSite",Object.assign({},this.selectedSiteBackbone))):this.makeToast(e.data.msg,"danger")}).catch(e=>{console.log(e)})},makeToast(e){this.$q.notify({color:"green-4",textColor:"white",icon:"info",message:e})}}},l=c,d=(i("fc7d"),i("2877")),r=i("eaac"),b=i("27f9"),k=i("0016"),h=i("bd08"),S=i("357e"),p=i("db86"),B=i("0378"),u=i("eebe"),m=i.n(u),g=Object(d["a"])(l,s,a,!1,null,"72d71782",null);t["default"]=g.exports;m()(g,"components",{QTable:r["a"],QInput:b["a"],QIcon:k["a"],QTr:h["a"],QTh:S["a"],QTd:p["a"],QForm:B["a"]})}}]);