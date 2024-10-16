<template>
  <div v-if="showModal" class="modal-overlay">
    <div class="modal-content">
      <h3>{{ isEdit ? 'Изменить фирму' : 'Создать новую фирму' }}</h3>
      <form @submit.prevent="submitForm">
        <!-- Название магазин -->
        <div class="form-group">
          <label for="storeName">Название магазин:</label>
          <input type="text" v-model="client.name" id="storeName" :placeholder="storeNameError ? 'Пожалуйста, введите название магазина' : 'Название магазина'" />
          <span v-if="storeNameError" class="error">Пожалуйста, введите название магазина</span>
        </div>

        <!-- Главный ФИО -->
        <div class="form-group">
          <label for="mainFio">Главный ФИО:</label>
          <input type="text" v-model="client.username" id="mainFio" :placeholder="mainFioError ? 'Пожалуйста, введите полное ФИО' : 'Главный ФИО'" />
          <span v-if="mainFioError" class="error">Пожалуйста, введите полное ФИО (только кириллица)</span>
        </div>

        <!-- Номер телефона (Главный) -->
        <div class="form-group">
          <label for="mainPhone">Номер телефона (Главный):</label>
          <input type="tel" v-model="client.phone_username" id="mainPhone" :placeholder="mainPhoneError ? 'Пожалуйста, введите корректный номер телефона' : 'Номер телефона (Главный)'" />
          <span v-if="mainPhoneError" class="error">Пожалуйста, введите корректный номер телефона</span>
        </div>

        <!-- Менеджер ФИО -->
        <div class="form-group">
          <label for="managerFio">Менеджер ФИО:</label>
          <input type="text" v-model="client.manager" id="managerFio" :placeholder="managerFioError ? 'Пожалуйста, введите полное ФИО' : 'Менеджер ФИО'" />
          <span v-if="managerFioError" class="error">Пожалуйста, введите полное ФИО (только кириллица)</span>
        </div>
        <div class="form-group">
          <label for="managerPhone">Номер телефона (Менеджер):</label>
          <input type="tel" v-model="client.phone_manager" id="managerPhone" :placeholder="managerPhoneError ? 'Пожалуйста, введите корректный номер телефона' : 'Номер телефона (Менеджер)'" />
          <span v-if="managerPhoneError" class="error">Пожалуйста, введите корректный номер телефона</span>
        </div>
        <div class="form-group">
          <label for="firmaStatus">Статус:</label>
          <select v-model="client.status" id="clients">
            <option >Выберите статус</option> 
            <option  value="active">Активен</option> 
            <option >Неактивен</option> <!-- Assign value to inactive status -->
          </select>
          <span v-if="statusError" class="error">Пожалуйста, выберите статус</span>
        </div>                
        
        <!-- Адрес -->
        <div class="form-group">
          <label for="address">Адрес:</label>
          <input type="text" v-model="client.address" id="address" :placeholder="addressError ? 'Пожалуйста, введите адрес' : 'Адрес'" />
          <span v-if="addressError" class="error">Пожалуйста, введите адрес</span>
        </div>

        <!-- ИНН/СТИР (Налоговый номер) -->
        <div class="form-group">
          <label for="inn">ИНН/СТИР (Налоговый номер):</label>
          <input type="text" v-model="client.tax_phone" id="inn" :placeholder="innError ? 'Пожалуйста, введите корректный ИНН' : 'ИНН/СТИР'" />
          <span v-if="innError" class="error">Пожалуйста, введите корректный ИНН</span>
        </div>

        <!-- Электронная почта -->
        <div class="form-group">
          <label for="email">Электронная почта:</label>
          <input type="email" v-model="client.email" id="email" :placeholder="emailError ? 'Пожалуйста, введите корректный email' : 'Электронная почта'" />
          <span v-if="emailError" class="error">Пожалуйста, введите корректный email</span>
        </div>

        <!-- Дата регистрации -->
        <div class="form-group datepickers">
          <label for="registrationDate">Дата регистрации:</label>
          <DatePicker @dateSelected="handleDateSelection($event, 'start')" :write-day="isEdit?client.date:''" placeholder="Введите дату начала договора"/>
          <span v-if="registrationDateError" class="error">Пожалуйста, выберите дату регистрации</span>
        </div>

        <div class="modal-footer">
          <button type="button" @click="closeModal" class="btn-cancel">Отмена</button>
          <button type="submit" class="btn-save">Сохранить</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron';
import DatePicker from '../components/datePicker.vue';
import eventNames from '@/universal/eventNames';
import { sendErrorToTelegram } from '../utils';

export default {
  components:{
    DatePicker    
  },
  props: {
    showModal: {
      type: Boolean,
      default: false,
    },
    editClient: {
      type: Object,
      default:null
    },
  },
  data() {
    return {
      client: {
        name: "",
        username: "",
        phone_username: "",
        manager: "",
        phone_manager: "",
        status: "Активен",
        address: "",
        tax_phone: "",
        email: "",
        date: "",
      },
      storeNameError: false,
      mainFioError: false,
      mainPhoneError: false,
      managerFioError: false,
      managerPhoneError: false,
      statusError: false,
      addressError: false,
      innError: false,
      emailError: false,
      registrationDateError: false,
    };
  },
  computed: {
    isEdit() {
      return this.editClient;
    },
  },
  watch: {
    editClient: {
      immediate: true,
      handler(newVal) {
        console.log(newVal);
        if (newVal) {
          this.client = { ...newVal,id:newVal._id }; 
        } else {
          this.client = {
            name: "",
            username: "",
            phone_username: "",
            manager: "",
            phone_manager: "",
            status: "active",
            address: "",
            tax_phone: "",
            email: "",
            date: "",
          };
        }
      },
    },
  },
  methods: {
    handleDateSelection(event){
      this.client.date=event
    },
    closeModal() {
      this.$emit("close");
    },
    validateFields() {
      this.storeNameError = !this.client.name;
      this.mainFioError = !this.client.username;
      this.mainPhoneError = !this.client.phone_username || !/^(\+)?\d{10,15}$/.test(this.client.phone_username);
      this.managerFioError = !this.client.manager;
      this.managerPhoneError = !this.client.phone_manager || !/^(\+)?\d{10,15}$/.test(this.client.phone_manager);
      this.statusError = !this.client.status;
      this.addressError = !this.client.address;
      this.innError = !this.client.tax_phone || !/^\d{9,15}$/.test(this.client.tax_phone);
      this.emailError = !this.client.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.client.email);
      this.registrationDateError = !this.client.date;
      
      return !(
        this.storeNameError ||
        this.mainFioError ||
        this.mainPhoneError ||
        this.managerFioError ||
        this.managerPhoneError ||
        this.statusError ||
        this.addressError ||
        this.innError ||
        this.emailError ||
        this.registrationDateError
      );
    },
    submitForm() {
      if (this.validateFields()) {
        if(this.isEdit){
          this.updateClient()
        }
        else{
          this.createClient()
        }
        this.closeModal();
      }
      
    },
    async updateClient(){
      await ipcRenderer.invoke(eventNames.updateCompanyEvent,JSON.parse(JSON.stringify(this.client)))
      .then((res)=>{
        if(res.status==201){
          this.$emit('status',{type:"success",text:"Mahsulot muvaffaqqtiyatli qoshildi"})
        }else{
          this.$emit('status',{type:"error",text:"Mahsulot qo'shilishda hatolik"})
        }
      })
      .catch((err)=>{
        sendErrorToTelegram({name:"FirmaCreate: Internal server error",message:err.message })
      })
    },
   async createClient(){
      const newClient ={
        name: this.client.name,
        username: this.client.username,
        manager: this.client.manager,
        phone_username: this.client.phone_username,
        phone_manager: this.client.phone_manager,
        status: this.client.status,
        address:this.client.address,
        tax_phone: this.client.tax_phone,
        email: this.client.email,
        date: this.client.date,
      }
      await ipcRenderer.invoke(eventNames.createCompanyEvent,JSON.parse(JSON.stringify(newClient)))
      .then((res)=>{
        if(res.status==201){
          this.$emit('status',{type:"success",text:"Mahsulot muvaffaqqtiyatli qoshildi"})
        }else{
          this.$emit('status',{type:"error",text:"Mahsulot qo'shilishda hatolik"})
        }
      })
      .catch((err)=>console.log(err))
    },
    
  },
};
</script>


<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  width: 60%;
  height: auto;
  min-height: 50%;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}
.datepickers{
  position: relative;
}
.date-pic-temp{
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0px 12px;
  border-radius: 4px;
  border:1px solid lightgray
}
form {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 24px;
  
}

form > div {
  width: 48%;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

select{
height: 44px
}
form > div > input, select {
  border: 1px solid #ccc;
  padding: 12px;
  border-radius: 4px;
}

.modal-footer {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  gap: 12px;
}

.modal-footer button {
  width: 220px;
  height: 48px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.modal-footer button:last-child {
  background-color: #3898EC;
  color: #fff;
}

.modal-footer button:first-child {
  background-color: red;
  color: #fff;
}
.error{
  font-size: 12px;
  color: red;
}
</style>

