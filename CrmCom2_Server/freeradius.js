const config = require("./config.js").load();
const mysql = require("mysql");

class MySqlDatabase {
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
          if (results.length > 0) data.id=results[0].id;
          connection.query(
            "replace into radcheck SET ?",
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
            connection.query(
              "replace into radusergroup SET ?",
              data,
              function (error, results, fields) {
                if (error) throw error;
                console.log("Group created");
              }
            );
          
        }
      );
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

  setConnectionParameters(params) {
    var connection = this.conn;
    var data = {
      username: params.username,
      attribute: "Framed-IP-Address",
      value: params.ip,
      op: ":=",
    };
    connection.query(
      "replace into radreply SET ?",
      data,
      function (error, results, fields) {
        if (error) throw error;
        console.log("Ip insert");
      }
    );

    if (!params.netmask) params.netmask = "255.255.255.0";
    data = {
      username: params.username,
      attribute: "Framed-IP-Netmask",
      value: params.netmask,
      op: ":=",
    };
    connection.query(
      "replace into radreply SET ?",
      data,
      function (error, results, fields) {
        if (error) throw error;
        console.log("Netmask insert");
      }
    );
  }
}

var db = new MySqlDatabase();
db.connect(function () {
  db.createUser({
    username: "aaa",
    password: "bbb",
    group: "1",
    priority: "1",
  });
  db.setConnectionParameters({
    username: "aaa",
    ip: "192.168.1.1",
    netmask: "255.255.255.224",
  });

  //db.deleteUser({ username: "aaa" });
});

module.exports = {};
