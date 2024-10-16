<template>
  <div v-if="clientId " class="products">
    <div class="product-top">
      <h3>{{ oneClient?.name }}</h3> 
      <div class="d-flex a-center j-between gap12">
        <div class="allReturnPrice">{{oneClient?.summa>0? `- ${oneClient?.summa}`: oneClient?.summa}} sum</div>
        <button class="create-button" @click="showModal = true">Оплата</button>
    </div> 
    </div>
    <div class="product-bottom">
      <div class="d-flex j-between">  
      <div v-for="category in oneClient?.categories" :key="category.id" class="OneCategory ">
        <h4>{{ category.name }}</h4> 
        <h2>{{category.summa}}</h2>
        <!-- <p>Total: {{ calculateCategorySum(category.items) }} UZS</p>  -->
      </div>
      </div>
    </div>
    <div class="updateOneFirma modal-overlay" v-if="showModal" >
      <div class="modal-content" >
        <h3>Плата за фирму</h3>
        <form >
          <div class="modal-box">
            <label for="price">Плата за фирму</label>
            <input type="number" v-model="priceInput" placeholder="Введите сумму" step="any" min="1">
          </div>
          <div class="modal-footer">
            <button type="button" @click="closeModal" class="btn-cancel">
                Отмена
            </button>
            <button type="button"  @click="updateCompany" class="btn-save">Сохранить</button>
        </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import eventNames from '@/universal/eventNames';
import { ipcRenderer } from 'electron';
import { sendErrorToTelegram } from '../utils';

export default {
  props: {
    clientId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      oneClient: null,
      showModal:false,
      priceInput:''
    }
  },
  methods: {
    closeModal(){
      this.showModal=false
    },
    async getOneClient() {
      await ipcRenderer.invoke(eventNames.oneCompanyEvent, { id: this.clientId })
        .then((res) => {
          if (res.status === 200) {
            this.oneClient = res?.args
          }
          if(res.status>400&& res.status<500){
            sendErrorToTelegram({name:"ClentOne get :id not found",message:"idni hato bermoqda" })
          }
          if(res.status>500){
            sendErrorToTelegram({name:"ClentOne: Internal server error",message:"Code hatolik." })
          }
        })
    },
    async updateCompany(){
      const summa = this.oneClient?.summa-this.priceInput
      const  newOneClient={
            name: this.oneClient?.name,
            username: this.oneClient?.username,
            manager: this.oneClient?.manager,
            phone_username: this.oneClient?.phone_username,
            phone_manager: this.oneClient?.phone_manager,
            status: this.oneClient?.status,
            address: this.oneClient?.address,
            tax_phone: this.oneClient?.tax_phone,
            email: this.oneClient?.email,
            date: this.oneClient?.date,
            summa:summa,
            id:this.oneClient?._id
      }
      await ipcRenderer.invoke(eventNames.updateCompanyEvent,JSON.parse(JSON.stringify(newOneClient)))
     .then((res)=>{
      console.log(res);
      if(res.status==201){
        console.log("o'zgartirldi");
        
      }
     })
     .catch((err)=>{
      console.log(err)
      
     }) 
    },
    formatSumma(summa) {
      return new Intl.NumberFormat('ru-RU').format(summa);
    },
  },
  mounted() {
    this.getOneClient();
  }
};
</script>

<style>
.OneCategory{
  width: 30%;
}
.modal-content {
  width: 50%;
  height: 25%;
  padding: 24px;
  background: #fff;
  border-radius:8px
}
.product-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-box{
  width: 100%;
  display: flex;
  flex-direction: column;
}
.allReturnPrice {
  padding: 12px 48px;
  background: red;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  border-radius: 4px;
}
</style>
