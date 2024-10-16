<template>
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <h3>{{ 'Qaytarilgan Mahsulot' }}</h3>
        <form @submit.prevent="submitForm">
          <div class="form-group">
            <label for="productName">Mahsulot nomi</label>
            <input type="text" v-model="returnedProduct.product_name" placeholder="Mahsulot nomini kiriting"
              id="productName" />
            <span v-if="product_nameError" class="error">Mahsulot nomini kiriting</span>
          </div>
  
          <div class="form-group">
            <label for="clientName">Mijoz nomi</label>
            <input type="text" v-model="returnedProduct.client_name" placeholder="Mijoz nomini kiriting"
              id="clientName" />
            <span v-if="client_nameError" class="error">Mijoz nomini kiriting</span>
          </div>
  
          <div class="form-group">
            <label for="price">Narxi</label>
            <input type="number" v-model="returnedProduct.price" placeholder="Mahsulot narxini kiriting"
              id="price" />
            <span v-if="priceError" class="error">Narxni kiriting</span>
          </div>
  
          <div class="form-group">
            <label for="workers">Hodimni tanlang</label>
              <MultiSelect @selected-workers="handleSelect($event ,item)"/>
            <span v-if="workerError" class="error">Hodimni tanlang</span>
          </div>
  
          <div class="modal-footer">
            <button type="button" @click="closeModal" class="btn-cancel">Bekor qilish</button>
            <button type="submit" @click="handleSubmitForm" class="btn-save">{{ 'Saqlash' }}</button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import eventNames from '@/universal/eventNames';
  import { ipcRenderer } from 'electron';
  import MultiSelect from '../components/multiSelect.vue';
import { sendErrorToTelegram } from '../utils';
  
  export default {
    components:{
      MultiSelect
    },
    props: {
      showModal: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        returnedProduct: {
          product_name: "",
          client_name: "",
          price: null,
          worker_id: "",
        },
        workers: [],
        product_nameError: false,
        client_nameError: false,
        priceError: false,
        workerError: false,
      };
    },
    methods: {
      closeModal() {
        this.resetForm();
        this.$emit("close");
      },
      handleSelect(event){
        this.returnedProduct.worker_id=event
      },
      async handleSubmitForm() {
        this.resetErrors();
        let isValid = true;
  
        if (!this.returnedProduct.product_name) {
          this.product_nameError = true;
          isValid = false;
        }
  
        if (!this.returnedProduct.client_name) {
          this.client_nameError = true;
          isValid = false;
        }
  
        if (!this.returnedProduct.price) {
          this.priceError = true;
          isValid = false;
        }
  
        if (!this.returnedProduct.worker_id) {
          this.workerError = true;
          isValid = false;
        }
  
        if (!isValid) return;
  
        const returnedProduct = {
          product_name: this.returnedProduct.product_name,
          client_name: this.returnedProduct.client_name,
          price: this.returnedProduct.price,
          workers: this.returnedProduct.worker_id,
        };
        console.log(returnedProduct);
  
        await ipcRenderer.invoke(eventNames.createInvalidEvent, JSON.parse(JSON.stringify(returnedProduct)))
  .then((res) => {
    if (res.status === 201) {
      console.log("qo'shildi");
    } else if (res.status === 400) {
      sendErrorToTelegram({
        name: "Bad Request: Invalid data",
        message: "400 hatolik. Ma'lumot noto'g'ri."
      });
    } else if (res.status === 401) {
      sendErrorToTelegram({
        name: "Unauthorized: User not authenticated",
        message: "401 hatolik. Foydalanuvchi avtorizatsiyadan o'tmagan."
      });
    } else if (res.status === 403) {
      sendErrorToTelegram({
        name: "Forbidden: Access denied",
        message: "403 hatolik. Kirish taqiqlangan."
      });
    } else if (res.status === 404) {
      sendErrorToTelegram({
        name: "Not Found: Resource not found",
        message: "404 hatolik. Resurs topilmadi."
      });
    } else if (res.status >= 500) {
      sendErrorToTelegram({
        name: "Server Error: Internal server error",
        message: "500+ hatolik. Serverda ichki xato yuz berdi."
      });
    } else {
      sendErrorToTelegram({
        name: "Unexpected Error",
        message: `Noma'lum xato. Status kodi: ${res.status}`
      });
    }
  })
  .catch((error) => {
    sendErrorToTelegram({
      name: "Unhandled Rejection",
      message: `Xato: ${error.message}`
    });
  });

  
        this.resetForm();
        this.closeModal();
      },
      resetErrors() {
        this.product_nameError = false;
        this.client_nameError = false;
        this.priceError = false;
        this.workerError = false;
      },
      resetForm() {
        this.returnedProduct = {
          product_name: "",
          client_name: "",
          price: null,
          worker_id: "",
        };
        this.resetErrors();
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
    height: 35%;
    background: #fff;
    padding: 24px;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
  }
  
  form {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
  }
  
  .form-group {
    width: 48%;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  
  input,
  select {
    border: 1px solid #ccc;
    padding: 12px;
    border-radius: 4px;
  }
  
  .error {
    color: red;
    font-size: 0.9em;
  }
  
  .modal-footer {
    display: flex;
    justify-content: center;
    gap: 12px;
    margin-top: 20px;
  }
  
  .btn-cancel {
    background-color: red;
    color: #fff;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .btn-save {
    background-color: #007bff;
    color: #fff;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
  }
  </style>
  