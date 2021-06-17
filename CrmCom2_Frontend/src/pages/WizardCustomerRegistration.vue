<template>
  <div id="customers">
    <h5>Inserimento guidato cliente ({{ uuid }})</h5>
    <h6 v-if="step == 1">
      <b>Configurazione contratto:</b> Tipo di cliente privato o azienda?
    </h6>
    <h6 v-if="step == 2">
      <b>Configurazione contratto:</b> Inserisci i dati del cliente
    </h6>
    <h6 v-if="step == 3">
      <b>Configurazione contratto:</b> Indirizzo postale cliente (domicilio)
    </h6>
    <h6 v-if="step == 4">
      <b>Configurazione contratto:</b> Contatti telefono ed email
    </h6>
    <h6 v-if="step == 5">
      <b>Configurazione contratto:</b> Seleziona i servizi da attivare e
      l'indirizzo completo del contratto.
    </h6>
    <h6 v-if="step == 6">
      <b>Configurazione contratto:</b> Documento di identità cliente
    </h6>
    <h6 v-if="step == 7">
      <b>Configurazione contratto:</b>Codice fiscale cliente
    </h6>
    <h6 v-if="step == 8"><b>Configurazione contratto:</b>Dati finali</h6>

    <div id="dataFormDiv" style="padding-bottom: 100px;">
      <ValidationObserver>
        <div class="row" v-if="step == 1">
          <div class="col-auto">
            <q-btn-toggle
              v-model="isCompany"
              toggle-color="primary"
              no-caps
              rounded
              unelevated
              :options="[
                { label: 'Privato', value: false },
                { label: 'Azienda', value: true }
              ]"
            />
          </div>
        </div>
        <div id="buttons" class="barButtons" v-if="step == 1">
          <q-btn class="bottomLeft" @click="prevStep">Indietro</q-btn>
          <q-btn class="bottomRight" @click="nextStep">Avanti</q-btn>
        </div>
      </ValidationObserver>

      <ValidationObserver v-slot="observer2">
        <!--Step 2 - Intestatario contratto azienda/privato -->
        <div id="companyFields" v-if="isCompany && step == 2">
          <div class="row">
            <div class="col">
              <ValidationProvider
                name="Denominazone Azienda"
                immediate
                rules="required"
                v-slot="{ errors }"
              >
                <q-input
                  label="Denominazione Azienda"
                  v-model="selectedCustomer.company"
                />
                <span class="error">{{ errors[0] }}</span>
              </ValidationProvider>

              <ValidationProvider
                name="Indirizzo Sede Azienda"
                immediate
                rules="required|address"
                v-slot="{ errors }"
              >
                <q-input
                  label="Indirizzo Sede Azienda"
                  v-model="selectedCustomer.companyaddress"
                >
                  <a>Aiuto sulla compilazione</a>
                </q-input>
                <span class="error">{{ errors[0] }}</span>
              </ValidationProvider>

              <ValidationProvider
                name="Telefono principale aziendale"
                immediate
                rules="required|phone"
                v-slot="{ errors }"
              >
                <q-input
                  label="Telefono principale aziendale"
                  v-model="selectedCustomer.companyphone"
                  type="tel"
                />
                <span class="error">{{ errors[0] }}</span>
              </ValidationProvider>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <ValidationProvider
                name="Partita IVA"
                rules="required|vatcode"
                v-slot="{ errors }"
              >
                <q-input
                  label="Partita IVA"
                  v-model="selectedCustomer.vatcode"
                />
                <span class="error">{{ errors[0] }}</span>
              </ValidationProvider>

              <ValidationProvider
                name="Codice univoco SDI"
                rules="required|alpha_num"
                v-slot="{ errors }"
              >
                <q-input
                  label="Codice Univoco SDI"
                  v-model="selectedCustomer.sdicode"
                />
                <span class="error">{{ errors[0] }}</span>
              </ValidationProvider>

              <ValidationProvider
                name="Email PEC"
                rules="required|email"
                v-slot="{ errors }"
              >
                <q-input
                  label="Email PEC"
                  v-model="selectedCustomer.companypec"
                  type="email"
                />
                <span class="error">{{ errors[0] }}</span>
              </ValidationProvider>
            </div>
          </div>
        </div>

        <!--Step 2 - Intestatario contratto azienda/privato-->
        <h6 v-if="isCompany && step == 2">
          Dati amministratore azienda (obbligatori)
        </h6>
        <h6 v-if="!isCompany && step == 2">
          Dati intestatario contratto (obbligatori)
        </h6>
        <div class="row" v-if="step == 2">
          <div class="col">
            <ValidationProvider
              name="Nome"
              immediate
              rules="required|alpha_spaces"
              v-slot="{ errors }"
            >
              <q-input label="Nome" v-model="selectedCustomer.firstname" />
              <span class="error">{{ errors[0] }}</span>
            </ValidationProvider>

            <ValidationProvider
              name="Cognome"
              immediate
              rules="required|alpha_spaces"
              v-slot="{ errors }"
            >
              <q-input label="Cognome" v-model="selectedCustomer.lastname" />
              <span class="error">{{ errors[0] }}</span>
            </ValidationProvider>

            <ValidationProvider
              name="Codice Fiscale"
              immediate
              rules="required|codfis"
              v-slot="{ errors }"
            >
              <q-input
                label="Codice Fiscale"
                v-model="selectedCustomer.codfis"
              />
              <span class="error">{{ errors[0] }}</span>
            </ValidationProvider>
          </div>
        </div>
        <div id="buttons" class="barButtons" v-if="step == 2">
          <q-btn class="bottomLeft" @click="prevStep">Indietro</q-btn>
          <q-btn
            class="bottomRight"
            @click="nextStep"
            :disable="observer2.invalid"
            >Avanti
          </q-btn>
        </div>
        <pre>{{ observer2.invalid }}</pre>
      </ValidationObserver>

      <ValidationObserver v-slot="observer3">
        <!--Step 3 - Indirizzo erogazione servizio -->
        <div class="row" v-if="step == 3">
          <div class="col">
            <ValidationProvider
              name="Indirizzo"
              immediate
              rules="required|address"
              v-slot="{ errors }"
            >
              <q-input label="Indirizzo" v-model="selectedCustomer.address" />
              <span class="error">{{ errors[0] }}</span>
            </ValidationProvider>

            <ValidationProvider
              name="CAP"
              immediate
              rules="required|alpha_num"
              v-slot="{ errors }"
            >
              <q-input label="CAP" v-model="selectedCustomer.postalcode" />
              <span class="error">{{ errors[0] }}</span>
            </ValidationProvider>

            <ValidationProvider
              name="Città"
              immediate
              rules="required|alpha"
              v-slot="{ errors }"
            >
              <q-input label="Città" v-model="selectedCustomer.city" />
              <span class="error">{{ errors[0] }}</span>
            </ValidationProvider>

            <ValidationProvider
              name="Stato"
              immediate
              rules="required|alpha"
              v-slot="{ errors }"
            >
              <q-input label="Stato" v-model="selectedCustomer.state" />
              <span class="error">{{ errors[0] }}</span>
            </ValidationProvider>
          </div>
        </div>

        <div id="buttons" class="barButtons" v-if="step == 3">
          <q-btn class="bottomLeft" @click="prevStep">Indietro</q-btn>
          <q-btn
            class="bottomRight"
            @click="nextStep"
            :disabled="observer3.invalid"
            >Avanti</q-btn
          >
        </div>
      </ValidationObserver>

      <ValidationObserver v-slot="observer4">
        <!--Step 4 - Contatti -->
        <div class="row" v-if="step == 4">
          <div class="col">
            <ValidationProvider
              name="Email"
              immediate
              rules="required|email"
              v-slot="{ errors }"
            >
              <q-input
                label="Email"
                v-model="selectedCustomer.email"
                type="email"
              />
              <span class="error">{{ errors[0] }}</span>
            </ValidationProvider>

            <ValidationProvider
              name="Tel. Mobile"
              immediate
              rules="required|phone"
              v-slot="{ errors }"
            >
              <q-input
                label="Tel. Mobile"
                v-model="selectedCustomer.mobilephone"
                type="tel"
              />
              <span class="error">{{ errors[0] }}</span>
            </ValidationProvider>

            <ValidationProvider
              name="Tel. Fisso"
              immediate
              rules="required|phone"
              v-slot="{ errors }"
            >
              <q-input
                label="Tel. Fisso"
                v-model="selectedCustomer.phone"
                type="tel"
              />
              <span class="error">{{ errors[0] }}</span>
            </ValidationProvider>
          </div>
        </div>

        <div id="buttons" class="barButtons" v-if="step == 4">
          <q-btn class="bottomLeft" @click="prevStep">Indietro</q-btn>
          <q-btn
            class="bottomRight"
            @click="nextStep"
            :disabled="observer4.invalid"
            >Avanti</q-btn
          >
        </div>
      </ValidationObserver>

      <ValidationObserver v-slot="observer5">
        <!--Step 5 - Configurazione contratto -->
        <div v-if="step == 5">
          <div class="row" style="width: 100%">
            <div class="col">
              <ValidationProvider
                name="Indirizzo esecuzione contratto"
                immediate
                rules="required|address"
                v-slot="{ errors }"
              >
                <q-input
                  label="Indirizzo esecuzione contratto"
                  v-model="selectedContract.address"
                />
                <span class="error">{{ errors[0] }}</span>
              </ValidationProvider>
            </div>
            <div class="col">
              <ValidationProvider
                name="Indirizzo fatturazione contratto"
                immediate
                rules="required|address"
                v-slot="{ errors }"
              >
                <q-input
                  label="Indirizzo fatturazione contratto"
                  v-model="selectedContract.invoiceAddress"
                />
                <span class="error">{{ errors[0] }}</span>
              </ValidationProvider>
            </div>
            <div class="col">
              <ValidationProvider
                name="Città fatturazione contratto"
                immediate
                rules="required"
                v-slot="{ errors }"
              >
                <q-input
                  label="Città fatturazione contratto"
                  v-model="selectedContract.invoiceCity"
                />
                <span class="error">{{ errors[0] }}</span>
              </ValidationProvider>
            </div>
            <div class="col">
              <ValidationProvider
                name="CAP fatturazione contratto"
                immediate
                rules="required"
                v-slot="{ errors }"
              >
                <q-input
                  label="CAP fatturazione contratto"
                  v-model="selectedContract.invoiceCAP"
                />
                <span class="error">{{ errors[0] }}</span>
              </ValidationProvider>
            </div>
            <div class="col">
              <ValidationProvider
                name="Provincia fatturazione"
                immediate
                rules="required"
                v-slot="{ errors }"
              >
                <q-input
                  label="Provincia fatturazione"
                  v-model="selectedContract.invoiceProvince"
                />
                <span class="error">{{ errors[0] }}</span>
              </ValidationProvider>
            </div>
          </div>

          <div class="row" style="width: 100%">
            <div class="col">
              <q-select
                filled
                label="Categoria"
                @input="changeCategory"
                :options="serviceCategories"
                v-model="selectedCategory"
              />
              <q-table
                style="width: 100%"
                title="Servizi"
                :data="serviceTemplates"
                :columns="columnsTableServiceTemplates"
                row-key="id"
                selection="multiple"
                :selected.sync="selectedServicesTemplate"
                @update:selected="getValueSelectedServices"
              />
            </div>
          </div>

          <div class="row">
            <div class="col">
              Costi di attivazione iva esclusa:
              {{ valueSelectedServices.activationPrice }}
            </div>
          </div>

          <div class="row">
            <div class="col">
              Importo iva esclusa: {{ valueSelectedServices.price }}
            </div>
            <div class="col">Importo iva: {{ valueSelectedServices.vat }}</div>
            <div class="col">
              Importo totale: {{ valueSelectedServices.total }}
            </div>
          </div>
        </div>

        <div id="buttons" class="barButtons" v-if="step == 5">
          <q-btn class="bottomLeft" @click="prevStep">Indietro</q-btn>
          <q-btn
            class="bottomRight"
            @click="nextStep"
            :disabled="observer5.invalid"
            >Avanti</q-btn
          >
        </div>
      </ValidationObserver>

      <ValidationObserver v-slot="observer6">
        <!--Step 6 identity card -->
        <div class="row" v-if="step == 6" stype="with: 100%">
          <div class="col">
            <ValidationProvider
              name="Numero documento"
              immediate
              rules="required"
              v-slot="{ errors }"
            >
              <q-input
                label="Numero documento"
                v-model="selectedCustomer.numci"
                type="tel"
              />
              <span class="error">{{ errors[0] }}</span>
            </ValidationProvider>
          </div>
          <div class="col">
            <q-btn
              v-if="fromCamera"
              color="primary"
              style="width: 300px"
              label="Carta identità fronte (camera)"
              @click="captureCiFront"
            />
            <q-uploader
              v-if="!fromCamera"
              auto-upload
              :factory="uploadCiFront"
              max-file-size="2048000"
              accept=".jpg"
              style="max-width: 300px"
              label="Acquisizione da file (solo jpg)"
            />
          </div>
          <div class="col">
            <q-btn
              v-if="fromCamera"
              color="primary"
              style="width: 300px"
              label="Carta identità retro (camera)"
              @click="captureCiBack"
            />
            <q-uploader
              v-if="!fromCamera"
              auto-upload
              :factory="uploadCiBack"
              accept=".jpg"
              max-file-size="2048000"
              style="max-width: 300px"
              label="Acquisizione da file (solo jpg)"
            />
          </div>
        </div>
        <div class="row" v-if="step == 6" stype="with: 100%">
          <div class="col">
            <img :src="imageCiFront" style="width: 300px" />
            <img :src="imageCiBack" style="width: 300px" />
          </div>
        </div>

        <div id="buttons" class="barButtons" v-if="step == 6">
          <q-btn class="bottomLeft" @click="prevStep">Indietro</q-btn>
          <q-btn
            class="bottomRight"
            @click="nextStep"
            :disabled="observer6.invalid"
            >Avanti</q-btn
          >
        </div>
      </ValidationObserver>

      <ValidationObserver v-slot="observer7">
        <!--Step 7 identity ficalcode/health card -->
        <div class="row" v-if="step == 7" stype="with: 100%">
          <div class="col">
            <ValidationProvider
              name="Codice fiscale"
              immediate
              rules="required|codfis"
              v-slot="{ errors }"
            >
              <q-input
                label="Codice fiscale"
                v-model="selectedCustomer.codfis"
                type="codfis"
              />
              <span class="error">{{ errors[0] }}</span>
            </ValidationProvider>
          </div>
          <div class="col">
            <q-btn
              v-if="fromCamera"
              color="primary"
              style="width: 300px"
              label="Codice fiscale fronte (camera)"
              @click="captureCfFront"
            />
            <q-uploader
              v-if="!fromCamera"
              auto-upload
              :factory="uploadCfFront"
              max-file-size="2048000"
              accept=".jpg"
              style="max-width: 300px"
              label="Acquisizione da file (solo jpg)"
            />
          </div>
          <div class="col">
            <q-btn
              v-if="fromCamera"
              color="primary"
              style="width: 300px"
              label="Codice fiscale retro (camera)"
              @click="captureCfBack"
            />
            <q-uploader
              v-if="!fromCamera"
              auto-upload
              :factory="uploadCfBack"
              max-file-size="2048000"
              accept=".jpg"
              style="max-width: 300px"
              label="Acquisizione da file (solo jpg)"
            />
          </div>
        </div>
        <div class="row" v-if="step == 7" stype="with: 100%">
          <div class="col">
            <img :src="imageCfFront" style="width: 300px" />
            <img :src="imageCfBack" style="width: 300px" />
          </div>
        </div>

        <div id="buttons" class="barButtons" v-if="step == 7">
          <q-btn class="bottomLeft" @click="prevStep">Indietro</q-btn>
          <q-btn
            class="bottomRight"
            @click="nextStep"
            :disabled="observer7.invalid"
            >Avanti</q-btn
          >
        </div>
      </ValidationObserver>

      <ValidationObserver v-slot="observer8">
        <!-- Step 8 final check -->
        <div class="row" v-if="step == 8">
          <Signature :uuid="uuid"></Signature>
          <div class="col">
            <pdf
              :src="fileFinalDocument"
              style="display: inline-block; width: 20%"
              v-on:click="pagePdf++"
              :page="pagePdf"
            ></pdf>
          </div>
        </div>
        <div class="row" v-if="step == 8">
          <div class="col">
            <q-btn
              color="primary"
              icon="mail"
              label="Invia per email al cliente"
              @click="sendFinalDocumentByEmail"
            />
            <q-btn
              color="primary"
              icon="document"
              label="Visualizza"
              @click="openFinalDocument"
            />
          </div>
        </div>

        <div id="buttons" class="barButtons" v-if="step == 8">
          <q-btn class="bottomLeft" @click="prevStep">Indietro</q-btn>
          <q-btn
            class="bottomRight"
            @click="nextStep"
            :disabled="observer8.invalid"
            >Avanti</q-btn
          >
        </div>
      </ValidationObserver>
    </div>

    <q-dialog
      v-model="helpAddress"
      persistent
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card class="bg-teal text-white" style="width: 300px">
        <q-card-section>
          <div class="text-h6">
            Istruzioni sulla compilazione dell'indirizzo
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <p>
            Il formato è
            <b>[Frazione] Via o Piazza, numero, CAP, Città, Provincia</b>
          </p>
          <ul>
            <p>
              Dopo la virgola va un solo spazio. La virgola è attaccata alla
              parola precedente.
            </p>
            <p>
              Il numero richiede solo cifre alfa-numeriche, NON scrivere n. o N.
            </p>
            <p>
              La provincia richiede solo due caratteri maiuscoli senza parentesi
            </p>
          </ul>
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="OK" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script lang="js">
import { mapState } from 'vuex'
import {Store} from '../store'
import { ValidationProvider, ValidationObserver, extend, localize } from 'vee-validate';
import validator from "./validator"
import { Plugins, CameraResultType } from '@capacitor/core'
import pdf from 'vue-pdf'
import Signature from "../components/Signature.vue"
const { Camera } = Plugins

export default {
  data() {
    return {
      step: 1,
      stepMax: 8,
      fileFinalDocument: "",
      pagePdf: 1,
      fromCamera: true,
      helpAddress: false,
      isCompany: false,
      serviceCategories: [],
      selectedCategory: {label: "Internet", value: "Internet", icon: ''},
      serviceTemplates: [],
      selectedCustomer: {},
      selectedContract: {},
      selectedServicesTemplate: [],
      valueSelectedServices: {activationPrice: 0.0, price :0.0, vat: 0.0, total: 0.0},
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
          name: "unit",
          label: "Unità",
          field: "unit",
          sortable: true
        },
        {
          name: "activationPrice",
          label: "Costo attivazione",
          field: "activationPrice",
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
      ],
      imageCfFront: '',
      imageCfBack: '',
      imageCiFront: '',
      imageCiBack: '',
      uuid: '' //Identifier of client data as images
    }
  },
  methods: {
    nextStep() {
      if(this.step<this.stepMax) this.step++;
      if(this.step==8) this.generateFinalDocument();
    },
    prevStep() {
      if(this.step>=2) this.step--;
    },
    generateFinalDocument() {
      this.selectedCustomer.uuid=this.uuid;
      this.selectedContract.signature=this.uuid;
      //Compute contract data
      if(this.selectedContract)
      {
        if(!this.selectedContract.objData) this.selectedContract.objData={};
        this.selectedContract.objData.valueSelectedServices=this.valueSelectedServices;
      }

      this.$axios.post('/adminarea/registration/generate_final_document', {
          customer: this.selectedCustomer,
          contract: this.selectedContract
        })
        .then(response => {
            if (response.data.status === "OK") {
              this.fileFinalDocument=response.data.results.urlFinalDocument;
              console.log(this.fileFinalDocument);
              this.makeToast(response.data.msg);
            }
          })
          .catch(error => {
            console.log(error);
            this.makeToast("Si è verificato un errore");
          });
    },
    openFinalDocument() {
      window.open(this.fileFinalDocument);
    },
    sendFinalDocumentByEmail() {
      this.selectedCustomer.uuid=this.uuid;
      this.$axios.post('/adminarea/registration/send_final_document', {
          customer: this.selectedCustomer,
          contract: this.selectedContract
        })
        .then(response => {
          if (response.data.status === "OK") {
            console.log(response.data.results.infoEmail);
            this.makeToast(response.data.msg);
          }
          else{
            this.makeToast("Si è verificato un errore.");
          }
        })
        .catch(error => {
            console.log(error);
            this.makeToast("Si è verificato un errore");
        });
    },
    getValueSelectedServices: function() {
      var price=0, vat=0, total=0, activationPrice=0;
      this.valueSelectedServices={price: 0, vat: 0, total: 0};
        this.selectedServicesTemplate.forEach((element, index, array) => {
          activationPrice+=element.activationPrice;
          price+=element.price;
          vat+=(element.price*element.vat)/100;
          total=price+vat;

          if(index===array.length-1) {
            const formatter = new Intl.NumberFormat('it-IT', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 2
            })
            price=formatter.format(price);
            vat=formatter.format(vat);
            total=formatter.format(total);
            activationPrice=formatter.format(activationPrice);
            this.valueSelectedServices={"activationPrice": activationPrice, "price": price, "vat": vat, "total": total};
          }
        });
      },
    changeCategory: function() {
      const store=this.$store;
      this.$axios.post('/adminarea/serviceTemplate/getByCategory', {category: this.selectedCategory})
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
                    this.serviceCategories.push({label: element.description, value: element.value, icon: ''})
                  });
                  this.makeToast(response.data.msg);
              }
            })
            .catch(error => {
                console.log(error);
            });
    },
    getAllServiceTemplates() {
      this.$axios.post('/adminarea/serviceTemplate/getall', {})
          .then(response => {
              if (response.data.status === "OK") {
                  this.serviceTemplates = response.data.serviceTemplates;
                  console.log(this.serviceTemplates);
                  this.makeToast(response.data.msg);
              }
          })
          .catch(error => {
              console.log(error);
          });
    },
    async captureCiFront () {
      const image = await Camera.getPhoto({width: 600, height: 350, quality: 100, allowEditing: true, resultType: CameraResultType.base64});
      this.imageCiFront = "data:image/png;base64, "+image.base64String;
      this.uploadIdentityDocumentImage("CiFront-"+this.uuid, image.base64String);
    },
    async captureCiBack () {
      const image = await Camera.getPhoto({width: 600, height: 350, quality: 100, allowEditing: true, resultType: CameraResultType.base64});
      this.imageCiBack = "data:image/png;base64, "+image.base64String;
      this.uploadIdentityDocumentImage("CiBack-"+this.uuid, image.base64String);
    },
    async captureCfFront () {
      const image = await Camera.getPhoto({width: 600, height: 350, quality: 100, allowEditing: true, resultType: CameraResultType.base64});
      this.imageCfFront = "data:image/png;base64, "+image.base64String
      this.uploadIdentityDocumentImage("CfFront-"+this.uuid, image.base64String);
    },
    async captureCfBack () {
      const image = await Camera.getPhoto({width: 600, height: 350, quality: 100, allowEditing: true, resultType: CameraResultType.base64});
      this.imageCfBack = "data:image/png;base64, "+image.base64String;
      this.uploadIdentityDocumentImage("CfBack-"+this.uuid, image.base64String);
    },
    uploadCiFront(file) {
      let fileName="CiFront-"+this.uuid+".jpg";
      this.uploadIdentityDocumentFile(fileName,file);
    },
    uploadCiBack(file) {
      let fileName="CiBack-"+this.uuid+".jpg";
      this.uploadIdentityDocumentFile(fileName,file);
    },
    uploadCfFront(file) {
      let fileName="CfFront-"+this.uuid+".jpg";
      this.uploadIdentityDocumentFile(fileName,file);
    },
    uploadCfBack(file) {
      let fileName="CfBack-"+this.uuid+".jpg";
      this.uploadIdentityDocumentFile(fileName,file);
    },
    uploadIdentityDocumentImage(imageName, imageData) {
      let data = new FormData();
      data.append('imageName', imageName);
      data.append('file', imageData);
      this.$axios.post('/adminarea/upload/identity_document/image', data, {header : {'Content-Type' : 'image/png'}})
        .then(response => {
            if (response.data.status === "OK") {
                this.makeToast(response.data.msg);
            }
          })
          .catch(error => {
              console.log(error);
              this.makeToast("Si è verificato un errore");
          });
    },
    uploadIdentityDocumentFile (fileName, file) {
      let data = new FormData();
      data.append('fileName', fileName);
      data.append('file', file[0]);
      this.$axios.post('/adminarea/upload/identity_document/file', data, {headers: {'Content-Type': 'multipart/form-data'}})
      .then(response => {
          if (response.data.status === "OK") {
              this.makeToast(response.data.msg);
          }
        })
        .catch(error => {
            console.log(error);
            this.makeToast("Si è verificato un errore");
        });
    },
    getUuid() {
      this.$axios.post('/adminarea/get_uuid', {})
        .then(response => {
            if (response.data.status === "OK") {
                this.uuid=response.data.results.uuid;
            }
          })
          .catch(error => {
              console.log(error);
          });
    },
    makeToast(string) {
      this.$q.notify({color: 'green-4', textColor: 'white', icon: 'info', message: string});
    }
  },
  mounted() {
    validator.setup();
    this.getAllServiceTemplates();
    this.getAllServiceCategories();
    this.getUuid();
    this.selectedCustomer.uuid=this.uuid;
  },
  computed: mapState({
    user: 'user',
    customer: 'customer',
    contract: 'contract',
    }),
    components: {
      ValidationProvider,
      ValidationObserver,
      pdf,
      Signature
    },
    beforeRouteEnter(to, from, next) {
      var currentUser = Store.state.user;
      console.log(currentUser);
      if ((currentUser.role === "admin")      ||
          (currentUser.role === "manager")    ||
          (currentUser.role === "technician") ||
          (currentUser.role === "installer")  ||
          (currentUser.role === "seller"))    next();
      else next("/Login");
    }
}
</script>

<style scoped>
.valid {
  border-color: rgb(0, 255, 0);
  background-color: rgb(0, 255, 0);
}

.invalid {
  border-color: rgb(255, 0, 0);
  background-color: rgb(255, 0, 0);
}

.error {
  color: rgb(127, 127, 0);
  background-color: yellow;
  font-style: italic;
}

.bottomLeft {
  position: absolute;
  bottom: 10px;
  left: 10px;
}

.bottomRight {
  position: absolute;
  bottom: 10px;
  right: 10px;
}
.barButtons {
  padding-top: 50px;
  width: 100%;
}
</style>
