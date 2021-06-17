<template>
  <div id="monitoringDashboard" fluid>
    <q-table :data="itemsTable" :columns="fieldsTable"></q-table>
  </div>
</template>

<script>
import {Store} from '../store'

export default {
  data() {
    return {
      fieldsTable: [
        {
          name: "description",
          label: "Descrizione",
          sortable: true,
          field: row => row.description
        },
        { name: "ip", label: "Ip", sortable: true, field: row => row.ip },
        { name: "min", label: "Min", sortable: true, field: row => row.min },
        { name: "max", label: "Max", sortable: true, field: row => row.max },
        { name: "avg", label: "Avg", sortable: true, field: row => row.avg },
        {
          name: "loss",
          label: "Perdita",
          sortable: true,
          field: row => row.loss
        },
        {
          name: "recvs",
          label: "Ricevuti (max 10)",
          sortable: true,
          field: row => row.recvs
        },
        {
          name: "totLoss",
          label: "Perdita cumulata",
          sortable: true,
          field: row => row.totLoss
        },
        {
          name: "repetition",
          label: "Ripetizione (max 10)",
          sortable: true,
          field: row => row.repetition
        }
      ],
      itemsTable: []
    };
  },
  mounted() {
    this.ready();
  },
  methods: {
    ready() {
      this.getAllDevicesMonitored();
      this.interval = setInterval(
        function() {
          this.getAllDevicesMonitored();
        }.bind(this),
        5000
      );
    },
    getAllDevicesMonitored() {
      this.$axios
        .post("/adminarea/deviceBackbone/getMonitored", {})
        .then(response => {
          if (response.data.status === "OK") {
            this.devicesMonitored = response.data.devicesBackbone;
            this.getStatisticsData();
            console.log(this.devicesMonitored);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getStatisticsData() {
      this.itemsTable = [];
      this.devicesMonitored.forEach(dev => {
        if (dev && dev.statistics.ping) {
          const objData = {
            description: dev.description,
            ip: dev.ipv4 + "  " + dev.ipv6,
            min: dev.statistics.ping.min,
            max: dev.statistics.ping.max,
            avg: dev.statistics.ping.avg,
            loss: dev.statistics.ping.packetLoss,
            recvs: dev.statistics.ping.times.length,
            totLoss: dev.statistics.lossPackets,
            repetition: dev.statistics.countCycle
          };
          this.itemsTable.push(objData);
        }
      });
    }
  },
  beforeRouteEnter(to, from, next) {
    var currentUser = Store.state.user;
    console.log(currentUser);
    if (
      currentUser.role === "admin" ||
      currentUser.role === "manager" ||
      currentUser.role === "technician"
    )
      next();
    else next("/Login");
  }
};
</script>

<style>
.active {
  background-color: rgb(168, 243, 168);
}

.suspended {
  background-color: rgb(177, 171, 171);
}

.monitored {
  background-color: rgb(255, 115, 0);
}

.normal {
  background-color: rgb(0, 217, 255);
}
</style>