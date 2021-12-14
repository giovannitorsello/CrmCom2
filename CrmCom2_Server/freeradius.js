const config = require("./config.js").load();
const mysql = require("mysql");

class Freeradius {
  constructor() {
    this.conn = mysql.createConnection({
      host: config.radius.hostname,
      user: config.radius.username,
      password: config.radius.password,
      database: config.radius.database,
    });
  }

  connect(callback) {
    this.conn.connect(function (err) {
      if (err) {
        console.error("Error connecting: " + err.stack);
        callback();
      }
      console.log("Connected to Free Radius Database");
      callback();
    });
  }

  checkQuery(id) {
    try {
      this.conn.query(
        `SELECT * FROM radcheck WHERE id = ${id}`,
        function (err, result) {
          if (err) {
            console.log("err");
            throw err;
          } else {
            console.log(result);
          }
        }
      );
    } catch (e) {
      console.log("Exception caught in checkQuery()", e);
    }
  }

  createUser(user) {
    var connection = this.conn;
    //Update radcheck
    connection.query(
      "SELECT * from radcheck where username = ?",
      user.username,
      function (error, results, fields) {
        if (error) throw error;         
          var data = {
            username: user.username,
            attribute: "Cleartext-Password",
            op: ":=",
            value: user.password,
          };

          var query="";
          if (results.length === 0) query="replace into radcheck SET ?";
          else query="update radcheck SET ? where id="+results[0].id;
          connection.query(
            query,
            data,
            function (error, results, fields) {
              if (error) throw error;
              console.log("User created");
            }
          );          
      }
    );

    //Update radusergroup
    connection.query(
        "SELECT * from radusergroup where username = ?",
        user.username,
        function (error, results, fields) {
          if (error) throw error;                     
            var data = {
              username: user.username,
              groupname: user.group,
              priority: user.priority,
            };
            var query="";
            if (results.length === 0) query="replace into radusergroup SET ?";
            else query="update radusergroup SET ? where username='"+results[0].username+"'";
          
            connection.query(
              query,
              data,
              function (error, results, fields) {
                if (error) throw error;
                console.log("Group created");
              }
            );
          
        }
      );
  }

  setRadiusReply(username, attribute, op, value) {
    var connection = this.conn;
    connection.query(
      "SELECT * from radreply where username = ? and attribute = ?",
      [username,attribute],
      function (error, results, fields) {
          var query="";
          if (results.length === 0) query="replace into radreply SET ?";
          else query="update radreply SET ? where id="+results[0].id;
          var data = {
            username: username,
            attribute: attribute,
            value: value,
            op: op,
          };
          connection.query(
            query,
            data,
            function (error, results, fields) {
              if (error) throw error;
              console.log("Radius reply attribute insert");
            }
          );
    });
  }

  setIp(params) {
    if (!params.ip) params.ip = "169.254.160.169";
    if (!params.netmask) params.netmask = "255.255.255.0";
    this.setRadiusReply(params.username, "Framed-IP-Address", ":=", params.ip);
    this.setRadiusReply(params.username, "Framed-IP-Netmask", ":=", params.netmask);
  }

  setBandwidth(params) {
    this.setRadiusReply(params.username,"WISPr-Bandwidth-Max-Down", ":=", params.download_max+"k");
    this.setRadiusReply(params.username,"WISPr-Bandwidth-Min-Down", ":=", params.download_min+"k");
    this.setRadiusReply(params.username,"WISPr-Bandwidth-Max-Up", ":=", params.upload_max+"k");
    this.setRadiusReply(params.username,"WISPr-Bandwidth-Min-Up", ":=", params.upload_min+"k");
    this.setRadiusReply(params.username,"Mikrotik-Rate-Limit",":=", params.download_max+"k/"+params.upload_max+"k");
  }

  deleteUser(user) {
    var connection = this.conn;
    var data = { username: user.username };
    var sql =
      "delete from radcheck,radreply,radusergroup \
      using radcheck,radreply,radusergroup where \
      radcheck.username='" +
      data.username +
      "' and \
      radreply.username='" +
      data.username +
      "' and \
      radusergroup.username='" +
      data.username +
      "'; ";
    try {
      connection.query(sql, function (err, result) {
        if (err) {
          console.log("Error in delete user");
          throw err;
        } else {
          console.log("User deleted.");
        }
      });
    } catch (e) {
      console.log("Exception caught in checkQuery()", e);
    }
  }

  checkUsers(usernames) {
    var connection = this.conn;
    //Update radcheck
    connection.query(
      "SELECT * from radcheck",
      function (error, results, fields) {
        results.forEach(user => {
          if(!usernames.includes(user.username))
            this.deleteUser(user.username);
        });
      });
  }
}

var fr = new Freeradius();
fr.connect(function () {
  /*fr.createUser({
    username: "aaa",
    password: "kasdffkk00",
    group: "501",
    priority: "502",
  });
  fr.setIp({
    username: "aaa",
    ip: "192.168.5.17",
    netmask: "255.255.255.0",
  });
  fr.setBandwidth({
    username: "aaa",
    download_min: "1000",
    download_max: "50000",
    upload_min: "1000",
    upload_max: "20000",
  });
  */
  //fr.deleteUser({ username: "aaa" });
});

module.exports = {
  updateDevice: function(deviceCustomer) {
    if(deviceCustomer && deviceCustomer.objData &&        
      deviceCustomer.objData.ppoe) {
        fr.createUser({
          username: deviceCustomer.objData.ppoe.username, 
          password: deviceCustomer.objData.ppoe.password,
          group: deviceCustomer.objData.companyasset+"-"+deviceCustomer.objData.techasset,
          priority: "1" 
        });
        if(!deviceCustomer.objData.ppoe.netmask) deviceCustomer.objData.ppoe.netmask="255.255.255.255";
        fr.setIp({
          username: deviceCustomer.objData.ppoe.username, 
          ip: deviceCustomer.objData.ppoe.ip, 
          netmask: deviceCustomer.objData.ppoe.netmask,          
        });
      }
      if(deviceCustomer && deviceCustomer.objData &&         
        deviceCustomer.objData.bandwith) {
          fr.setBandwidth({
            username: deviceCustomer.objData.ppoe.username,
            download_min: deviceCustomer.objData.bandwith.download_min, 
            download_max: deviceCustomer.objData.bandwith.download_max,
            upload_min:   deviceCustomer.objData.bandwith.upload_min, 
            upload_max:   deviceCustomer.objData.bandwith.upload_max, 
          });
      }
  },

  deleteDevice: function(deviceCustomer) {
    if(deviceCustomer && deviceCustomer.objData && 
      deviceCustomer.objData.ppoe) {
        fr.deleteUser({
          username: deviceCustomer.objData.ppoe.username,           
        });        
      }
  },

  checkOrfanUsers: function (ppoe_usernames) {
    fr.checkUsers(ppoe_usernames);
  }
};