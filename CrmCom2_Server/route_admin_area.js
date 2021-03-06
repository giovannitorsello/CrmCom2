const config = require("./config.js").load();
const utility = require("./utility.js");
const mailer = require("./mailer.js");
const formidable = require("formidable");
const Jimp = require("jimp");
const pdf = require("./pdf.js");
const { Op } = require("sequelize");
const { fork } = require("child_process");
const fs = require("fs");
const https = require("https");
const http = require("https");
const { Sequelize, Model, DataTypes } = require("sequelize");
const path = require("path");
const toUint8Array = require("base64-to-uint8array");
const axios = require("axios");

//Geo library
const proj4 = require("proj4");
const pingServer = require("./pingServer.js");
const freeradius = require("./freeradius.js");
const { AppearanceCharacteristics } = require("pdf-lib");

module.exports = {
  load_routes(app, database) {
    pingServer.startServer(app, database);

    /////////////////////FIREWALL UTILITIES //////////////////////
    app.post("/adminarea/firewall/generate/csv/files", function (req, res) {
      //Search in databases all customer devices, select only WIFI device of WIFINETCOM SRL
      database.entities.deviceCustomer
        .findAll({
          where: { techasset: "WIFI", companyasset: "WIFINETCOM SRL" },
        })
        .then(function (results) {
          if (results !== null) {
            // send devices to FirewallCommandServer and wait
            var url =
              config.firewallcommandserver.protocol +
              config.firewallcommandserver.host +
              ":" +
              config.firewallcommandserver.port +
              "/write/csv/files";
            axios
              .post(url, {
                secret: config.firewallcommandserver.secret,
                devices: results,
              })
              .then((response) => {
                res.send({
                  status: response.data.status,
                  msg: response.data.msg,
                  result: response.data.result,
                });
              })
              .catch((error) => {
                res.send({
                  status: "error",
                  msg: "File CSV not created on firewall",
                  result: {},
                });
              });
          } else res.send({ status: "error", msg: "File CSV not created on firewall", result: {} });
        });
    });

    app.post("/adminarea/firewall/reload/rules", function (req, res) {
      var url =
        config.firewallcommandserver.protocol +
        config.firewallcommandserver.host +
        ":" +
        config.firewallcommandserver.port +
        "/reload/firewall/rules";
      axios
        .post(url, { secret: config.firewallcommandserver.secret })
        .then((response) => {
          res.send({
            status: response.data.status,
            msg: response.data.msg,
            result: response.data.result,
          });
        })
        .catch((error) => {
          res.send({
            status: "error",
            msg: "File CSV not created on firewall",
            result: {},
          });
        });
    });

    app.post("/adminarea/firewall/reload/bandwidth", function (req, res) {
      var url =
        config.firewallcommandserver.protocol +
        config.firewallcommandserver.host +
        ":" +
        config.firewallcommandserver.port +
        "/reload/firewall/bandwidth";
      axios
        .post(url, { secret: config.firewallcommandserver.secret })
        .then((response) => {
          res.send({
            status: response.data.status,
            msg: response.data.msg,
            result: response.data.result,
          });
        })
        .catch((error) => {
          res.send({
            status: "error",
            msg: "File CSV not created on firewall",
            result: {},
          });
        });
    });

    /////////////////////GENERAL UTILITIES //////////////////////
    app.post("/adminarea/find_obj_by_field", function (req, res) {
      const searchObj = req.body.searchObj;
      const type = searchObj.type;
      const fields = searchObj.fields;
      const value = "%" + searchObj.value + "%";
      const whereObj = { where: {} };

      var orArray = [];
      fields.forEach(function (element, index, array) {
        orArray.push({ [element]: { [Op.like]: value } });
      });
      const orObj = { [Op.or]: orArray };
      whereObj["where"] = orObj;

      database.entities[type].findAll(whereObj).then(function (results) {
        if (results !== null)
          res.send({
            status: "OK",
            msg: "Fulltext search success",
            results: results,
          });
        else
          res.send({
            status: "error",
            msg: "Fulltext search fail",
            results: {},
          });
      });
    });

    app.post("/adminarea/fulltextsearch", function (req, res) {
      var str_search = req.body.textToSearch;
      var sql =
        "SELECT * FROM customers WHERE (" +
        " (customers.firstname LIKE value)  OR" +
        " (customers.lastname LIKE value) OR" +
        " (customers.codfis LIKE value) OR" +
        " (customers.vatcode LIKE value) OR" +
        " (customers.email LIKE value) OR" +
        " (customers.pec LIKE value) OR" +
        " (customers.phone LIKE value) OR" +
        " (customers.mobilephone LIKE value) OR" +
        " (customers.company LIKE value) OR" +
        " (customers.city LIKE value));";

      sql = sql.replace(/value/g, "'%" + str_search + "%'");
      database.execute_raw_query(sql, function (items) {
        if (items !== null)
          res.send({
            status: "OK",
            msg: "Fulltext search success",
            results: items,
          });
        else
          res.send({
            status: "error",
            msg: "Fulltext search fail",
            results: {},
          });
      });
    });

    app.post("/adminarea/upload/identity_document/image", function (req, res) {
      var form = new formidable.IncomingForm();
      form.parse(req, function (err, fields, files) {
        const image_data_base64 = fields.file;
        const image_file_png =
          process.cwd() +
          config.paths.customer_identity_document +
          fields.imageName +
          ".png";
        const image_file_jpg =
          process.cwd() +
          config.paths.customer_identity_document +
          fields.imageName +
          ".jpg";
        const byteCharacters = toUint8Array(image_data_base64);
        const image_data = new Uint8Array(Buffer.from(byteCharacters));
        fs.writeFile(image_file_png, image_data, function () {
          Jimp.read(image_file_png, function (err, image) {
            if (err) {
              console.log(err);
              res.send({
                status: "error",
                msg: "Immagine non salvata",
                results: {},
              });
            } else {
              //image.bitmap = floydSteinberg(image.bitmap);
              image.resize(600, 350).quality(50).write(image_file_jpg);
              //Delete old png file
              fs.unlink(image_file_png, function (err) {
                res.send({
                  status: "OK",
                  msg: "Immagine salvata",
                  results: {},
                });
              });
            }
          });
        });
      });
    });

    app.post("/adminarea/upload/identity_document/file", function (req, res) {
      var form = new formidable.IncomingForm();
      form.uploadDir = config.paths.customer_identity_document;

      form.parse(req, function (err, fields, files) {
        let newFileName =
          config.paths.customer_identity_document + fields.fileName;
        let oldFileName = files.file.path;
        fs.rename(oldFileName, newFileName, function (err) {
          Jimp.read(newFileName, function (err, image) {
            if (err) {
              console.log(err);
            } else {
              image.resize(600, 350).quality(50).write(newFileName);
            }
          });
        });
      });
    });

    app.post("/adminarea/get_uuid", function (req, res) {
      var uuid_str = utility.makeUuid();
      res.send({
        status: "OK",
        msg: "UUID generated",
        results: { uuid: uuid_str },
      });
    });

    ////////////////////REGISTRATION/////////////////////
    app.post(
      "/adminarea/registration/save_contract",
      function (req, res) {
        var customer = req.body.customer;
        var contract = req.body.contract;
        var services = req.body.services;
        //save customer
        utility.save_customer(customer, resCustomer => {
          if(resCustomer.status==="OK") {
            contract.customerId=resCustomer.customer.id;
            utility.save_contract(contract, (resContract) => {
              if(resContract.status==="OK"){
                var errContrServices=0;
                for(var i=0; i<services.length;i++) {
                  database.entities.serviceTemplate.findOne({ where: {id: services[i].id} }).then(async (serviceTempl)=> {
                    var contrService=await utility.save_contractService(serviceTempl, resContract.contract);
                    if(!contrService && !constrService.id) 
                      errContrServices=1;
                  });                  
                }
                if(errContrServices)
                  res.send({
                    status: "Error",
                    msg: "Error in save contract",
                    results: { customer: customer, contract: contract, sevices: services }
                  });
                else
                  res.send({
                    status: "OK",
                    msg: "Contract saved",
                    results: { customer: customer, contract: contract, sevices: services }
                  });
              }
            });
          }
        })
      }
    );
    app.post(
      "/adminarea/registration/generate_final_document",
      function (req, res) {
        var customer = req.body.customer;
        var contract = req.body.contract;
        var services = req.body.services;
        pdf.compileContractTemplate(customer, contract, services).then((finalDocument)=> {
          var url =
            "https://" +
            config.server.hostname +
            ":" +
            config.server.http_port +
            finalDocument.localPath;
          if (fs.existsSync(finalDocument.absolutePath))
            res.send({
              status: "OK",
              msg: "Documento finale presente",
              results: { urlFinalDocument: url },
            });
          else
            res.send({
              status: "OK",
              msg: "Torna indietro e correggi",
              results: {},
            });
        }).catch(error => {
          res.send({
            status: "Error",
            msg: "Errore di generazione pdf",
            results: {},
          });
        });

        /*pdf.createIdentidyDocumentsPage(customer, function () {
          pdf.compileContractTemplate(
            customer,
            contract,
            finalDocument => {
              var url =
                "http://" +
                config.server.hostname +
                ":" +
                config.server.http_port +
                finalDocument;
              if (fs.existsSync(process.cwd() + finalDocument))
                res.send({
                  status: "OK",
                  msg: "Documento finale presente",
                  results: { urlFinalDocument: url },
                });
              else
                res.send({
                  status: "OK",
                  msg: "Torna indietro e correggi",
                  results: {},
                });
            }
          );
        });*/
      }
    );
    app.post(
      "/adminarea/registration/send_final_document",
      function (req, res) {
        var customer=req.body.customer;
        if (!customer || !customer.uuid) return;
        var baseProcessPath=process.cwd();
        const fileName = baseProcessPath+config.paths.contractsFolder+"contract-"+customer.uuid+".pdf";
        var email = "giovanni.torsello@gmail.com"; //req.body.email;        
        mailer.sendEmail(
          email,
          "Invio contratto",
          "Invio automatico documento finale di avvio contratto",
          fileName,
          function (data) {
            res.send(data);
          }
        );
      }
    );
    app.post("/adminarea/registration/get_contract", function (req, res) {
      var uuid_str = req.body.uuid;
      const fileName = "./documents/IdentDoc-" + uuid_str + ".pdf";
      var url =
        "http://" +
        config.server.hostname +
        ":" +
        config.server.http_port +
        "/" +
        fileName;
      if (fs.existsSync(fileName))
        res.send({
          status: "OK",
          msg: "Documento finale presente",
          results: { urlFinalDocument: url },
        });
      else
        res.send({
          status: "OK",
          msg: "Torna indietro e correggi",
          results: {},
        });
    });
    app.post("/adminarea/registration/signature", function (req, res) {
      var signatureData = req.body.signatureData;
      var uuid = req.body.uuid;
      var fileNameSignature =
        process.cwd() + "/documents/signatures/" + uuid + ".png";
      var base64Data = signatureData.replace(/^data:image\/png;base64,/, "");

      fs.writeFile(fileNameSignature, base64Data, "base64", function (err) {
        if (!err)
          res.send({
            status: "OK",
            msg: "Firma salvata",
            results: {},
          });
        else
          res.send({
            status: "error",
            msg: "Errore di salvataggio",
            results: {},
          });
      });
    });

    /////////////////////GENERAL//////////////////////////
    app.post("/adminarea/get_session", function (req, res) {
      if (req.session) res.send({ session: req.session, status: "OK" });
      else res.send({ session: {}, status: "error" });
    });

    /////////////////////ASSETS///////////////////////////
    app.post("/adminarea/assets", function (req, res) {
      res.send(config.assets);
    });

    /////////////////////OLO///////////////////////////
    app.post("/adminarea/olo/get_by_id", function (req, res) {
      var id_obj = req.body.id;
      database.entities.olo2olo
        .findOne({ where: { id: id_obj } })
        .then(function (oloEntity) {
          if (oloEntity) {
            res.send({ status: "OK", msg: "Olo entity found", olo: oloEntity });
          } else res.send({ status: "error", msg: "Olo entity not found", olo: {} });
        });
    });

    app.post("/adminarea/olo/getall", function (req, res) {
      database.entities.olo2olo.findAll().then(function (results) {
        res.send({ status: "OK", msg: "Olo entities found", olos: results });
      });
    });

    app.post("/adminarea/olo/insert", function (req, res) {
      var oloToInsert = req.body.olo;
      database.entities.olo2olo
        .findOne({ where: { id: oloToInsert.id } })
        .then(function (item) {
          if (item === null) {
            database.entities.olo2Olo
              .create(oloToInsert)
              .then(function (oloNew) {
                if (oloNew !== null) {
                  res.send({
                    status: "OK",
                    msg: "Olo entity created successfully",
                    olo: oloNew,
                  });
                }
              });
          } else {
            res.send({
              status: "error",
              msg: "Olo entity creation error",
              olo: oloToInsert,
            });
          }
        });
    });

    app.post("/adminarea/olo/update", function (req, res) {
      var obj_updated = req.body.olo;
      if (obj_updated) {
        database.entities.olo2olo
          .findOne({ where: { id: obj_updated.id } })
          .then(function (obj) {
            obj = Object.assign({}, obj_updated);
            obj.save().then(function (objupdate) {
              if (objupdate !== null) {
                res.send({
                  status: "OK",
                  msg: "Olo entity update successfully",
                  olo: objupdate,
                });
              } else res.send({ status: "error", msg: "Olo entity update error", olo: obj });
            });
          });
      }
    });

    app.post("/adminarea/olo/delete", function (req, res) {
      var oloToDel = req.body.olo;
      if (oloToDel) {
        database.entities.olo2olo
          .findOne({ where: { id: oloToDel.id } })
          .then(function (obj) {
            if (obj !== null) {
              obj.destroy();
              res.send({
                status: "OK",
                msg: "Olo entity deleted successfully",
                olo: obj,
              });
            } else {
              res.send({
                status: "error",
                msg: "Olo entity delete error",
                olo: oloToDel,
              });
            }
          });
      }
    });

    /////////////////////Invoice Entry///////////////////////////
    app.post("/adminarea/invoiceEntry/get_by_id", function (req, res) {
      var id_obj = req.body.id;
      database.entities.invoiceEntry
        .findOne({ where: { id: id_obj } })
        .then(function (invEntry) {
          if (invEntry) {
            res.send({
              status: "OK",
              msg: "Invoice entry found",
              invoiceEntry: invEntry,
            });
          } else res.send({ status: "error", msg: "Invoice entry not found", invoiceEntry: {} });
        });
    });

    app.post("/adminarea/invoiceEntry/getall", function (req, res) {
      database.entities.invoiceEntry.findAll().then(function (results) {
        res.send({
          status: "OK",
          msg: "Invoice entries found",
          invoiceEntries: results,
        });
      });
    });

    app.post("/adminarea/invoiceEntry/insert", function (req, res) {
      var invEntry = req.body.invoiceEntry;
      database.entities.invoiceEntry
        .findOne({ where: { id: obj.id } })
        .then(function (item) {
          if (item === null) {
            database.entities.invoiceEntry
              .create(obj)
              .then(function (invEntryNew) {
                if (objnew !== null) {
                  res.send({
                    status: "OK",
                    msg: "Invoice entry created successfully",
                    invoiceEntry: invEntryNew,
                  });
                }
              });
          } else {
            res.send({
              status: "error",
              msg: "Invoice entry creation error",
              invoiceEntry: invEntry,
            });
          }
        });
    });

    app.post("/adminarea/invoiceEntry/update", function (req, res) {
      var obj_updated = req.body.invoiceEntry;
      if (obj_updated) {
        database.entities.invoiceEntry
          .findOne({ where: { id: obj_updated.id } })
          .then(function (obj) {
            obj.description = obj_selected.description;
            obj.unit = obj_selected.unit;
            obj.number = obj_selected.number;
            obj.price = obj_selected.price;
            obj.vat = obj_selected.vat;
            obj.creationdate = obj_selected.creationdate;

            obj.save().then(function (objupdate) {
              if (objupdate !== null) {
                res.send({
                  status: "OK",
                  msg: "Invoce entry update successfully",
                  invoiceEntry: objupdate,
                });
              } else res.send({ status: "error", msg: "Invoce entry update error", invoiceEntry: obj });
            });
          });
      }
    });

    app.post("/adminarea/invoiceEntry/delete", function (req, res) {
      var invEntryToDel = req.body.invoiceEntry;
      if (invEntryToDel) {
        database.entities.invoiceEntry
          .findOne({ where: { id: invEntryToDel.id } })
          .then(function (obj) {
            if (obj !== null) {
              obj.destroy();
              res.send({
                status: "OK",
                msg: "Invoice entry deleted successfully",
                invoiceEntry: obj,
              });
            } else {
              res.send({
                status: "error",
                msg: "Invoice entry delete error",
                invoiceEntry: objsel,
              });
            }
          });
      }
    });

    /////////////////////Invoice ///////////////////////////
    app.post("/adminarea/invoice/get_by_id", function (req, res) {
      var id_obj = req.body.id;
      database.entities.invoice
        .findOne({ where: { id: id_obj } })
        .then(function (inv) {
          if (inv) {
            res.send({ status: "OK", msg: "Invoice found", invoice: inv });
          } else res.send({ status: "error", msg: "Invoice not found", invoice: inv });
        });
    });

    app.post("/adminarea/invoice/getall", function (req, res) {
      database.entities.invoice.findAll().then(function (results) {
        if (results) {
          res.send({ status: "OK", msg: "Invoices found", invoices: results });
        } else res.send({ status: "error", msg: "Invoices not found", invoices: {} });
      });
    });

    app.post("/adminarea/invoice/insert", function (req, res) {
      var obj = req.body;
      database.entities.invoice
        .findOne({ where: { description: obj.description } })
        .then(function (item) {
          if (item === null) {
            database.entities.invoice.create(obj).then(function (objnew) {
              if (objnew !== null) {
                res.send({
                  status: "OK",
                  msg: "Invoice created successfully",
                  invoice: objnew,
                });
              }
            });
          } else {
            res.send({
              status: "error",
              msg: "Invoice creation error",
              invoice: obj,
            });
          }
        });
    });

    app.post("/adminarea/invoice/update", function (req, res) {
      var obj_selected = req.body.invoice;
      if (obj_selected) {
        database.entities.invoice
          .findOne({ where: { id: obj_selected.id } })
          .then(function (obj) {
            obj.number = obj_updated.number;
            obj.invoicestate = obj_updated.invoicestate;
            obj.businnesstate = obj_updated.businnesstate;
            obj.totalentries = obj_updated.totalentries;
            obj.totalvat = obj_updated.totalvat;
            obj.totalinvoice = obj_updated.totalinvoice;
            obj.invoicedate = obj_updated.invoicedate;
            obj.creationdate = obj_updated.creationdate;

            obj.save().then(function (objupdate) {
              if (objupdate !== null) {
                res.send({
                  status: "OK",
                  msg: "Invoice update successfully",
                  invoice: objupdate,
                });
              } else res.send({ status: "error", msg: "Invoice update error", invoice: obj });
            });
          });
      }
    });

    app.post("/adminarea/invoice/delete", function (req, res) {
      var objsel = req.body.invoice;
      if (objsel)
        database.entities.invoice
          .findOne({ where: { id: objsel.id } })
          .then(function (obj) {
            if (obj !== null) {
              obj.destroy();
              res.send({
                status: "OK",
                msg: "Invoice deleted successfully",
                invoice: obj,
              });
            } else {
              res.send({
                status: "error",
                msg: "Invoice delete error",
                invoice: objsel,
              });
            }
          });
    });

    /////////////////////Device Customer///////////////////////////
    app.post("/adminarea/deviceCustomer/get_by_id", function (req, res) {
      var idDevice = req.body.idDevice;
      database.entities.deviceCustomer
        .findOne({ where: { id: idDevice } })
        .then(function (dev) {
          if (dev) {
            res.send({
              status: "OK",
              msg: "Device found",
              deviceCustomer: dev,
            });
          } else res.send({ status: "error", msg: "Device not found", deviceCustomer: {} });
        });
    });

    app.post("/adminarea/deviceCustomer/getall", function (req, res) {
      database.entities.deviceCustomer.findAll().then(function (results) {
        if (results)
          res.send({
            status: "OK",
            msg: "Devices found",
            devicesCustomer: results,
          });
        else
          res.send({
            status: "OK",
            msg: "Devices not found",
            devicesCustomer: {},
          });
      });
    });

    app.post("/adminarea/deviceCustomer/insert", function (req, res) {
      var obj = req.body;
      database.entities.deviceCustomer
        .findOne({ where: { ipv4: obj.ipv4 } })
        .then(function (item) {
          if (item === null) {
            database.entities.deviceCustomer
              .create(obj)
              .then(function (objnew) {
                if (objnew !== null) {
                  freeradius.updateDevice(objnew);
                  res.send({
                    status: "OK",
                    msg: "Device created successfully",
                    deviceCustomer: objnew,
                  });
                }
              });
          } else {
            res.send({
              status: "error",
              msg: "Device creation error",
              deviceCustomer: obj,
            });
          }
        });
    });

    app.post("/adminarea/deviceCustomer/update", function (req, res) {
      var obj_updated = req.body.device;
      if (!obj_updated.id) {
        //Nuovo inserimento
        database.entities.deviceCustomer
          .findOne({ where: { ipv4: obj_updated.ipv4 } })
          .then(function (item) {
            if (item === null) {
              obj_updated.uid = utility.makeUuid();
              database.entities.deviceCustomer
                .create(obj_updated)
                .then(function (objnew) {
                  if (objnew !== null) {
                    res.send({
                      status: "OK",
                      msg: "Device created successfully",
                      deviceCustomer: objnew,
                    });
                    freeradius.updateDevice(objnew);
                  }
                });
            } else {
              res.send({
                status: "error",
                msg: "Device creation error (check ip number)",
                deviceCustomer: obj_updated,
              });
            }
          });
      } else {
        //Aggiornamento
        database.entities.deviceCustomer
          .findOne({ where: { id: obj_updated.id } })
          .then(function (obj) {
            //Rimozione da monitoring
            if (
              obj.monitored === "monitored" &&
              obj_updated.monitored !== "monitored"
            )
              pingServer.removeMonitoredCustomer(obj);
            //Inserimento da monitoring
            if (obj_updated.monitored === "monitored")
              pingServer.insertMonitoredCustomer(obj);

            obj.description = obj_updated.description;
            obj.techasset = obj_updated.techasset;
            obj.companyasset = obj_updated.companyasset;
            obj.type = obj_updated.type;
            obj.vendor = obj_updated.vendor;
            obj.model = obj_updated.model;
            obj.mac = obj_updated.mac;
            obj.ipv4 = obj_updated.ipv4;
            obj.ipv6 = obj_updated.ipv6;
            obj.state = obj_updated.state;
            obj.monitored = obj_updated.monitored;
            obj.note = obj_updated.note;
            obj.companyasset = obj_updated.companyasset;
            obj.techasset = obj_updated.techasset;
            obj.customerId = obj_updated.customerId;
            obj.contractId = obj_updated.contractId;
            obj.objData = obj_updated.objData;

            obj.save().then((objupdate) => {
              if (objupdate !== null) {
                res.send({
                  status: "OK",
                  msg: "Device update successfully",
                  deviceCustomer: objupdate,
                });
                freeradius.updateDevice(objupdate);
              } else {
                res.send({
                  status: "error",
                  msg: "Device update error",
                  deviceCustomer: obj_updated,
                });
              }
            });
          });
      }
    });

    app.post("/adminarea/deviceCustomer/delete", function (req, res) {
      var objsel = req.body.device;
      database.entities.deviceCustomer
        .findOne({ where: { id: objsel.id } })
        .then(function (obj) {
          if (obj !== null) {
            obj.destroy();
            res.send({
              status: "OK",
              msg: "Device deleted successfully",
              deviceCustomer: obj,
            });
            freeradius.deleteDevice(obj);
          } else {
            res.send({
              status: "error",
              msg: "Device delete error",
              deviceCustomer: objsel,
            });
          }
        });
    });

    app.post(
      "/adminarea/deviceCustomer/get_all_by_contract",
      function (req, res) {
        var idContract = req.body.idContract;
        if(!idContract) {
          res.send({
            status: "OK",
            msg: "Devices found",
            devicesCustomer: {},
          });
        }
        else
          database.entities.deviceCustomer
            .findAll({ where: { contractId: idContract } })
            .then(function (results) {
              if (results)
                res.send({
                  status: "OK",
                  msg: "Devices found",
                  devicesCustomer: results,
                });
              else
                res.send({
                  status: "OK",
                  msg: "Devices not found",
                  devicesCustomer: {},
                });
          });
      }
    );

    app.post("/adminarea/deviceCustomer/getMonitored", function (req, res) {
      pingServer.sendMonitoredCustomer(function (devices) {
        res.send({
          status: "OK",
          msg: "Stats monitored success",
          devicesCustomer: devices,
        });
      });
    });

    app.post("/adminarea/deviceCustomer/disable", function (req, res) {
      var dev = req.body.device;
      var url =
        config.firewallcommandserver.protocol +
        config.firewallcommandserver.host +
        ":" +
        config.firewallcommandserver.port +
        "/device/disable";
      axios
        .post(url, {
          secret: config.firewallcommandserver.secret,
          deviceCustomer: dev,
        })
        .then((response) => {
          res.send({
            status: response.data.status,
            msg: response.data.msg,
            devicesCustomer: dev,
          });
        })
        .catch((error) => {
          res.send({
            status: "error",
            msg: "Device not disabled",
            devicesCustomer: dev,
          });
        });
    });

    app.post("/adminarea/deviceCustomer/enable", function (req, res) {
      var dev = req.body.device;
      var url =
        config.firewallcommandserver.protocol +
        config.firewallcommandserver.host +
        ":" +
        config.firewallcommandserver.port +
        "/device/enable";
      axios
        .post(url, {
          secret: config.firewallcommandserver.secret,
          deviceCustomer: dev,
        })
        .then((response) => {
          res.send({
            status: response.data.status,
            msg: response.data.msg,
            devicesCustomer: dev,
          });
        })
        .catch((error) => {
          res.send({
            status: "error",
            msg: "Device not enabled",
            devicesCustomer: dev,
          });
        });
    });

    app.post("/adminarea/deviceCustomer/replaceBandwidth", function (req, res) {
      var dev = req.body.device;
      var url =
        config.firewallcommandserver.protocol +
        config.firewallcommandserver.host +
        ":" +
        config.firewallcommandserver.port +
        "/device/replaceBandwidth";
      axios
        .post(url, {
          secret: config.firewallcommandserver.secret,
          deviceCustomer: dev,
        })
        .then((response) => {
          res.send({
            status: response.data.status,
            msg: response.data.msg,
            devicesCustomer: dev,
          });
        })
        .catch((error) => {
          res.send({
            status: "error",
            msg: "Failed in device setting",
            devicesCustomer: dev,
          });
        });
    });

    app.post("/adminarea/deviceCustomer/deleteBandwidth", function (req, res) {
      var dev = req.body.device;
      var url =
        config.firewallcommandserver.protocol +
        config.firewallcommandserver.host +
        ":" +
        config.firewallcommandserver.port +
        "/device/deleteBandwidth";
      axios
        .post(url, {
          secret: config.firewallcommandserver.secret,
          deviceCustomer: dev,
        })
        .then((response) => {
          res.send({
            status: response.data.status,
            msg: response.data.msg,
            devicesCustomer: dev,
          });
        })
        .catch((error) => {
          res.send({
            status: "error",
            msg: "Failed in bandwidth deleting",
            devicesCustomer: dev,
          });
        });
    });

    app.post("/adminarea/deviceCustomer/getFreeIps", function (req, res) {
      utility.getNextFreeIps(freeIps => {
        res.send({
          status: "OK",
          msg: "Free ips found",
          freeIps: freeIps,
        });
      });
    });

    /////////////////////Service template ///////////////////////////
    app.post("/adminarea/serviceTemplate/get_by_id", function (req, res) {
      var id_obj = req.body.id;
      database.entities.serviceTemplate
        .findOne({ where: { id: id_obj } })
        .then(function (service) {
          if (service !== null) {
            res.send({
              status: "OK",
              msg: "Service template found",
              serviceTemplate: service,
            });
          } else {
            res.send({
              status: "OK",
              msg: "Service template error",
              serviceTemplate: {},
            });
          }
        });
    });

    app.post("/adminarea/serviceTemplate/getByCategory", function (req, res) {
      var category_selected = req.body.category;
      database.entities.serviceTemplate
        .findAll({ where: { category: category_selected.value } })
        .then(function (services) {
          if (services !== null) {
            res.send({
              status: "OK",
              msg: "Services template found",
              serviceTemplates: services,
            });
          } else {
            res.send({
              status: "OK",
              msg: "Services template error",
              serviceTemplates: [],
            });
          }
        });
    });

    app.post("/adminarea/serviceTemplate/getall", function (req, res) {
      database.entities.serviceTemplate.findAll().then(function (results) {
        if (results)
          res.send({
            status: "OK",
            msg: "Service templates found",
            serviceTemplates: results,
          });
        else
          res.send({
            status: "error",
            msg: "Service templates not found",
            serviceTemplates: {},
          });
      });
    });

    app.post("/adminarea/serviceTemplate/insert", function (req, res) {
      var obj = req.body.serviceTemplate;
      database.entities.serviceTemplate
        .findOne({ where: { description: obj.description } })
        .then(function (item) {
          if (item === null) {
            obj.code = utility.makeUuid();
            database.entities.serviceTemplate
              .create(obj)
              .then(function (objnew) {
                if (objnew !== null) {
                  res.send({
                    status: "OK",
                    msg: "Service template create successfully",
                    serviceTemplate: objnew,
                  });
                }
              });
          } else {
            res.send({
              status: "error",
              msg: "Service template creation error",
              serviceTemplate: obj,
            });
          }
        });
    });

    app.post("/adminarea/serviceTemplate/update", function (req, res) {
      var obj_updated = req.body.serviceTemplate;
      if (obj_updated) {
        database.entities.serviceTemplate
          .findOne({ where: { id: obj_updated.id } })
          .then(function (obj_selected) {
            if (obj_selected != null) {
              obj_selected.description = obj_updated.description;
              obj_selected.code = obj_updated.code;
              obj_selected.category = obj_updated.category;
              obj_selected.state = obj_updated.state;
              obj_selected.unit = obj_updated.unit;
              obj_selected.billingPeriod = obj_updated.billingPeriod;
              obj_selected.activationPrice = obj_updated.activationPrice;
              obj_selected.price = obj_updated.price;
              obj_selected.vat = obj_updated.vat;
              obj_selected.dayinvoicereminder = obj_updated.dayinvoicereminder;
              obj_selected.nopaydaysbeforedeactivation =
                obj_updated.nopaydaysbeforedeactivation;
              obj_selected.dayforexpirationwarning =
                obj_updated.dayforexpirationwarning;
                obj_selected.objData = obj_updated.objData;
                obj_selected.changed("objData", true);
              obj_selected.save().then(function (objupdate) {
                if (objupdate !== null) {
                  res.send({
                    status: "OK",
                    msg: "Service template update successfully",
                    serviceTemplate: objupdate,
                  });
                } else {
                  res.send({
                    status: "error",
                    msg: "Service template update error",
                    serviceTemplate: obj_selected,
                  });
                }
              });
            }
          });
      }
    });

    app.post("/adminarea/serviceTemplate/delete", function (req, res) {
      var objsel = req.body.serviceTemplate;
      database.entities.serviceTemplate
        .findOne({ where: { id: objsel.id } })
        .then(function (obj) {
          if (obj !== null) {
            obj.destroy();
            res.send({
              status: "OK",
              msg: "Service template deleted successfully",
              data: obj,
            });
          } else {
            res.send({
              status: "error",
              msg: "Service template delete error",
              data: objsel,
            });
          }
        });
    });

    app.post(
      "/adminarea/serviceTemplate/getAllServiceCategories",
      function (req, res) {
        if (config.serviceCategories)
          res.send({
            status: "OK",
            msg: "Service categories found",
            serviceCategories: config.serviceCategories,
          });
        else
          res.send({
            status: "error",
            msg: "Service categories not found",
            serviceTemplates: {},
          });
      }
    );

    /////////////////////Contract service ///////////////////////////
    app.post("/adminarea/contractService/get_by_id", function (req, res) {
      var id_obj = req.body.idContractService;
      database.entities.contractService
        .findOne({ where: { id: id_obj } })
        .then(function (item) {
          res.send({
            status: "OK",
            msg: "Service contract selected",
            data: item,
          });
        });
    });

    app.post("/adminarea/contractService/insert", function (req, res) {
      var idServiceTemplate = req.body.idServiceTemplate;
      var idContract = req.body.idContract;
      database.entities.serviceTemplate
        .findOne({ where: { id: idServiceTemplate } })
        .then(function (srvTempl) {
          if (srvTempl !== null) {
            database.entities.contract
              .findOne({ where: { id: idContract } })
              .then(function (contract) {
                if (contract !== null) {
                  var contrService = {};

                  contrService.description = srvTempl.description;
                  contrService.unit = srvTempl.unit;
                  contrService.code = utility.makeUuid();
                  contrService.category = srvTempl.category;
                  contrService.activationPrice = srvTempl.activationPrice;
                  contrService.price = srvTempl.price;
                  contrService.vat = srvTempl.vat;
                  contrService.state = "active";
                  contrService.billingPeriod = srvTempl.billingPeriod;
                  contrService.dayinvoicereminder = srvTempl.dayinvoicereminder;
                  contrService.nopaydaysbeforedeactivation =
                    srvTempl.nopaydaysbeforedeactivation;
                  contrService.lastbillingdate = srvTempl.lastbillingdate;
                  contrService.dayforexpirationwarning =
                    srvTempl.dayforexpirationwarning;
                  contrService.objData = srvTempl.objData;
                  database.entities.contractService
                    .create(contrService)
                    .then(function (objnew) {
                      if (objnew !== null) {
                        objnew.setContract(contract);                        
                        res.send({
                          status: "OK",
                          msg: "Service added successfully",
                          service: objnew,
                        });
                        objnew.save();
                      } else res.send({ status: "error", msg: "Insert service contract error", service: objnew });
                    });
                }
              });
          } else {
            res.send({
              status: "error",
              msg: "Insert service contract error",
              data: obj,
            });
          }
        });
    });

    app.post("/adminarea/contractService/update", function (req, res) {
      var obj_updated = req.body.service;
      database.entities.contractService
        .findOne({ where: { id: obj_updated.id } })
        .then(function (obj_selected) {
          obj_selected.description = obj_updated.description;
          obj_selected.state = obj_updated.state;
          obj_selected.unit = obj_updated.unit;
          obj_selected.billingPeriod = obj_updated.billingPeriod;
          obj_selected.price = obj_updated.price;
          obj_selected.activationPrice = obj_updated.activationPrice;
          obj_selected.vat = obj_updated.vat;
          obj_selected.dayinvoicereminder = obj_updated.dayinvoicereminder;
          obj_selected.nopaydaysbeforedeactivation =
            obj_updated.nopaydaysbeforedeactivation;
          obj_selected.dayforexpirationwarning =
            obj_updated.dayforexpirationwarning;
            obj_selected.objData = obj_updated.objData;
          obj_selected.save().then((objupdate) => {
            if (objupdate !== null) {
              res.send({
                status: "OK",
                msg: "Contract service update successfully",
                service: objupdate,
              });
            } else
              res.send({
                status: "error",
                msg: "Contract service update error",
                service: obj_selected,
              });
          });
        });
    });

    app.post("/adminarea/contractService/delete", function (req, res) {
      var idContractService = req.body.idContractService;
      database.entities.contractService
        .findOne({ where: { id: idContractService } })
        .then(function (ctrServ) {
          if (ctrServ !== null) {
            ctrServ.destroy();
            res.send({
              status: "OK",
              msg: "Service deleted successfully",
              service: ctrServ,
            });
          } else {
            res.send({
              status: "error",
              msg: "Delete service error",
              service: obj,
            });
          }
        });
    });

    app.post(
      "/adminarea/contractService/get_all_by_contract",
      function (req, res) {        
        var idContract = req.body.idContract;

        if(!idContract) {
          res.send({
            status: "OK",
            msg: "Services found",
            services: {},
          });          
        }
        else
          database.entities.contractService
            .findAll({ where: { contractId: idContract } })
            .then(function (results) {
              if (results)
                res.send({
                  status: "OK",
                  msg: "Services found",
                  services: results,
                });
              else
                res.send({
                  status: "error",
                  msg: "Services not found",
                  services: results,
                });
          });
      }
    );

    /////////////////////Contract ///////////////////////////
    app.post("/adminarea/contract/get_by_id", function (req, res) {
      var idContract = req.body.idContract;
      if (idContract)
        database.entities.contract
          .findOne({ where: { id: idContract } })
          .then(function (ctr) {
            if (ctr) {
              res.send({ status: "OK", msg: "Contract found", contract: ctr });
            } else res.send({ status: "error", msg: "Contract not found", contract: {} });
          });
    });

    app.post("/adminarea/contract/getall", function (req, res) {
      database.entities.contract.findAll().then(function (results) {
        if (resuts)
          res.send({
            status: "OK",
            msg: "contracts found",
            contracts: results,
          });
        else
          res.send({
            status: "error",
            msg: "contracts not found",
            contracts: results,
          });
      });
    });

    app.post("/adminarea/contract/insert", function (req, res) {
        var obj = req.body.contract;
        database.entities.contract
          .findOne({
            where: { description: obj.description, customerId: obj.customerId },
          })
          .then(function (item) {
            if (item === null) {
              obj.uid = utility.makeUuid();
              database.entities.contract.create(obj).then(function (objnew) {
                if (objnew !== null) {
                  res.send({
                    status: "OK",
                    msg: "Contract create successfully",
                    contract: objnew,
                  });
                }
                else {
                  res.send({
                    status: "error",
                    msg: "Contract creation error check all field data",
                    contract: obj,
                  });
                }
              });
            } else {
              res.send({
                status: "error",
                msg: "Contract creation error",
                contract: obj,
              });
            }
        });
    });

    app.post("/adminarea/contract/update", function (req, res) {
      var obj_updated = req.body.contract;
      //New insert
      if(!obj_updated.id) {
            database.entities.contract
            .findOne({
              where: { description: obj_updated.description, customerId: obj_updated.customerId },
            })
            .then(function (item) {
              if (item === null) {
                obj_updated.uid = utility.makeUuid();
                database.entities.contract.create(obj_updated).then(function (objnew) {
                  if (objnew !== null) {
                    res.send({
                      status: "OK",
                      msg: "Contract create successfully",
                      contract: objnew,
                    });
                  }
                });
              } else {
                res.send({
                  status: "error",
                  msg: "Contract creation error",
                  contract: obj,
                });
              }
          });
      }
      else {
        database.entities.contract
          .findOne({ where: { id: obj_updated.id } })
          .then(function (obj) {
            obj.description = obj_updated.description;
            obj.address = obj_updated.address;
            obj.state = obj_updated.state;
            obj.startdate = obj_updated.startdate;
            obj.enddate = obj_updated.enddate;
            obj.duration = obj_updated.duration;
            obj.billingPeriod = obj_updated.billingPeriod;
            obj.automaticrenew = obj_updated.automaticrenew;
            obj.businessflag = obj_updated.businessflag;

            database.saveContract(obj, function (objupdate) {
              if (objupdate !== null) {
                res.send({
                  status: "OK",
                  msg: "Contract update successfully",
                  contract: objupdate,
                });
              } else res.send({ status: "error", msg: "Contract update error", contract: obj_selected });
            });
          });        
      }
    });
    

    app.post("/adminarea/contract/delete", function (req, res) {
      var objsel = req.body.contract;
      database.entities.contract
        .findOne({ where: { id: objsel.id } })
        .then(function (obj) {
          if (obj !== null) {
            //Delete all services, device and contract
            database.deleteContract(obj);
            res.send({
              status: "OK",
              msg: "Contract deleted successfully",
              data: obj,
            });
          } else {
            res.send({
              status: "error",
              msg: "Contract delete error",
              data: objsel,
            });
          }
        });
    });

    app.post("/adminarea/contract/get_all_by_customer", function (req, res) {
      var id_customer = req.body.idCustomer;
      if (id_customer)
        database.entities.contract
          .findAll({ where: { customerId: id_customer } })
          .then(function (results) {
            if (results != null)
              res.send({
                status: "OK",
                msg: "contracts found",
                contracts: results,
              });
            else
              res.send({
                status: "error",
                msg: "no contracts for this customer",
                contracts: {},
              });
          });
    });

    /////////////////////Customer ///////////////////////////
    app.post("/adminarea/customer/get_by_id", function (req, res) {
      var userId = req.body.customerId;
      database.entities.customer
        .findOne({ where: { id: userId } })
        .then(function (customer) {
          res.send({ status: "OK", msg: "Customer found", customer: customer });
        });
    });

    app.post("/adminarea/customer/getall", function (req, res) {
      database.entities.customer.findAll().then(function (results) {
        res.send({ status: "OK", msg: "Customers found", data: results });
      });
    });

    app.post("/adminarea/customer/insert", function (req, res) {
      var obj = req.body;
      database.entities.customer
        .findOne({ where: { codfis: obj.codfis } })
        .then(function (cst) {
          if (cst === null) {
            obj.uid = utility.makeUuid();
            obj.username = obj.codfis;
            obj.password = utility.makePassword(8);
            database.entities.customer.create(obj).then(function (cstnew) {
              if (cstnew !== null) {
                res.send({
                  status: "OK",
                  msg: "Customer create successfully",
                  data: cstnew,
                });
              }
            });
          } else {
            res.send({
              status: "error",
              msg: "Customer creation error",
              data: cst,
            });
          }
        });
    });

    app.post("/adminarea/customer/update", function (req, res) {
      var customer_updated = req.body.customer;
      var search_opt = {};
      if (customer_updated.id && customer_updated.id !== "") {
        search_opt = { id: customer_updated.id };
      } else if (customer_updated.vatcode && customer_updated.vatcode !== "") {
        search_opt = { vatcode: customer_updated.vatcode };
      } else if (!customer_updated.vatcode && customer_updated.codfis !== "") {
        search_opt = { codfis: customer_updated.codfis };
      }

      database.entities.customer
        .findOne({
          where: search_opt,
        })
        .then((cst) => {
          //// Update section
          if (cst && cst.id !== "") {
            cst.businessflag = customer_updated.businessflag;
            cst.firstname = customer_updated.firstname;
            cst.lastname = customer_updated.lastname;
            cst.email = customer_updated.email;
            cst.pec = customer_updated.pec;
            cst.codfis = customer_updated.codfis;
            cst.phone = customer_updated.phone;
            cst.mobilephone = customer_updated.mobilephone;
            cst.address = customer_updated.address;
            cst.postalcode = customer_updated.postalcode;
            cst.city = customer_updated.city;
            cst.state = customer_updated.state;

            cst.company = customer_updated.company;
            cst.companyaddress = customer_updated.companyaddress;
            cst.companyphone = customer_updated.companyphone;
            cst.companypec = customer_updated.companypec;
            cst.vatcode = customer_updated.vatcode;
            cst.sdicode = customer_updated.sdicode;

            cst.username = customer_updated.username;
            cst.password = customer_updated.password;
            
            cst.save().then(function (cstupdate) {
              if (cstupdate !== null) {
                res.send({
                  status: "OK",
                  msg: "Customer update successfully",
                  customer: cstupdate,
                });
              } else {
                res.send({
                  status: "error",
                  msg: "Customer update error",
                  customer: cst,
                });
              }
            });
          }
          //New section
          if (!cst) {
            customer_updated.uid = utility.makeUuid();
            database.entities.customer
              .create(customer_updated)
              .then((cstnew) => {
                if (cstnew !== null) {
                  res.send({
                    status: "OK",
                    msg: "New customer insert successfully",
                    customer: cstnew,
                  });
                } else {
                  res.send({
                    status: "error",
                    msg: "Customer insert error",
                    customer: cstnew,
                  });
                }
              });
          }
        });
    });

    app.post("/adminarea/customer/delete", function (req, res) {
      var cst = req.body.customer;
      database.entities.customer
        .findOne({ where: { id: cst.id } })
        .then((csttodel) => {
          //Check if customer as contracts
          database.getCustomerContracts(csttodel, function (contracts) {
            if (!contracts || contracts.length === 0) {
              if (csttodel !== null) {
                csttodel.destroy();
                req.session.customer = {};
                res.send({
                  status: "OK",
                  msg: "Customer deleted successfully",
                  data: csttodel,
                });
              } else {
                res.send({
                  status: "error",
                  msg: "Customer delete error",
                  data: csttodel,
                });
              }
            } else res.send({ status: "error", msg: "Customer has contracts", data: csttodel });
          });
        });
    });

    app.post(
      "/adminarea/customer/get_customer_from_session",
      function (req, res) {
        if (req.session.customer)
          res.send({
            status: "OK",
            msg: "Customer selected",
            data: req.session.customer,
          });
        else res.send({ status: "error", msg: "Customer not found" });
      }
    );
    ///////////////////// User ///////////////////////////////
    app.post("/adminarea/user/get_by_id", function (req, res) {
      var userId = req.body.idUser;
      if (userId)
        database.entities.user
          .findOne({ where: { id: userId } })
          .then(function (user) {
            if (user) {
              res.send({ status: "OK", msg: "Users found", user: results });
            } else res.send({ status: "OK", msg: "Users not found", user: {} });
          });
    });

    app.post("/adminarea/user/getall", function (req, res) {
      database.entities.user.findAll().then(function (results) {
        if (results)
          res.send({ status: "OK", msg: "Users found", users: results });
        else res.send({ status: "OK", msg: "Users not found", users: {} });
      });
    });

    app.post("/adminarea/user/insert", function (req, res) {
      var user = req.body.user;
      user.status = "active";
      database.entities.user
        .findOne({ where: { email: user.email } })
        .then(function (usr) {
          if (usr === null) {
            database.entities.user.create(user).then(function (usrnew) {
              if (usrnew !== null) {
                usrnew.password = "****";
                res.send({
                  status: "OK",
                  msg: "User create successfully",
                  user: usrnew,
                });
              }
            });
          } else {
            usr.password = "****";
            res.send({
              status: "error",
              msg: "User creation error",
              user: usr,
            });
          }
        });
    });

    app.post("/adminarea/user/update", function (req, res) {
      var user_updated = req.body.user;
      if (!user_updated.id || user_updated.id === 0) {
        //New insert
        user_updated.state = "active";
        database.entities.user
          .findOne({ where: { email: user_updated.email } })
          .then(function (usr) {
            if (usr === null) {
              database.entities.user
                .create(user_updated)
                .then(function (usrnew) {
                  if (usrnew !== null) {
                    res.send({
                      status: "OK",
                      msg: "User create successfully",
                      user: usrnew,
                    });
                  }
                });
            } else {
              res.send({
                status: "error",
                msg: "User creation error",
                user: usr,
              });
            }
          });
      } else if (user_updated.id !== 0) {
        database.entities.user
          .findOne({ where: { id: user_updated.id } })
          .then(function (usr) {
            usr.firstname = user_updated.firstname;
            usr.lastname = user_updated.lastname;
            usr.codfis = user_updated.codfis;
            usr.email = user_updated.email;
            usr.state = user_updated.state;
            usr.address = user_updated.address;
            usr.mobilephone = user_updated.mobilephone;
            usr.username = user_updated.username;
            usr.password = user_updated.password;
            usr.role = user_updated.role;

            usr.save().then(function (usrupdate) {
              if (usrupdate !== null) {
                res.send({
                  status: "OK",
                  msg: "User update successfully",
                  user: usrupdate,
                });
              } else {
                res.send({
                  status: "error",
                  msg: "User update error",
                  user: usr,
                });
              }
            });
          });
      }
    });

    app.post("/adminarea/user/delete", function (req, res) {
      var usr = req.body.user;
      database.entities.user
        .findOne({ where: { id: usr.id } })
        .then(function (usertodel) {
          if (usertodel !== null) {
            usertodel.destroy();
            res.send({
              status: "OK",
              msg: "User deleted successfully",
              user: usertodel,
            });
          } else {
            res.send({
              status: "error",
              msg: "User delete error",
              user: usertodel,
            });
          }
        });
    });

    /////////////////////Site Wifinetcom Backbone ///////////////////////////
    app.post("/adminarea/siteBackbone/get_by_id", function (req, res) {
      var idSite = req.body.idSite;
      database.entities.siteBackbone
        .findOne({ where: { id: idSite } })
        .then(function (site) {
          if (site) {
            res.send({ status: "OK", msg: "Site found", siteBackbone: site });
          } else res.send({ status: "error", msg: "Site not found", siteBackbone: {} });
        });
    });

    app.post("/adminarea/siteBackbone/getall", function (req, res) {
      database.entities.siteBackbone.findAll().then(function (results) {
        if (results)
          res.send({
            status: "OK",
            msg: "Sites found",
            sitesBackbone: results,
          });
        else
          res.send({ status: "OK", msg: "Sites not found", sitesBackbone: {} });
      });
    });

    app.post("/adminarea/siteBackbone/insert", function (req, res) {
      var obj = req.body.siteBackbone;
      obj.id = "";
      database.entities.siteBackbone
        .findOne({ where: { description: obj.description } })
        .then(function (site) {
          if (site === null) {
            database.entities.siteBackbone.create(obj).then(function (objnew) {
              if (objnew !== null) {
                res.send({
                  status: "OK",
                  msg: "Site created successfully",
                  siteBackbone: objnew,
                });
              } else res.send({ status: "OK", msg: "Site insert failed", siteBackbone: objnew });
            });
          } else {
            res.send({
              status: "error",
              msg: "Site creation error (exist)",
              siteBackbone: obj,
            });
          }
        });
    });

    app.post("/adminarea/siteBackbone/update", function (req, res) {
      var obj_updated = req.body.siteBackbone;
      if (obj_updated && obj_updated.id)
        database.entities.siteBackbone
          .findOne({ where: { id: obj_updated.id } })
          .then(function (obj) {
            if (obj) {
              //exist then update
              obj.description = obj_updated.description;
              obj.address = obj_updated.address;
              obj.longitude = obj_updated.longitude;
              obj.latitude = obj_updated.latitude;
              obj.note = obj_updated.note;
              obj.objData = obj_updated.objData;
              obj.save().then((objupdate) => {
                if (objupdate !== null) {
                  res.send({
                    status: "OK",
                    msg: "Site update successfully",
                    siteBackbone: objupdate,
                  });
                } else {
                  res.send({
                    status: "error",
                    msg: "Site update error",
                    siteBackbone: obj,
                  });
                }
              });
            }
          });
      else if (obj_updated && (!obj_updated.id || obj_updated.id === "")) {
        //new insertion
        database.entities.siteBackbone
          .findOne({ where: { description: obj_updated.description } })
          .then(function (site) {
            if (site === null) {
              database.entities.siteBackbone
                .create(obj_updated)
                .then(function (objnew) {
                  if (objnew !== null) {
                    res.send({
                      status: "OK",
                      msg: "Site created successfully",
                      siteBackbone: objnew,
                    });
                  } else res.send({ status: "OK", msg: "Site insert failed", siteBackbone: objnew });
                });
            } else {
              res.send({
                status: "error",
                msg: "Site creation error (exist)",
                siteBackbone: obj,
              });
            }
          });
      } else {
        //error
        res.send({
          status: "error",
          msg: "Site creation error",
          siteBackbone: {},
        });
      }
    });

    app.post("/adminarea/siteBackbone/delete", function (req, res) {
      var objsel = req.body.siteBackbone;
      database.entities.siteBackbone
        .findOne({ where: { id: objsel.id } })
        .then(function (obj) {
          if (obj !== null) {
            obj.destroy();
            res.send({
              status: "OK",
              msg: "Site deleted successfully",
              siteBackbone: objsel,
            });
          } else {
            res.send({
              status: "error",
              msg: "Site delete error",
              siteBackbone: objsel,
            });
          }
        });
    });

    app.post("/adminarea/deviceBackbone/getMonitored", function (req, res) {
      pingServer.sendMonitoredBackbone(function (devices) {
        res.send({
          status: "OK",
          msg: "Stats monitored success",
          devicesBackbone: devices,
        });
      });
    });

    app.post("/adminarea/deviceBackbone/getSnmpParams", function (req, res) {});
    /////////////////////Site Wifinetcom Backbone ///////////////////////////

    /////////////////////Device Wifinetcom Backbone ///////////////////////////
    app.post("/adminarea/deviceBackbone/get_by_id", function (req, res) {
      var idDevice = req.body.idDevice;
      database.entities.deviceBackbone
        .findOne({ where: { id: idDevice } })
        .then(function (dev) {
          if (dev) {
            res.send({
              status: "OK",
              msg: "Device found",
              deviceCustomer: dev,
            });
          } else res.send({ status: "error", msg: "Device not found", deviceCustomer: {} });
        });
    });

    app.post("/adminarea/deviceBackbone/getall", function (req, res) {
      database.entities.deviceBackbone.findAll().then(function (results) {
        if (results)
          res.send({
            status: "OK",
            msg: "Devices found",
            devicesBackbone: results,
          });
        else
          res.send({
            status: "OK",
            msg: "Devices not found",
            devicesBackbone: {},
          });
      });
    });

    app.post("/adminarea/deviceBackbone/insert", function (req, res) {
      var obj = req.body.deviceBackbone;
      obj.id = "";
      database.entities.deviceBackbone
        .findOne({ where: { description: deviceBackbone.mac } })
        .then(function (dev) {
          if (dev === null) {
            database.entities.deviceCustomer
              .create(obj)
              .then(function (objnew) {
                if (objnew !== null) {
                  res.send({
                    status: "OK",
                    msg: "Device created successfully",
                    deviceBackbone: objnew,
                  });
                }
              });
          } else {
            res.send({
              status: "error",
              msg: "Device creation error",
              deviceBackbone: obj,
            });
          }
        });
    });

    app.post("/adminarea/deviceBackbone/update", function (req, res) {
      var obj_updated = req.body.deviceBackbone;
      database.entities.deviceBackbone
        .findOne({ where: { id: obj_updated.id } })
        .then(function (obj) {
          //Rimozione da monitoring
          if (obj.state === "monitored" && obj_updated.state !== "monitored")
            pingServer.removeMonitoredBackbone(obj);
          //Inserimento da monitoring
          if (obj_updated.state === "monitored")
            pingServer.insertMonitoredBackbone(obj);

          obj.description = obj_updated.description;
          obj.techasset = obj_updated.techasset;
          obj.companyasset = obj_updated.companyasset;
          obj.type = obj_updated.type;
          obj.vendor = obj_updated.vendor;
          obj.model = obj_updated.model;
          obj.mac = obj_updated.mac;
          obj.ipv4 = obj_updated.ipv4;
          obj.ipv6 = obj_updated.ipv6;
          obj.state = obj_updated.state;
          obj.note = obj_updated.note;
          obj.siteBackboneId = obj_updated.siteBackboneId;
          obj.objData = obj_updated.objData;
          obj.save().then((objupdate) => {
            if (objupdate !== null) {
              res.send({
                status: "OK",
                msg: "Device update successfully",
                deviceBackbone: objupdate,
              });
            } else {
              res.send({
                status: "error",
                msg: "Device update error",
                deviceBackbone: obj,
              });
            }
          });
        });
    });

    app.post("/adminarea/deviceBackbone/delete", function (req, res) {
      var objsel = req.body.deviceBackbone;
      database.entities.deviceBackbone
        .findOne({ where: { id: objsel.id } })
        .then(function (obj) {
          if (obj !== null) {
            obj.destroy();
            res.send({
              status: "OK",
              msg: "Device deleted successfully",
              deviceBackbone: obj,
            });
          } else {
            res.send({
              status: "error",
              msg: "Device delete error",
              deviceBackbone: objsel,
            });
          }
        });
    });

    ///////////////////// Event Manteinance ///////////////////////////
    app.post("/adminarea/maintenanceEvent/get_by_id", function (req, res) {
      var idDevice = req.body.idDevice;
      database.entities.maintenanceEvent
        .findOne({ where: { id: idDevice } })
        .then(function (dev) {
          if (dev) {
            res.send({
              status: "OK",
              msg: "Maintenance event found",
              maintenanceEvent: dev,
            });
          } else res.send({ status: "error", msg: "Maintenance event not found", eventManteinance: {} });
        });
    });

    app.post("/adminarea/maintenanceEvent/getall", function (req, res) {
      var deviceBackbone = req.body.deviceBackbone;
      var id_device=deviceBackbone.id;
      database.entities.maintenanceEvent.findAll({where: {deviceBackboneId:  id_device}}).then(function (results) {
        if (results)
          res.send({
            status: "OK",
            msg: "Maintenance event  found.",
            maintenanceEvents: results,
          });
        else
          res.send({
            status: "OK",
            msg: "Maintenance event not found.",
            maintenanceEvents: {},
          });
      });
    });

    app.post("/adminarea/maintenanceEvent/insert", function (req, res) {
      var obj = req.body.maintenanceEvent;
      var id_device=obj.objData.device.id;
      if(!obj || !id_device) {
        res.send({
          status: "error",
          msg: "Maintenance event creation error, probably yet exists.",
          maintenanceEvent: {},
        });
      }
      obj.id = "";
      database.entities.maintenanceEvent
        .findOne({ where: { description: obj.description, deviceBackboneId:  id_device} })
        .then(function (dev) {
          if (dev === null) {
            obj.deviceBackboneId=id_device;
            database.entities.maintenanceEvent
              .create(obj)
              .then(function (objnew) {
                if (objnew !== null) {
                  res.send({
                    status: "OK",
                    msg: "Maintenance event created successfully.",
                    maintenanceEvent: objnew,
                  });
                }
              });
          } else {
            res.send({
              status: "error",
              msg: "Maintenance event creation error, probably yet exists.",
              maintenanceEvent: obj,
            });
          }
        });
    });

    app.post("/adminarea/maintenanceEvent/update", function (req, res) {
      var obj_updated = req.body.maintenanceEvent;
      database.entities.maintenanceEvent
        .findOne({ where: { id: obj_updated.id } })
        .then(function (obj) {          
          obj.description = obj_updated.description;
          obj.type = obj_updated.type;
          obj.daysInterval = obj_updated.daysInterval;          
          obj.state = obj_updated.state;
          obj.begin = obj_updated.begin;
          obj.note = obj_updated.note;
          obj.deviceBackboneId = obj_updated.deviceBackboneId;
          obj.objData = obj_updated.objData;
          obj.save().then((objupdate) => {
            if (objupdate !== null) {
              res.send({
                status: "OK",
                msg: "Maintenance event update successfully.",
                maintenanceEvent: objupdate,
              });
            } else {
              res.send({
                status: "error",
                msg: "Maintenance event update error.",
                maintenanceEvent: obj,
              });
            }
          });
        });
    });

    app.post("/adminarea/maintenanceEvent/delete", function (req, res) {
      var objsel = req.body.maintenanceEvent;
      database.entities.maintenanceEvent
        .findOne({ where: { id: objsel.id } })
        .then(function (obj) {
          if (obj !== null) {
            obj.destroy();
            res.send({
              status: "OK",
              msg: "Maintenance event deleted successfully.",
              maintenanceEvent: obj,
            });
          } else {
            res.send({
              status: "error",
              msg: "Maintenance event delete error.",
              maintenanceEvent: objsel,
            });
          }
        });
    });

    //////////////////////Login and Logout //////////////////////////////
    //Get login by post
    app.post("/adminarea/login", function (req, res) {
      var user = req.body.username;
      var pass = req.body.password;

      database.entities.user
        .findOne({ where: { username: user, password: pass } })
        .then(function (usr) {
          if (usr == null) {
            res.send({ status: "error", msg: "Login error", user: usr });
          } else {
            //Login accepted
            res.send({ status: "OK", msg: "Login accepted.", user: usr });
            //res.redirect("/customerarea/main");
          }
        });
    });
    //Logout from admin area by post
    app.post("/adminarea/logout", function (req, res) {
      req.session.destroy(function (err) {
        if (err) {
          res.send({ status: "error", msg: "Login accepted.", error: err });
        } else {
          res.send({ status: "OK", msg: "Logout accepted.", user: {} });
        }
      });
    });
    //Logout from admin area by get
    app.get("/adminarea/logout", function (req, res) {
      req.session.destroy(function (err) {
        if (err) {
          res.send({ status: "error", msg: "Login accepted.", error: err });
        } else {
          res.send({ status: "OK", msg: "Logout accepted.", user: {} });
        }
      });
    });
  },
};
