<template >
  <div class="mainBox">
    <LeftNavbar @menu-click="currentView = $event"/>
    <HomeBanner v-if="currentView === 'home'" />
    <Products v-if="currentView === 'product'" />
    <Client v-if="currentView === 'client'" @viewClient="viewClient" />
    <Archive v-if="currentView === 'archive'" />
    <Leads v-if="currentView==='leads'" />
    <WareHouse v-if="currentView==='warehouse'" />
    <Users v-if="currentView==='users'" />
    <ReturnedProduct v-if="currentView==='vozvrat'" />
    <ClientInfoPage v-if="showClientInfo" :clientId="client"/>
  </div>
</template>

<script>
import LeftNavbar from '../components/LeftNavbar.vue';
import HomeBanner from './HomeBanner.vue';
import Products from './Products.vue';
import Client from './Client.vue';
import Archive from './Archive.vue';
import Leads from './Leads.vue';
import WareHouse from './WareHouse.vue';
import Users from './UsersPage.vue';
import ClientInfoPage from './ClientInfoPage.vue';
import ReturnedProduct from './ReturnedProduct.vue';

export default {
  name: "HomePage",
  components: {
    LeftNavbar,
    HomeBanner,
    Products,
    Client,
    Archive,
    Leads,
    WareHouse,
    Users,
    ReturnedProduct,
    ClientInfoPage,
  },
  data() {
    return {
      currentView: 'home',
      showClientInfo: false,
      client:null
    };
  },
  methods: {
    viewClient(client) {      
      this.currentView = 'clientInfo';
      if(client){
        this.showClientInfo=true
      }
      this.client=client
    },
  },
  watch: {
    currentView(newVal) {
      // If currentView changes to anything other than 'clientInfo', hide the client info
      if (newVal !== 'clientInfo') {
        this.showClientInfo = false;
      }
    },
  },

}
</script>

<style>
.mainBox{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    background: #e4e4e4;
  }
</style>