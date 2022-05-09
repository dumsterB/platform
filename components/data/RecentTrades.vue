<template>
  <div>
    <v-row class="mx-4 mt-0">
      <span class="rt_title mt-2 mr-4">{{ $t("recent_trades") }}</span>
      <v-list max-width="600" min-width="480" class="pa-0 borderNone ml-4">
        <v-list-item-group v-model="page_state" class="d-flex"
          ><v-list-item
            tag="button"
            block
            elevation="0"
            class="btn_tbl_type pa-0 pb-1"
            active-class="active_btn_tbl_type primary--text"
            @click="page_state = 0"
            >{{ "Spot" }}</v-list-item
          >
          <!-- <v-divider class="mx-4" inset vertical></v-divider> -->
          <v-list-item
            tag="button"
            block
            elevation="0"
            class="btn_tbl_type pa-0 pb-1"
            active-class="active_btn_tbl_type primary--text"
            @click="page_state = 1"
            >{{ "Arbitrage" }}</v-list-item
          >
          <v-list-item
            tag="button"
            block
            elevation="0"
            class="btn_tbl_type pa-0 pb-1"
            active-class="active_btn_tbl_type primary--text"
            @click="page_state = 2"
            >{{ "Leverage" }}</v-list-item
          ></v-list-item-group
        ></v-list
      >
    </v-row>
    <TableTrades
      v-if="trade_filter && page_state == 0"
      :prices="prices"
      :filter="trade_filter"
      ref="trades"
      ><template v-slot:header
        ><v-list max-width="600" min-width="480" class="pa-0 borderNone">
          <v-list-item-group v-model="trade_mode_active" class="d-flex"
            ><v-list-item
              tag="button"
              block
              elevation="0"
              class="btn_tbl pa-0"
              active-class="active_btn_tbl primary--text"
              @click="trade_filter_update('1')"
              >{{ $t("Open Trades") }}</v-list-item
            >
            <v-list-item
              tag="button"
              block
              elevation="0"
              class="btn_tbl pa-0"
              active-class="active_btn_tbl primary--text"
              @click="trade_filter_update('3')"
              >{{ $t("Orders History") }}</v-list-item
            >
            <v-list-item
              tag="button"
              block
              elevation="0"
              class="btn_tbl pa-0"
              active-class="active_btn_tbl primary--text"
              @click="trade_filter_update('1')"
              >{{ $t("Trade History") }}</v-list-item
            ></v-list-item-group
          ></v-list
        > </template
      ><template v-slot:header_ext
        ><v-list
          max-width="450"
          min-width="300"
          class="pa-0 borderNone pl-4"
          dense
        >
          <v-list-item-group v-model="time_mode_active" class="d-flex"
            ><v-list-item
              v-for="(item, i) in time_vars"
              :key="i"
              tag="button"
              block
              elevation="0"
              class="btn_tbl_time pa-0"
              active-class="active_btn_tbl_time primary white--text"
              @click="date_time_filter(item.data)"
              >{{ item.text }}</v-list-item
            ></v-list-item-group
          ></v-list
        ><span class="ml-6 label-cl">{{ $t("From") }}</span
        ><v-text-field
          dense
          class="date-range-field"
          solo
          hide-details
          type="date"
        ></v-text-field
        ><span class="mx-4 label-cl">{{ $t("to") }}</span
        ><v-text-field
          dense
          class="date-range-field"
          solo
          hide-details
          type="date"
        ></v-text-field></template
    ></TableTrades>
    <TableASession
      v-if="as_filter && page_state == 1"
      :prices="prices"
      :filter="as_filter"
      title="table_position"
      ref="a_session"
      ><template v-slot:header
        ><v-list
          max-width="600"
          min-width="480"
          class="pa-0 borderNone time-list"
        >
          <v-list-item-group v-model="as_mode_active" class="d-flex"
            ><v-list-item
              tag="button"
              block
              elevation="0"
              class="btn_tbl pa-0"
              active-class="active_btn_tbl primary--text"
              @click="as_filter_update('1')"
              >{{ $t("Open Trades") }}</v-list-item
            >
            <v-list-item
              tag="button"
              block
              elevation="0"
              class="btn_tbl pa-0"
              active-class="active_btn_tbl primary--text"
              @click="as_filter_update('2')"
              >{{ $t("Orders History") }}</v-list-item
            >
            <v-list-item
              tag="button"
              block
              elevation="0"
              class="btn_tbl pa-0"
              active-class="active_btn_tbl primary--text"
              @click="as_filter_update('1')"
              >{{ $t("Trade History") }}</v-list-item
            ></v-list-item-group
          ></v-list
        ></template
      ><template v-slot:header_ext
        ><v-list
          max-width="450"
          min-width="300"
          class="pa-0 borderNone pl-4"
          dense
        >
          <v-list-item-group v-model="time_mode_active" class="d-flex"
            ><v-list-item
              v-for="(item, i) in time_vars"
              :key="i"
              tag="button"
              block
              elevation="0"
              class="btn_tbl_time pa-0"
              active-class="active_btn_tbl_time primary white--text"
              @click="date_time_filter(item.data)"
              >{{ item.text }}</v-list-item
            ></v-list-item-group
          ></v-list
        ><span class="ml-6 label-cl">{{ $t("From") }}</span
        ><v-text-field
          dense
          class="date-range-field"
          solo
          hide-details
          type="date"
        ></v-text-field
        ><span class="mx-4 label-cl">{{ $t("to") }}</span
        ><v-text-field
          dense
          class="date-range-field"
          solo
          hide-details
          type="date"
        ></v-text-field></template
    ></TableASession>
    <TableCreditSession
      v-if="arb_ses_filter && page_state == 2"
      :prices="prices"
      :filter="arb_ses_filter"
      ref="a_session"
      @get_prices="update_subscr"
      ><template v-slot:header
        ><v-list max-width="600" min-width="480" class="pa-0 borderNone">
          <v-list-item-group v-model="as_mode_active" class="d-flex"
            ><v-list-item
              tag="button"
              block
              elevation="0"
              class="btn_tbl pa-0"
              active-class="active_btn_tbl primary--text"
              @click="lev_filter_update('1')"
              >{{ $t("Open Trades") }}</v-list-item
            >
            <v-list-item
              tag="button"
              block
              elevation="0"
              class="btn_tbl pa-0"
              active-class="active_btn_tbl primary--text"
              @click="lev_filter_update('2')"
              >{{ $t("Orders History") }}</v-list-item
            >
            <v-list-item
              tag="button"
              block
              elevation="0"
              class="btn_tbl pa-0"
              active-class="active_btn_tbl primary--text"
              @click="lev_filter_update('1')"
              >{{ $t("Trade History") }}</v-list-item
            ></v-list-item-group
          ></v-list
        ></template
      ><template v-slot:header_ext
        ><v-list
          max-width="450"
          min-width="300"
          class="pa-0 borderNone pl-4"
          dense
        >
          <v-list-item-group v-model="time_mode_active" class="d-flex"
            ><v-list-item
              v-for="(item, i) in time_vars"
              :key="i"
              tag="button"
              block
              elevation="0"
              class="btn_tbl_time pa-0"
              active-class="active_btn_tbl_time primary white--text"
              @click="date_time_filter(item.data)"
              >{{ item.text }}</v-list-item
            ></v-list-item-group
          ></v-list
        ><span class="ml-6 label-cl">{{ $t("From") }}</span
        ><v-text-field
          dense
          class="date-range-field"
          solo
          hide-details
          type="date"
        ></v-text-field
        ><span class="mx-4 label-cl">{{ $t("to") }}</span
        ><v-text-field
          dense
          class="date-range-field"
          solo
          hide-details
          type="date"
        ></v-text-field></template
    ></TableCreditSession>
  </div>
</template>
<script>
import TableTrades from "~/components/data/TableTrades";
import TableASession from "~/components/data/TableASession";
import TableCreditSession from "~/components/data/TableCreditSession";
import moment from "moment";

export default {
  props: {
    prices: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  components: {
    TableTrades,
    TableASession,
    TableCreditSession,
  },
  data() {
    let cr_at_f = `${moment().subtract(1, "day").unix()},${moment().unix()}`;
    return {
      page_state: 0,
      trade_mode_active: 0,
      as_mode_active: 0,
      as_filter: {
        status_id: "1",
        created_at: cr_at_f,
      },
      trade_filter: {
        trade_status_id: "1",
        created_at: cr_at_f,
      },
      arb_ses_filter: {
        status_id: "1",
        created_at: cr_at_f,
      },
      time_mode_active: 0,
      time_vars: [
        {
          text: "1 Day",
          data: [moment().subtract(1, "day"), moment()],
        },
        {
          text: "1 Week",
          data: [moment().subtract(1, "week"), moment()],
        },
        {
          text: "1 Month",
          data: [moment().subtract(1, "months"), moment()],
        },
        {
          text: "3 Month",
          data: [moment().subtract(3, "months"), moment()],
        },
      ],
    };
  },
  methods: {
    trade_filter_update(dt) {
      this.trade_filter = {
        trade_status_id: dt,
      };
    },
    as_filter_update(dt) {
      this.as_filter = {
        status_id: dt,
      };
    },
    lev_filter_update(dt) {
      this.arb_ses_filter = {
        status_id: dt,
      };
    },
    date_time_filter(dts) {
      let dt = dts.map((el) => el.unix());
      let str = dt.join();
      this.trade_filter.created_at = str;
      this.trade_filter = Object.assign({}, this.trade_filter);
      this.as_filter.created_at = str;
      this.as_filter = Object.assign({}, this.as_filter);
      this.arb_ses_filter.created_at = str;
      this.arb_ses_filter = Object.assign({}, this.arb_ses_filter);
    },
  },
};
</script>
<style lang="scss">
.date-range-field .v-input__slot {
  background: transparent !important;
}
.date-range-field {
  max-width: 180px !important;
  margin-bottom: 5px !important;
}
.date-range-field input {
  color: gray !important;
}
.label-cl {
  font-size: 14px;
  font-weight: 700;
}
.rt_title {
  font-weight: 700;
  font-size: 20px;
}
.btn_tbl_type {
  padding: 10px 0px 10px 10px;
  justify-content: center;
  font-weight: 400;
  font-size: 20px;
  color: gray !important;
  width: 100px;
  border-top: 3px solid transparent;
  background: transparent !important;
}
.active_btn_tbl_type {
  position: relative;
  padding: 10px 0px 10px 10px;
  justify-content: center;
  margin-bottom: 0px;
  font-weight: 700;
  font-size: 20px;
  border-bottom: 3px solid transparent;
  background: transparent !important;
}
.active_btn_tbl_type::after {
  z-index: 10;
  position: absolute;
  content: "";
  width: 100%;
  min-height: 6px !important;
  bottom: -12px;
  left: 0;
  background: #007bff !important;
  border-radius: 0px 0px 4px 4px;
}
.btn_tbl {
  justify-content: center;
  font-weight: 400;
  font-size: 16px;
  color: gray !important;
  width: 100px;
  background: transparent !important;
}
.active_btn_tbl {
  position: relative;
  justify-content: center;
  font-weight: 700;
  font-size: 18px;
}
.active_btn_tbl::after {
  position: absolute;
  content: "";
  width: 100%;
}
.btn_tbl_time {
  justify-content: center;
  font-weight: 400;
  color: gray !important;
  font-size: 14px;
  background: transparent !important;
  border-radius: 10px;
}
.active_btn_tbl_time {
  position: relative;
  justify-content: center;
  font-size: 14px;
}
.active_btn_tbl_time::after {
  position: absolute;
  content: "";
}
.time-list,
.v-list--dense .v-list-item {
  min-height: 36px;
}
</style>