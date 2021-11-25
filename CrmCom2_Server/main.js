var config = require("./config.js").load();
var utility = require("./utility.js");
const schedule = require('node-schedule');

const fs = require('fs');
const https = require('https');
const http = require('http');
var session = require('express-session')
//Geo library
var proj4 = require('proj4');

const { Sequelize, Model, DataTypes } = require('sequelize');


var express = require('express');
var FileCleaner = require('cron-file-cleaner').FileCleaner;
var multer = require('multer');
var bodyParser = require('body-parser');
var cors = require('cors');


var database = require('./database.js')
var olo2olo= require('./olo2olo/olo2olo.js');

//file per route sezioni
var routes_admin_area = require("./route_admin_area.js");
var routes_cust_area = require("./route_customer_area.js");
var routes_utilities = require("./route_utilities.js");
const freeradius = require("./freeradius.js");

var pingServerProcess=null;
var app = express();

app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'crmcom-wifinetcom-2020',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))

//settinng process to clean temporary folder as cache and uploads 
var fileWatcherUpload = new FileCleaner(process.cwd() + '/uploads/', 600000, '* */45 * * * *', { start: true });
var fileWatcherCache = new FileCleaner(process.cwd() + '/cache/', 600000, '* */45 * * * *', { start: true });

process.on('unhandledRejection', error => { console.log('Warning', error.message); });
process.chdir(process.cwd());


//enable cross origin
app.use(cors());
//covert body to JSON
app.use(bodyParser.json());
//parsing request object data during post
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies.
app.use(bodyParser.json({ limit: '2000kb' }));
//upload folder
var upload = multer({ dest: './uploads/' })
//other static contents folders
app.use(config.paths.documentsXsdFolder, express.static(process.cwd() + config.paths.documentsXsdFolder));
app.use(config.paths.documentsFolder, express.static(process.cwd() + config.paths.documentsFolder));
app.use(config.paths.contractsFolder, express.static(process.cwd()+config.paths.contractsFolder));

const options = {
  key: fs.readFileSync(process.cwd() +'/certs/apiserver/privkey.pem'),
  cert: fs.readFileSync(process.cwd() +'/certs/apiserver/fullchain.pem')
};

console.log("Server is listening http on port: "+config.server.http_port);
http.createServer(options, app).listen(config.server.http_port);
//app.listen(config.server.http_port);

console.log("Server is listening http on port: "+config.server.https_port);
https.createServer(options, app).listen(config.server.https_port);




//Init componets and utilities.
database.setup(app, function () {
  //utility.load_postalcodes();
  //Loading route for customer area
  routes_admin_area.load_routes(app, database);
  routes_cust_area.load_routes(app, database);
  routes_utilities.load_routes(app, database);
  
  if (config.olo2oloServer.enable)
    olo2olo.setup(app,database);
  

  //Discover passwords
  //devicesUtilities.dicoverCredentialsSSH(app, database);

  //Import data from old crmcom
  //utility.import_Olo2OloDataXmlSystemMigrationModalities(process.cwd()+'/../data/data_csv/Olo2OloDataXmlSystemMigrationModalities.csv');
  //utility.import_Olo2OloDataXmlSystem(process.cwd()+'/../data/data_csv/Olo2OloDataXmlSystem.csv');
  //utility.import_CrmCom_Clienti_Csv(process.cwd()+'/data/data_csv/cliente.csv');
  //utility.import_CrmCom_Customers_Couchdb();
  //utility.import_CrmCom_Contracts_Couchdb();
  //utility.import_CrmCom_Devices_Couchdb();
  //utility.import_DeviceBackbone_Wifinetcom_Csv("/home/torsello/Documenti/Attivita/WIFINETCOM_SRL/SviluppoSoftware/CrmCom2/CrmComServer/data_csv/DevicesBackbone.csv"");
  //utility.import_SiteBackbone_Wifinetcom_Csv("/home/torsello/Documenti/Attivita/WIFINETCOM_SRL/SviluppoSoftware/CrmCom2/data_csv/SitesBackboneWifinetcom.csv");
  //utility.notify_registration_by_email({});
});

//Schedule automatic operations

// Radius alignments and check
const job = schedule.scheduleJob('*/1 * * * *', function(){
  database.entities.deviceCustomer.findAll().then(devices => {
    var ppoe_usernames=[];
    devices.forEach((device, index, array) => {
      if(device.objData && device.objData.ppoe) {
        freeradius.updateDevice(device);
        ppoe_usernames.push(device.objData.ppoe.username);
        if(index===array.length-1) {
          freeradius.checkOrfanUsers(ppoe_usernames);
        }
      }
    })
  })
});