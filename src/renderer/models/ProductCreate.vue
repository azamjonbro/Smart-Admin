<template>
  <div v-if="showModal" class="modal-overlay">
    <div class="modal-content">
      <h3>
        {{ isEditing ? "Редактировать продукт" : "Добавить новый продукт" }}
      </h3>
      <form @submit.prevent="validateAndSubmit">
        <div>
          <label for="clientname">Имя клиента</label>
          <input
            type="text"
            id="clientname"
            placeholder="Введите имя клиента"
            v-model="newProduct.name"
            pattern="^[a-zA-Zа-яА-Я ]{3,50}$"
            required
            title="Имя клиента должно содержать от 3 до 50 символов. Допускаются только буквы и пробелы."
          />
        </div>
        <div>
          <label for="clientnumber">Номер телефона клиента</label>
          <input
            type="tel"
            id="clientnumber"
            placeholder="Введите номер клиента"
            v-model="newProduct.phone"
            pattern="^\+?[0-9]{10,15}$"
            required
            title="Введите корректный номер телефона в формате +1234567890 или 1234567890."
          />
        </div>
        <div>
          <label for="productname">Название продукта:</label>
          <input
            type="text"
            id="productname"
            placeholder="Название продукта"
            v-model="newProduct.type"
            pattern="^[a-zA-Zа-яА-Я0-9 ]{3,50}$"
            required
            title="Название продукта должно содержать от 3 до 50 символов. Допускаются только буквы, цифры и пробелы."
          />
        </div>
        <div>
          <label for="price">Цена продукта:</label>
          <input
            type="number"
            id="price"
            class="price"
            placeholder="Цена продукта"
            v-model="newProduct.price"
            required
            title="Введите корректную цену. Например, 10 или 10.50"
            min="1"
            step="any"
          />
        </div>
        <div>
          <label for="color">Цвет продукта:</label>
          <input
            type="text"
            placeholder="Цвет продукта"
            id="color"
            v-model="newProduct.color"
            pattern="^[a-zA-Zа-яА-Я ]{3,30}$"
            required
            title="Цвет продукта должен содержать от 3 до 30 символов. Допускаются только буквы и пробелы."
          />
        </div>
        <div>
          <label for="service">Специалисты</label>
          <MultiSelect @selected-workers="handleSelect($event ,item)" :activeWorker="isEditing?newProduct.workers:{}" />
        </div>
        <div class="datepickers">
          <label for="orderdate">Дата подачи заказа</label>
          <DatePicker @dateSelected="handleDateSelection($event, 'start')" :write-day="isEditing?this.newProduct.date1:''"  placeholder="Введите дату начала договора"/>
        </div>
        <div class="datepickers">
          <label for="orderdate">Дата подачи заказа</label>
          <DatePicker @dateSelected="handleDateSelection($event, 'end')" :write-day="isEditing?this.newProduct.date2:''" placeholder="Введите дату начала договора"/>
        </div>
        <div>
          <label for="store">Адрес клиента</label>
          <input
            type="text"
            id="store"
            placeholder="Введите адрес клиента"
            v-model="newProduct.address"
            pattern="^[a-zA-Zа-яА-Я0-9 ]{3,50}$"
            required
            title="Адрес должен содержать от 3 до 50 символов. Допускаются только буквы, цифры и пробелы."
          />
        </div>
        <div>
          <label for="status">Статус:</label>
          <select id="status" v-model="newProduct.status" required>
            <option value="">Выберите статус</option>
            <option>Заказ принят</option>
            <option>Заказ собирается</option>
            <option>Заказ доставляется</option>
            <option>Заказ устанавливается</option>
            <option>Заказ оплачен</option>
          </select>
        </div>
        <div>
          <label for="avans">Аванс</label>
          <input
            type="number"
            id="avans"
            placeholder="Введите сумму аванса"
            v-model="newProduct.advance"
            min="0"
            step="any"
            required
            title="Введите корректную сумму аванса."
          />
        </div>
        <div>
          <label for="residual">Оставшаяся сумма</label>
          <input
            type="number"
            id="residual"
            placeholder="Введите оставшуюся сумму"
            v-model="newProduct.balance"
            min="0"
            step="any"
            required
            title="Введите корректную оставшуюся сумму."
          />
        </div>
        <div class="modal-buttons">
          <button type="button" @click="closeModal">Отмена</button>
          <button type="submit">
            {{ isEditing ? "Сохранить изменения" : "Создать" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import MultiSelect from "../components/multiSelect.vue";
import eventNames from "@/universal/eventNames.js";
import { ipcRenderer } from "electron";
import DatePicker from "../components/datePicker.vue";
export default {
  components: {
    MultiSelect,
    DatePicker
  },
  props: {
    showModal: {
      type: Boolean,
      default: false,
    },
    editProduct: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      isEditing: false,
      multiSelect: [
        { value: "Usta1", label: "Usta1" },
        { value: "Usta2", label: "Usta2" },
        { value: "Usta3", label: "Usta3" },
      ],
      newProduct: {
        name: "",
        phone: "",
        type: "",
        price: "",
        color: "",
        address: "",
        workers: {},
        status: "",
        advance: "",
        balance: "",
        date1: new Date()?.toISOString?.(),
        date2: new Date()?.toISOString?.(),
      },
      productId:null,
    };
  },
  watch: {
    editProduct: {
      handler(newValue) {
        if (newValue) {
          this.isEditing = true;
          this.productId=newValue._id
          this.newProduct = { ...newValue };
        } else {
          this.isEditing = false;
          this.resetForm();
        }
      },
      immediate: true,
    },
    'newProduct.price': function () {
      this.calculateBalance();
    },
    'newProduct.advance': function () {
      this.calculateBalance();
    }
  },
  methods: {
    calculateBalance() {
      const price = parseFloat(this.newProduct.price) || 0;
      const advance = parseFloat(this.newProduct.advance) || 0;
      this.newProduct.balance = price - advance;
    },
    closeModal() {
      this.resetForm()
      this.$emit("close");
    },
    handleDateSelection(event,item){
      console.log(event,item);
      if(item=='start'){
        this.newProduct.date1=event
      }
      if(item=='end'){
        this.newProduct.date2=event
      }
      
    },
    async validateAndSubmit() {
      const product = {
        name: this.newProduct?.name,
        phone: this.newProduct?.phone,
        type: this.newProduct?.type,
        price: this.newProduct?.price,
        color: this.newProduct?.color,
        workers: this.newProduct?.workers,
        address: this.newProduct?.address,
        status: this.newProduct?.status,
        advance: this.newProduct?.advance,
        balance: this.newProduct?.balance,
        date1: this.newProduct?.date1, 
        date2: this.newProduct?.date2, 
      };
      if (this.isEditing) {
        console.log(this.newProduct);
        await ipcRenderer.invoke(eventNames.updateProductEvent, JSON.parse(JSON.stringify({...product,id:this.productId})))
        .then((res) => {
          console.log(res);
          if (res.status === 201) {
           this.closeModal()
            this.$emit("status",{type:"success",text:"Вы успешно обновили свой продукт!"});
          }else{
            this.$emit('status',{type:"error",text:"Произошла ошибка при смене продукта"})
          }
        })
        .catch((error) => {
          console.error("Error creating product:", error);
        });
      } else {
        await ipcRenderer
        .invoke(eventNames.createProductEvent, JSON.parse(JSON.stringify(product)))
        .then((res) => {
          if (res.status === 201) {
            this.$emit("status",{type:"success",text:"Вы успешно добавили товар"});
          }else{
            this.$emit('status',{type:"error",text:"Ошибка при добавлении товара"})  
          }
        })
        .catch((error) => {
          console.error("Error creating product:", error);
        });
      this.closeModal();
      this.resetForm()
      }
    },
    resetForm() {
      this.newProduct = {
        clientname: "",
        clientnumber: "",
        name: "",
        price: "",
        color: "",
        store: "",
        service: [],
        status: "",
        avans: "",
        residual: "",
        startdate: "",
        orderdate: "",
      };
    },
    handleSelect(event){
      this.newProduct.workers=event
      
    }
  },
};
</script>
<style scoped>
.datepickers{
  height: 64px
}
.date-pic-temp{
  position: relative;
  width:100%;
  height: 44px;
  display: flex;
  justify-content: start;
  align-items:center;
  border: 1px solid lightgray;
  border-radius: 4px ;
  padding: 12px 12px;
}
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

form {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 24px;
  gap: 12px;
}

form > div {
  width: 48%;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

form > div > input,
select {
  border: 1px solid #ccc;
  padding: 12px;
  border-radius: 4px;
}

.modal-buttons {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  gap: 12px;
}

.modal-buttons button {
  width: 220px;
  height: 48px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.modal-buttons button:last-child {
  background-color: #007bff;
  color: #fff;
}

.modal-buttons button:first-child {
  background-color: red;
  color: #fff;
}

input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
