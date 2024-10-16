<template>
  <div v-if="showModal" class="modal-overlay">
    <div class="modal-content">
      <h3>{{ 'Редактирование категории' }}</h3>
      <form @submit.prevent="submitForm">
        <!-- Category Name -->
        <div class="form-group">
          <label for="categoryName">Название категории</label>
          <input type="text" v-model="newCategory.name" placeholder="Введите название категории" id="categoryName" />
          <span v-if="category_nameError" class="error">Пожалуйста, введите название категории</span>
        </div>

        <!-- Firma Selection -->
        <div class="form-group">
          <label for="firma">Выберите фирму</label>
          <select v-model="newCategory.firma_id" id="firma">
            <option>Выберите фирму</option>
            <option v-for="company in companies" :key="company._id" :value="company._id">{{ company.name }}</option>
          </select>
          <span v-if="firmaError" class="error">Пожалуйста, выберите фирму</span>
        </div>

        <!-- Toggle buttons for Mahsulot sotib olish and ishlangan tovarlarni chiqarish -->
        <div class="form-group">
          <button type="button" class="type" @click="setAdd(true)" :class="{ active: add }">
            Покупка продукта
          </button>
        </div>
        <div class="form-group">
          <button type="button" class="type" @click="setAdd(false)" :class="{ active: !add }">
            Остаточное изменение продукта
          </button>
        </div>
        <div class="form-group">
          <label for="productName">Сколько товаров</label>
          <input type="number" v-model="newCategory.product_digit" placeholder="Tovar nomini kiriting" id="productName" />
        </div>

        <div class="form-group">
          <label for="productPrice">Цена за штуку</label>
          <input type="number" v-model="newCategory.summa" placeholder="Tovar narxini kiriting" id="productPrice" />
        </div>
        <div class="form-group datepickers">
          <label for="productPrice">Цена за штуку</label>
          <DatePicker @dateSelected="handleDateSelection($event)" :write-day="isEdit?client.date:''" placeholder="Введите дату начала договора"/>
        </div>
        <div class="form-group">
          <label for="productPrice">Цена за штуку</label>
          <input type="number" v-model="newCategory.summa" placeholder="Tovar narxini kiriting" id="productPrice" />
        </div>
        <div class="modal-footer">
          <button type="button" @click="closeModal" class="btn-cancel">Отмена</button>
          <button type="submit" @click="handleSubmitForm" class="btn-save">
            {{ 'Сохранять' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import eventNames from '@/universal/eventNames';
import { ipcRenderer } from 'electron';
import { sendErrorToTelegram } from '../utils';
import DatePicker from '../components/datePicker.vue';
export default {
  props: {
    showModal: {
      type: Boolean,
      default: false,
    },
    editCategor: {
      type: Object,
    },
  },
  component:{
    DatePicker
  },
  data() {
    return {
      newCategory: {
        _id: "",            // To store the _id for updating
        name: "",           // Updated key for category name
        firma_id: "",       // Updated key for firma
        product_digit: "",   // Product name
        summa: "",          // Product price (summa)
      },
      add: true,            // Flag for whether it's a new product or not
      companies: [],
      category_nameError: false,
      firmaError: false,
    };
  },
  methods: {
    handleDateSelection(event){
      console.log(event);
    },
    closeModal() {
      this.$emit("close");
    },
    setAdd(value) {
      this.add = value; // Toggle between true and false based on the button click
    },
    async handleSubmitForm() {
      this.resetErrors();
      let isValid = true;

      // Validation for category name and firma
      if (!this.newCategory.name) {
        this.category_nameError = true;
        isValid = false;
      }

      if (!this.newCategory.firma_id) {
        this.firmaError = true;
        isValid = false;
      }

      if (!isValid) return;

      let summa = null;
      if (this.add) {
        summa = Number(this.editCategor.summa) + Number(this.newCategory.summa);
      } else {
        summa = Number(this.editCategor.summa) - Number(this.newCategory.summa);
      }
      const category = {
        id: this.newCategory._id,            // Include _id for update
        name: this.newCategory.name,          // Name
        firma_id: this.newCategory.firma_id,  // Firma
        product_name: this.newCategory.product_name, // Product Name
        summa: summa,        // Summa (Price)
        add: this.add,                        // Add flag
        firma_summa: this.newCategory.summa
      };

      // Save to local storage
      this.saveToLocalStorage(category);

      console.log(category);
      await ipcRenderer
        .invoke(eventNames.updateCategoryEvent, JSON.parse(JSON.stringify(category)))
        .then((res) => {
          if (res.status === 201) {
            console.log("Kategoriya muvaffaqiyatli yangilandi:", res);
          } else if (res.status === 401) {
            sendErrorToTelegram({
              name: "EditCategory: Unauthorized",
              message: "Kategoriya yangilashda muammo. Iltimos, firma ID yoki summa to'g'riligini tekshiring.",
            });
          } else if (res.status === 500) {
            sendErrorToTelegram({
              name: "EditCategory: Internal Server Error",
              message: "Serverda xatolik yuz berdi. Kategoriya yangilanishi mumkin emas.",
            });
          }
        })
        .catch((err) => {
          sendErrorToTelegram({
            name: "EditCategory: Unexpected Error",
            message: `Kutilmagan xato: ${err.message}`,
          });
        });

      this.closeModal();
      this.resetForm();
    },
    resetErrors() {
      this.category_nameError = false;
      this.firmaError = false;
    },
    resetForm() {
      this.newCategory = {
        _id: "",
        name: "",
        firma_id: "",       
        product_name: "",   
        summa: "",          
      };
      this.resetErrors();
    },
    async getClients() {
      await ipcRenderer.invoke(eventNames.listCompanyEvent, {})
        .then((res) => {
          if (res.status == 200) {
            this.companies = res?.args;
          }
        })
        .catch((err) => console.log(err));
    },
    saveToLocalStorage(category) {
      // Get existing archive data from local storage
      const archiveCategory = JSON.parse(localStorage.getItem('archiveCategory')) || {};

      // Check if there's already an entry for the category ID
      if (!archiveCategory[category.id]) {
        archiveCategory[category.id] = []; // Initialize an empty array if it doesn't exist
      }

      // Push the current category data into the corresponding array
      archiveCategory[category.id].push({
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: this.add ? "added" : "removed", // Change status based on action
        product_name: category.product_name,
        summa: category.summa,
        firma_id: category.firma_id,
        category_id: category.id, // Save the category ID for reference
      });

      // Save the updated archive data back to local storage
      localStorage.setItem('archiveCategory', JSON.stringify(archiveCategory));
    },

    getArchivedRecords(categoryId) {
      const archivedRecords = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith(`category_${categoryId}`)) {
          archivedRecords.push(JSON.parse(localStorage.getItem(key)));
        }
      }
      return archivedRecords;
    }
  },
  watch: {
    editCategor: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.newCategory._id = newVal._id;
          this.newCategory.name = newVal.name;
          this.newCategory.firma_id = newVal.firma_id;
          this.newCategory.product_name = newVal.product_name || "";
        }
      }
    }
  },
  mounted() {
    this.getClients();
  },
};
</script>

<style >
.type {
  width: 100%;
  height: 48px;
  cursor: pointer;
  border-radius: 4px;
  color: #000;
  border: 1px solid lightgray;
}
.datepickers{
  height: 64px;
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
.modal-content {
  width: 60%;
  height: 40%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.active {
  background-color: #007bff;
  color: white;
}

.modal-footer button {
  width: 220px;
  height: 48px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

form {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.form-group {
  width: 48%;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

form>div>input,
select {
  border: 1px solid #ccc;
  padding: 12px;
  border-radius: 4px;
}

.modal-footer button:last-child {
  background-color: #007bff;
  color: #fff;
}

.modal-footer button:first-child {
  background-color: red;
  color: #fff;
}
</style>
