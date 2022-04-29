<template>
  <div class="settings">
    <v-container>
      <v-row>
        <v-col  cols="12" lg="4" md="4">
          <SettingsTab @change_content="change_content" :currentContent="currentContent"></SettingsTab>
        </v-col>
        <v-col cols="12" lg="8" md="8">
       <component  :currentContent="currentContent" @change_content="change_content" :is="component"></component>
        </v-col>
      </v-row>
      <div v-if="currentContent ==='Device Management' || 'Account Activity Records'">
        <!-- <p class="header-text" @click="currentContent=0">Security > {{currentContent}}</p>
        <br> -->
      <DeviceManagment v-if="currentContent==='Device Management'"></DeviceManagment>
      <AccountsRecords v-if="currentContent=== 'Account Activity Records'"></AccountsRecords>
      </div>
    </v-container>
  </div>
</template>

<script>
import SettingsTab from '@/components/elements/settings/SettingsTab'
import PrivateInformation from '@/components/elements/settings/PrivateInformation'
import Security from '@/components/elements/settings/Security'
import Verification from '@/components/elements/settings/Verification'
import AccountsRecords from "../../components/elements/settings/components/AccountsRecords";
import DeviceManagment from "../../components/elements/settings/components/DeviceManagment";
import {mapGetters} from "vuex";
export default {
  data(){
    return{
      currentComponent:'',
      currentContent:0,
    }
  },
  components:{
    SettingsTab,PrivateInformation,Security,Verification, AccountsRecords,DeviceManagment
  },
  computed:{
    ...mapGetters({selections:'data/settings/selections',componentHandler:'data/settings/componentHandler'}),
    component(){
      console.log(this.componentHandler)
      try {
        return () => import(`@/components/elements/settings/${this.componentHandler}`);
      } catch (e) {
        return null;
      }
    }
  },
  methods:{
    change_content(val){
     this.currentContent=val
    }
  },
  mounted() {},
};
</script>
<style>
.header-text{
  cursor: pointer;
  color: #9A9A9A;
}
</style>
