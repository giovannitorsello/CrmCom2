import Vue from "vue";
import Vuex from "vuex";

// import example from './module-example'

Vue.use(Vuex);

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

const Store = new Vuex.Store({
  state: {
    user: {},
    customer: {},
    contract: {},
    service: {},
    serviceTemplate: {},
    invoice: {},
    invoiceEntry: {},
    deviceCustomer: {},
    deviceBackbone: {},
    siteBackbone: {},
    olo: {}
  },
  getters: {},
  mutations: {
    changeUser(state, usr) {
      state.user = usr;
    },
    changeCustomer(state, cst) {
      state.customer = cst;
    },
    changeContract(state, ctr) {
      state.contract = ctr;
    },
    changeDeviceCustomer(state, dev) {
      state.deviceCustomer = dev;
    },
    changeService(state, srv) {
      state.service = srv;
    },
    changeServiceTemplate(state, srv) {
      state.serviceTemplate = srv;
    },
    changeInvoice(state, inv) {
      state.invoice = inv;
    },
    changeInvoiceEntry(state, invEntry) {
      state.invoiceEntry = invEntry;
    },
    changeDeviceBackbone(state, dev) {
      state.deviceBackbone = dev;
    },
    changeSiteBackbone(state, site) {
      state.siteBackbone = site;
    },
    changeOlo(state, olo) {
      state.olo = olo;
    }
  },
  actions: {},
  modules: {
    // example
  },

  // enable strict mode (adds overhead!)
  // for dev mode only
  strict: false //process.env.DEV
});

export default function(/* { ssrContext } */) {
  return Store;
}

export { Store };
