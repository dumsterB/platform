<template>
  <ul class="pt-4 d-flex justify-space-between align-center flex-wrap pa-0">
    <li
      v-for="(item, i) in items"
      :key="i"
      class="item mb-4 px-3"
      active-class=""
    >
      <a :href="item.link" target="_blank" class="item_link">
        <v-img class="item_img" :src="item.img" />
      </a>
    </li>
  </ul>
</template>

<script>
import one from "../../../assets/img/otherDepo/01.svg";
import two from "../../../assets/img/otherDepo/02.svg";
import three from "../../../assets/img/otherDepo/03.svg";
import four from "../../../assets/img/otherDepo/04.svg";
import five from "../../../assets/img/otherDepo/05.svg";
import six from "../../../assets/img/otherDepo/06.svg";
import seven from "../../../assets/img/otherDepo/07.svg";
import eight from "../../../assets/img/otherDepo/08.svg";
import nine from "../../../assets/img/otherDepo/09.svg";
import ten from "../../../assets/img/otherDepo/10.svg";
import eleven from "../../../assets/img/otherDepo/11.svg";
import twelve from "../../../assets/img/otherDepo/12.svg";
import thirteen from "../../../assets/img/otherDepo/13.svg";
import fourteen from "../../../assets/img/otherDepo/14.svg";

export default {
  data() {
    return {
      items: [
        { img: one, link: "https://shakepay.com/" },
        { img: two, link: "https://ramp.network/" },
        { img: three, link: "https://www.moonpay.com/" },
        { img: four, link: "https://www.facebook.com/" },
        { img: five, link: "https://www.bitcoin.com/" },
        { img: six, link: "https://changenow.io/" },
        { img: seven, link: "https://www.kraken.com/" },
        { img: eight, link: "https://www.coinbase.com/" },
        { img: nine, link: "https://nuri.com/" },
        { img: ten, link: "https://exmo.com/" },
        { img: eleven, link: "https://bitonic.nl/" },
        { img: twelve, link: "https://payeer.com/" },
        { img: thirteen, link: "https://bt.cx/" },
        { img: fourteen, link: "https://localbitcoins.com/" },
      ],
    };
  },
};
</script>

<style lang="scss">
.item {
  background: #1c1838;
  border: 1px solid #bcbcbc1a;
  border-radius: 20px;
  width: 46%;
  height: 96px;
  vertical-align: middle;
  text-align: center;
  position: relative;
  &:hover {
    .item_img {
      filter: grayscale(0);
    }
  }
  &_link {
    height: inherit;
  }
  &_img {
    width: 150px !important;
    filter: grayscale(1);
    transition: 223ms;
    max-height: 96px;
    position: absolute;
    left: 50%;
    top: 50%;
    -webkit-transform: translate(-50%, -50%);
    -moz-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    -o-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
  }
}
</style>
