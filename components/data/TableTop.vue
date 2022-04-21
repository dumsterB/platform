<template>
  <div>
  <v-data-table
    :items="currencies"
    :headers="headers"
    :items-per-page="10"
    class="ma-4 ml-8 curr-table"
    :footer-props="{
      'items-per-page-options': [5, 10, 20, 50],
    }"
  >
    <template v-slot:item.name="{item}">
      <div class="d-flex">
        <img height="20" :src="item.logo" alt=""> <div class="d-flex ml-3"><strong>{{item.name}}</strong>   <span class="ml-2">  {{item.symbol}}</span></div>
      </div>
    </template>
    <template v-slot:item.change="{item}">
      <div  class="" v-if="item.change && item.price">
        ${{item.price}}
        <span :class="diffColor(item.change)" class="d-flex"> <v-icon size="small" color="#0089B5">mdi-chevron-up</v-icon>  {{item.change}}  <span style="font-size: 8px; margin-left: 1px; margin-top: 5px">( %{{item.percent}} )</span>  </span>
      </div>
      <div v-else>
        {{$t('no-data')}}
      </div>
    </template>
    <template v-slot:item.action="{item}">
      <div class="d-flex">
        <v-btn class="primary" small elevation="0" rounded>{{$t('buy')}}</v-btn>
      </div>
    </template>
    <template v-slot:item.chart="{item}">
      <div class="d-flex">
        <v-sparkline
            :value="value"
            color="#BA68C8"
            height="100"
            padding="10"
            stroke-linecap="round"
            smooth
        >
        </v-sparkline>
      </div>
    </template>
    <template v-slot:item.action="{item}">
      <div class="d-flex">
        <v-btn class="primary" small elevation="0" rounded>{{$t('buy')}}</v-btn>
      </div>
    </template>
    <template v-slot:item.52W="{item}">
      <div class="d-flex">
        <v-progress-linear color="#333333" value="60"></v-progress-linear>
      </div>
    </template>
    <template v-slot:item.sentiment="{item}">
      <div class="d-flex">
        <v-progress-linear
            background-color="blue lighten-3"
            color="green lighten-1"
            value="15"
        ></v-progress-linear>
      </div>
    </template>
    <template v-slot:item.dropdawn="{item}">
      <div class="d-flex">
      <v-btn icon> <v-icon color="#333333">mdi-dots-vertical</v-icon></v-btn>
      </div>
    </template>
  </v-data-table>
  </div>
</template>
<script>
import {mapGetters} from "vuex";
import sparklines from "@/components/elements/currencies/Sparklines.vue";
export default {
  props:{
    price:{}
  },
  components:{
    sparklines
  },
  data() {
    return {
      list: [],
      value: [
        423,
        446,
        975,
        510,
        990,
        610,
        860,
      ]
    };
  },
  methods:{
    diffColor(el){
      if (el < 0) {
        return "text--red";
      } else {
        return "text--success";
      }
    }
  },
  computed: {
    ...mapGetters("data/currency", {
      currencies_full: "list",
    }),
    currencies(){
      let currency_full=this.currencies_full.filter(item=>item.currency_type && item.currency_type.key ==='CRYPTO')
    return currency_full.map(el=>{
     let determine= this.price.find(ell=>ell.base== el.symbol)
      let percent=((parseFloat(el.change) * 100) / parseFloat(el.price)).toFixed(2);
      if(determine){
        el.price =determine.price
        el.change=determine.change
        el.percent=percent
      }
      return el
    })
    },
    headers() {
      return [
        {
          text: this.$t("markets"),
          value: "name",
          width: 100,
          sortable: false,
        },
        {
          text: this.$t("change"),
          value: "change",
          width: 140,
          align: 'start',
          sortable: false,
        },
        {
          text: '24H Chart',
          align: 'start',
          sortable: false,
          value: 'chart',
        },

        { text: 'Invest', value: 'action', sortable: false, },
        { text: '52W Range', value: '52W', sortable: false, },
        { text: 'Sentiment', value: 'sentiment', sortable: false, },
        {
          sortable: false,
          value: 'dropdawn',
        },
      ];
    },

  },
  mounted(){

  }
};
</script>
<style>
.curr-table {
  background-color: transparent !important;
}
.text--red{
  color: #E20000
}
.text--success{
  color:#0089B5
}
.v-data-table > .v-data-table__wrapper > table > tbody > tr > td{
  padding: 0 10px!important;
}
</style>