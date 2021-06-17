import Vue from "vue";
import {
  ValidationProvider,
  ValidationObserver,
  extend,
  localize
} from "vee-validate";
import { configure } from "vee-validate";
//import it from 'vee-validate/dist/locale/it.json';
import it from "boot/it.json";
import fiscalCheck from "./fiscal-check";

localize("it", it);
Vue.component("ValidationProvider", ValidationProvider);

extend("required", {
  validate(value) {
    return {
      required: true,
      valid: ["", null, undefined].indexOf(value) === -1
    };
  },
  computesRequired: true
});

extend("latitude", str => {
  return /^([0-9]+)([.]{1})([0-9]+)/.test(str);
});

extend("longitude", str => {
  return /^([0-9]+)([.]{1})([0-9]+)/.test(str);
});

extend("address", str => {
  return /^([a-zA-Z0-9à-ù\s\']+)([,]{1})([\s]{1})([0-9A-Z]+)([,]{1})([\s]{1})([0-9]+)([,]{1})([\s]{1})([a-zA-Z0-9\s]+)([,]{1})([\s]{1})([A-Z]{2})/.test(
    str
  );
});

extend("mac", str => {
  return /^([0-9A-Fa-f]{2}[:]){5}([0-9A-Fa-f]{2})$/.test(str);
});

extend("ipv4", str => {
  return /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(str);
});

extend("ipv6", str => {
  return /(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))/.test(
    str
  );
});

extend("integer", str => {
  return /^[0-9]+$/.test(str);
});

extend("decimal", str => {
  return /^[+-]?((\d+(\.\d*)?)|(\.\d+))$/.test(str);
});

extend("phone", str => {
  return /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-s./0-9]*$/.test(str);
});

extend("email", str => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(str);
});

extend("alpha_num", str => {
  if (str === "") return false;
  return /^[a-zA-Z0-9]+$/i.test(str);
});

extend("alpha_spaces", str => {
  if (str === "") return false;
  return /^[a-z][a-z\s]*$/i.test(str);
});

extend("alpha", str => {
  if (str === "") return false;
  return /^[a-z]*$/i.test(str);
});

extend("codfis", str => {
  if (str === "") return false;
  return fiscalCheck.validateFisCode(str);
});

extend("vatcode", str => {
  if (str === "") return false;
  return fiscalCheck.validateVatCode(str);
});

extend("postalcode", str => {
  if (str === "") return false;
  return /^\d{5}[-\s]?(?:[0-9]{4})?$/.test(str);
});

configure({
  classes: {
    valid: "valid",
    invalid: "invalid"
  }
});

export default {
  setup() {
    Vue.component("ValidationProvider", ValidationProvider);
    Vue.component("ValidationObserver", ValidationObserver);
  },
  ValidationProvider,
  ValidationObserver
};
