<template>
<div>
  <h2>Device  management</h2>
  <br>
  <v-card>
    <v-data-table
        :headers="headers"
        :items="desserts"
        :items-per-page="5"
        class="elevation-1"
    >
      <template v-slot:[`item.fat`]="{ item }">
        <div class="d-flex">
       <p style="color: #01BAC6">{{item.name}}</p>
        </div>
      </template>
    </v-data-table>
  </v-card>
</div>
</template>

<script>
export default {
  name: "DeviceManagment",
  data(){
    return{
      headers: [
        {
          text: 'Date',
          align: 'start',
          sortable: false,
          value: 'name',
        },
        { text: 'Source', value: 'calories',    sortable: false, },
        { text: 'Status', value: 'fat',    sortable: false, },
        { text: 'IP Address', value: 'carbs',    sortable: false, },

      ],
      desserts: [
        {
          name: 'Frozen Yogurt',
          calories: 159,
          fat: 6.0,
          carbs: 24,
          protein: 4.0,
          iron: '1%',
        },
        {
          name: 'Ice cream sandwich',
          calories: 237,
          fat: 9.0,
          carbs: 37,
          protein: 4.3,
          iron: '1%',
        },
        {
          name: 'Eclair',
          calories: 262,
          fat: 16.0,
          carbs: 23,
          protein: 6.0,
          iron: '7%',
        },
        {
          name: 'Cupcake',
          calories: 305,
          fat: 3.7,
          carbs: 67,
          protein: 4.3,
          iron: '8%',
        },
        {
          name: 'Gingerbread',
          calories: 356,
          fat: 16.0,
          carbs: 49,
          protein: 3.9,
          iron: '16%',
        },
        {
          name: 'Jelly bean',
          calories: 375,
          fat: 0.0,
          carbs: 94,
          protein: 0.0,
          iron: '0%',
        },
        {
          name: 'Lollipop',
          calories: 392,
          fat: 0.2,
          carbs: 98,
          protein: 0,
          iron: '2%',
        },
        {
          name: 'Honeycomb',
          calories: 408,
          fat: 3.2,
          carbs: 87,
          protein: 6.5,
          iron: '45%',
        },
        {
          name: 'Donut',
          calories: 452,
          fat: 25.0,
          carbs: 51,
          protein: 4.9,
          iron: '22%',
        },
        {
          name: 'KitKat',
          calories: 518,
          fat: 26.0,
          carbs: 65,
          protein: 7,
          iron: '6%',
        },
      ],
    }
  }
}
</script>

<style scoped>
table th + th { border:none!important; }
table td + td { border:none!important; }
table th + th { border:none!important; }
table td + td { border:none!important; }
.theme--dark.v-data-table > .v-data-table__wrapper > table > tbody > tr:not(:last-child) > td:not(.v-data-table__mobile-row), .theme--dark.v-data-table > .v-data-table__wrapper > table > tbody > tr:not(:last-child) > th:not(.v-data-table__mobile-row){
  border: none!important;
}
.theme--dark.v-data-table > .v-data-table__wrapper > table > thead > tr:last-child > th {
  border: none!important;
}
.theme--dark.v-data-table > .v-data-table__wrapper > table > tbody > tr:not(:last-child) > td:last-child, .theme--dark.v-data-table > .v-data-table__wrapper > table > tbody > tr:not(:last-child) > th:last-child {
  border: none;
}
</style>