<template>
  <div id="siteBackbone">
    <d3-network
      :net-nodes="nodesSiteBackbone"
      :net-links="linksSiteBackbone"
      :options="optionsD3Component"
      :selection="selectionsD3Component"
      @node-click="onSiteClick"
    />

    <q-table
      title="Siti"
      :data="sitesBackbone"
      :columns="columnsTableSites"
      row-key="id"
      :filter="siteFilter"
      virtual-scroll
      :pagination="initialPagination"
      :rows-per-page-options="[0]"
      @row-click="openSiteBackbone"
      no-data-label="nessun risultato"
      no-results-label="nessun risultato"
    >
      <template v-slot:top-right>
        <q-input borderless dense debounce="300" v-model="siteFilter" placeholder="Ricerca">
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
              src="/img/actions/open.png"
              v-on:click="openSiteBackbone(props.row)"
              style="width: 32px; height: 32px;"
            />
            <img
              src="/img/actions/link.png"
              v-if="selectedSiteBackbone.id"
              v-on:click="connectSiteBackbone(props.row)"
              style="width: 32px; height: 32px; xfill: gray;"
            />

            <img
              src="/img/actions/delete.png"
              v-on:click="deleteSiteBackbone(props.row)"
              style="width: 32px; height: 32px; xfill: gray;"
            />
          </q-td>
          <q-td v-for="col in props.cols" :key="col.name" :props="props">{{ col.value }}</q-td>
        </q-tr>
      </template>
    </q-table>
    <h5>
      Parametri sito
      <b>{{ selectedSiteBackbone.description }}</b>
    </h5>

    <img @click="newSiteBackbone()" src="/img/actions/new.png" style="width: 64px; height: 64px;" />
    <img @click="saveSiteBackbone()" src="/img/actions/save.png" style="width: 64px; height: 64px;" />

    <ValidationObserver ref="formSite">
      <q-form ref="siteForm" class="q-gutter-md">
        <div class="row">
          <div class="col">
            <ValidationProvider
              name="Descrizione"
              immediate
              rules="required|alpha_spaces"
              v-slot="{ errors }"
            >
              <q-input label="Descrizione" v-model="selectedSiteBackbone.description" />
              <span class="error">{{ errors[0] }}</span>
            </ValidationProvider>
          </div>
          <div class="col">
            <ValidationProvider
              name="Indirizzo"
              immediate
              rules="required|address"
              v-slot="{ errors }"
            >
              <q-input label="Indirizzo" v-model="selectedSiteBackbone.address" />
              <span class="error">{{ errors[0] }}</span>
            </ValidationProvider>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <ValidationProvider
              name="Latitudine"
              immediate
              rules="required|latitude"
              v-slot="{ errors }"
            >
              <q-input label="Latitude" v-model="selectedSiteBackbone.latitude" />
              <span class="error">{{ errors[0] }}</span>
            </ValidationProvider>
          </div>
          <div class="col">
            <ValidationProvider
              name="Longitudine"
              immediate
              rules="required|longitude"
              v-slot="{ errors }"
            >
              <q-input label="Longitude" v-model="selectedSiteBackbone.longitude" />
              <span class="error">{{ errors[0] }}</span>
            </ValidationProvider>
          </div>
        </div>
        <div class="row">
          <q-input
            label="Note"
            v-model="selectedSiteBackbone.note"
            type="textarea"
            cols="100"
            rows="5"
          />
        </div>
      </q-form>
    </ValidationObserver>

    <hr class="separator" />
    <div v-if="isConnected">
      <h6>Siti connessi</h6>
      <div
        class="row"
        v-for="site in selectedSiteBackbone.objData.connectedSites"
        v-bind:key="site.id"
      >
        <div class="col">
          <span>{{ site.description }}</span>
        </div>
        <div class="col">
          <img
            src="/img/actions/open.png"
            alt="apri"
            style="width: 32px; height: 32px;"
            v-on:click="openSiteBackbone(site)"
          />
          <img
            src="/img/actions/delete.png"
            alt="elimina"
            style="width: 32px; height: 32px; xfill: gray;"
            v-on:click="disconnectSiteBackbone(site)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import D3Network from "vue-d3-network";
import { mapState } from "vuex";
import {Store} from '../store'

import {
  ValidationProvider,
  ValidationObserver,
  extend,
  localize
} from "vee-validate";
import validator from "./validator";

export default {
  components: {
    D3Network,
    ValidationProvider,
    ValidationObserver
  },
  data() {
    return {
      isConnected: false,
      siteFilter: "",
      initialPagination: {
        sortBy: "desc",
        descending: false,
        page: 2,
        rowsPerPage: 5
      },
      columnsTableSites: [
        { name: "actions", label: "Azioni" },
        {
          name: "description",
          label: "Descrizione",
          field: row => row.description,
          sortable: true
        },
        {
          name: "address",
          label: "indirizzo",
          field: row => row.address,
          sortable: true
        },
        {
          name: "longitude",
          label: "Longitudine",
          field: row => row.username,
          sortable: true
        },
        {
          name: "latitude",
          label: "Latitudine",
          field: row => row.mobilephone,
          sortable: true
        },
        { name: "Note", label: "note", field: row => row.note, sortable: true }
      ],
      selectionsD3Component: { nodes: [], links: [] },
      optionsD3Component: {
        force: 3000,
        size: { w: 800, h: 1000 },
        nodeSize: 30,
        linkWidth: 4,
        fontSize: 12,
        nodeLabels: true,
        linkLabels: false,
        canvas: false
      },
      nodesSiteBackbone: [],
      linksSiteBackbone: [],
      selectedSiteBackbone: {},
      sitesBackbone: [],
      linksBackbone: {},
      objDataSection: {},
      objDataPrimitives: {}
    };
  },
  mounted() {
    this.getSiteBackboneData();
    this.getAllSitesBackbone();
    this.totalRows = this.sitesBackbone.length;
  },
  methods: {
    initD3Component() {
      this.nodesSiteBackbone = [];
      this.linksSiteBackbone = [];
      this.selectionsD3Component = { nodes: [], links: [] };
      if (this.sitesBackbone) {
        this.sitesBackbone.forEach(source => {
          let colorNode = "blue";
          if (source.id === this.selectedSiteBackbone.id) colorNode = "orange";
          this.nodesSiteBackbone.push({
            id: source.id,
            name: source.description,
            _color: colorNode
          });
          if (source.objData && source.objData.connectedSites) {
            const connSites = source.objData.connectedSites;
            if (connSites)
              connSites.forEach(dest => {
                let colorLink = "blue";
                if (
                  source.id === this.selectedSiteBackbone.id ||
                  dest.id === this.selectedSiteBackbone.id
                )
                  colorLink = "orange";
                this.linksSiteBackbone.push({
                  sid: source.id,
                  tid: dest.id,
                  _color: colorLink
                });
              });
          }
        });
      }
    },
    onSiteClick(event, site) {
      this.sitesBackbone.forEach(element => {
        if (element.id === site.id) this.openSiteBackbone(element);
      });
    },
    getAllSitesBackbone: function() {
      this.$axios
        .post("/adminarea/siteBackbone/getall", {})
        .then(response => {
          if (response.data.status === "OK") {
            this.sitesBackbone = response.data.sitesBackbone;
            this.totalRows = this.sitesBackbone.length;
            this.makeToast(response.data.msg);
            this.initD3Component();
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getSiteBackboneData: function() {
      this.selectedSiteBackbone = Object.assign(
        {},
        this.$store.state.siteBackbone
      );
    },
    parseSiteBackboneObjData: function() {
      if (this.selectedSiteBackbone.objData)
        for (const sectionName in this.selectedSiteBackbone.objData) {
          if (
            typeof this.selectedSiteBackbone.objData[sectionName] === "object"
          ) {
            this.objDataSection[
              sectionName
            ] = this.selectedSiteBackbone.objData[sectionName];
          } else
            this.objDataPrimitives[
              sectionName
            ] = this.selectedSiteBackbone.objData[sectionName];
        }
    },
    disconnectSiteBackbone(site) {
      if (site && this.selectedSiteBackbone) {
        this.selectedSiteBackbone.objData.connectedSites.forEach(
          (element, index, array) => {
            if (element.id === site.id) {
              this.selectedSiteBackbone.objData.connectedSites.splice(index, 1);
              this.saveSiteBackbone();
            }
          }
        );
      }
    },
    connectSiteBackbone(site) {
      if (this.selectedSiteBackbone && site) {
        if (!this.selectedSiteBackbone.objData)
          this.selectedSiteBackbone.objData = {};
        if (!this.selectedSiteBackbone.objData.connectedSites)
          this.selectedSiteBackbone.objData.connectedSites = [];
        if (this.selectedSiteBackbone.objData.connectedSites.length === 0) {
          this.selectedSiteBackbone.objData.connectedSites.push(site);
          this.saveSiteBackbone();
        } else {
          const bExist = this.selectedSiteBackbone.objData.connectedSites.some(
            elem => {
              return elem.id === site.id;
            }
          );
          if (!bExist) {
            this.selectedSiteBackbone.objData.connectedSites.push(site);
            this.saveSiteBackbone();
          } else this.makeToast("Sito già collegato");
        }
      }
    },
    openSiteBackbone(site) {
      this.selectedSiteBackbone = site;
      this.$store.commit("changeSiteBackbone", Object.assign({}, site));
      this.makeToast("Sito aperto per la modifica");
      this.initD3Component();
    },
    newSiteBackbone() {
      this.$axios
        .post("/adminarea/siteBackbone/insert", {
          siteBackbone: this.selectedSiteBackbone
        })
        .then(response => {
          if (response.data.status === "OK") {
            this.selectedSiteBackbone = response.data.siteBackbone;
            this.makeToast(response.data.msg);
            this.sitesBackbone = [this.selectedSiteBackbone];
            this.$store.commit(
              "changeSelectedSite",
              Object.assign({}, this.sitesBackbone)
            );
          } else this.makeToast(response.data.msg);
        })
        .catch(error => {
          console.log(error);
        });
    },
    saveSiteBackbone: function() {
      this.$axios
        .post("/adminarea/siteBackbone/update", {
          siteBackbone: this.selectedSiteBackbone
        })
        .then(response => {
          if (response.data.status === "OK") {
            this.selectedSiteBackbone = response.data.siteBackbone;
            this.getAllSitesBackbone();
            this.makeToast(response.data.msg);
            this.$store.commit(
              "changeSelectedSite",
              Object.assign({}, this.selectedSiteBackbone)
            );
          } else this.makeToast(response.data.msg, "danger");
        })
        .catch(error => {
          console.log(error);
        });
    },
    deleteSiteBackbone: function(site) {
      const isConfirmed = confirm("Confermi la cancellazione?");
      if (isConfirmed) {
        this.$axios
          .post("/adminarea/siteBackbone/delete", {
            siteBackbone: site
          })
          .then(response => {
            if (response.data.status === "OK") {
              this.selectedSiteBackbone = response.data.siteBackbone;
              this.makeToast(response.data.msg);
              this.getAllSitesBackbone();
              this.$store.commit(
                "changeSelectedSite",
                Object.assign({}, this.selectedSiteBackbone)
              );
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
    }
  },
  computed: mapState({user: 'user'}),
  beforeRouteEnter(to, from, next) {
    var currentUser = Store.state.user;
    console.log(currentUser);
    if ((currentUser.role === "admin") || 
        (currentUser.role === "manager") ||
        (currentUser.role === "technician"))  next();
    else next("/Login");
  }
};
</script>

<style src="vue-d3-network/dist/vue-d3-network.css" scoped></style>
<style>
.error {
  color: rgb(127, 127, 0);
  background-color: yellow;
  font-style: italic;
}
</style>