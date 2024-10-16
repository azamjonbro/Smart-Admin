<template>
  <div class="products">
    <div class="product-top">
      <h2>Фирма</h2>creatDelete<div class="d-flex a-center j-between gap12">
        <input class="product-search" type="text" placeholder="Поиск фирмы" v-model="searchQuery" />
        <button class="create-button" @click="createClient">Создать фирму</button>
      </div>
    </div>
    <div class="product-bottom">
      <table class="w-100 overflow">
        <thead>
          <tr>
            <th>Название фирма</th>
            <th>Главный ФИО</th>
            <th>Номер телефона</th>
            <th>Менеджер ФИО</th>
            <th>Номер телефона</th>
            <th>Почта</th>
            <th>Адрес</th>
            <th>Статус</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in paginatedProducts" :key="product._id">
            <td>{{ product.name }}</td>
            <td>{{ product.username }}</td>
            <td>{{ product.phone_username }}</td>
            <td>{{ product.manager }}</td>
            <td>{{ product.phone_manager }}</td>
            <td>{{ product.email }}</td>
            <td>{{ product.address }}</td>
            <td>{{ product.status }}</td>
            <td class="table__buttonbox d-flex gap12">
              <IconComponent name="editIcon" @click="editClient(product._id)" />
              <IconComponent name="deleteIcon" @click="deleteClient(product._id)" />
              <IconComponent name="rightArrowIcon" @click="$emit('viewClient', product._id)" />
            </td>
          </tr>
        </tbody>
      </table>
      <p v-if="paginatedProducts.length == 0" style="text-align: center; height:80%">Фирма не найден</p>
      <div class="pagination">
        <button :disabled="currentPage === 1" @click="currentPage--">Previous</button>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <button :disabled="currentPage === totalPages || totalPages==0" @click="currentPage++">Next</button>
      </div>

      
    </div>
    <FirmaCreate :editClient="editClientItem" @status="handleStatus($event)" :showModal="showModal" @close="closeModal('create')" />
    <requiredModal :showModal="deleteModal" @close="closeModal('require')" :title="'Вы хотите удалить этот фирма?'"
    @confirm="handleDeleteConfirmation($event)" />
      <ToastComponent :toastOptions="toastOptions"/>
    </div>
</template>

<script>
import { ipcRenderer } from 'electron';
import IconComponent from '../components/IconComponent.vue';
import FirmaCreate from '../models/FirmaCreate.vue';
import requiredModal from '../models/requiredModal.vue';
import eventNames from '@/universal/eventNames';
import ToastComponent from '../components/Toastiff.vue'
import { sendErrorToTelegram } from '../utils';
export default {
  name: "ClientPage",
  components: {
    IconComponent,
    FirmaCreate,
    requiredModal,
    ToastComponent
  },
  props: ['viewClient'],
  data() {
    return {
      searchQuery: "",
      showModal: false,
      currentPage: 1,
      itemsPerPage: 13,
      editClientItem: null,
      deleteModal: false,
      clientId:null,
      Clients: [],
      toastOptions: {
        open: false,
        text: "",
        style:{background: "#4CAF50"}
      },
    };
  },
  computed: {
    filteredProducts() {
      return this.Clients.filter(product =>
        product.name?.toLowerCase?.()?.includes(this.searchQuery?.toLowerCase?.())
      );
    },
    paginatedProducts() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredProducts.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredProducts.length / this.itemsPerPage);
    }
  },
  methods: {
    handleStatus(event){
      if(event.type=='success'){
        this.toastOptions = {
              open: true,
              text: event?.text,
              style: { background: "#4CAF50" },
            };
            this.getClients()
      }
      else{
        this.toastOptions = {
              open: true,
              text: event?.text,
              style: { background: "#FF0000" },
            };
            this.getClients()
      }
    },
    closeModal(event){
      if(event=='require'){
        this.deleteModal=false
        this.getClients()
      }else{
        this.showModal=false
        this.getClients()
      }
    },
    editClient(id) {
      this.showModal = true
      const product = this.Clients.find(product => product?._id === id);
      this.editClientItem = product
      console.log(product);
      
    },
    createClient() {
      this.showModal = true,
        this.editClientItem = null
    },
    deleteClient(id) {
      this.deleteModal = true
      this.clientId=id
    },
    async handleDeleteConfirmation(item) {
      if(item==true){
        await ipcRenderer.invoke(eventNames.deleteCompanyEvent,{id:this.clientId})
        .then((res)=>{
          if(res.status==201){
            this.toastOptions = {
              open: true,
              text: "Firma muvaffaqqiyatli o'chirldi",
              style: { background: "#4CAF50" },
            };
          }
          if(res.status>400&& res.status<500){
            sendErrorToTelegram({name:"FirmaDelete :nimadir not found",message:"Nimadir topilmadi" })
          }
          if(res.status>500){
            sendErrorToTelegram({name:"FirmaDelete: Internal server error",message:"Code hatolik." })
          }
        })
        .catch((err)=>
          sendErrorToTelegram({name:"deleteFirma: Internal server error",message:err.message })
        )
      }
    },
    getClients(){
      ipcRenderer.invoke(eventNames.listCompanyEvent,{})
      .then((res)=>{
        console.log(res);
        if(res.status==200){
          this.Clients=res?.args.reverse()
        }
        if(res.status>400&& res.status<500){
            sendErrorToTelegram({name:"ClientGet :nimadir not found",message:"get olishda hatolik" })
          }
          if(res.status>500){
            sendErrorToTelegram({name:"ClientGet: Internal server error",message:"Code hatolik." })
          }
      })
      .catch((err)=>{
        sendErrorToTelegram({name:"clientGet da thendan chiqgan hatolik: Internal server error",message:err.message })
      })
    }
  },
  mounted(){
    this.getClients()
  }
};
</script>
<style>
.product-bottom {
  height: 100%;
  background: #fff;
  display: flex;
  flex-direction: column;
  padding: 16px 24px;
  border-radius: 8px;
  justify-content: space-between
}
</style>