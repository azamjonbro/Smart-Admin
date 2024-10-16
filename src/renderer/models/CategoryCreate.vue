<template>
  <div v-if="showModal" class="modal-overlay">
    <div class="modal-content">
      <h3>{{ "Добавить новую категорию" }}</h3>
      <form @submit.prevent="submitForm">
        <div class="form-group">
          <label for="categoryName">Название категории</label>
          <input
            type="text"
            v-model="newCategory.category_name"
            placeholder="Введите название категории"
            id="categoryName"
          />
          <span v-if="category_nameError" class="error"
            >Пожалуйста, введите название категории</span
          >
        </div>

        <div class="form-group">
          <label for="firma">Выберите фирму</label>
          <select v-model="newCategory.category_firma" id="firma">
            <option>Выберите фирму</option>
            <option
              v-for="company in companies"
              :key="company._id"
              :value="company._id"
            >
              {{ company.name }}
            </option>
          </select>
          <span v-if="firmaError" class="error"
            >Пожалуйста, выберите фирму</span
          >
        </div>

        <div class="modal-footer">
          <button type="button" @click="closeModal" class="btn-cancel">
            Отмена
          </button>
          <button type="submit" @click="handleSubmitForm" class="btn-save">
            {{ "Сохранять" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import eventNames from "@/universal/eventNames";
import { ipcRenderer } from "electron";
import { sendErrorToTelegram } from "../utils";

export default {
  props: {
    showModal: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      newCategory: {
        category_name: "",
        category_firma: "",
      },
      companies: [],
      category_nameError: false,
      firmaError: false,
    };
  },
  methods: {
    closeModal() {
      this.resetForm();
      this.$emit("close");
    },
    async handleSubmitForm() {
      this.resetErrors();
      let isValid = true;

      if (!this.newCategory.category_name) {
        this.category_nameError = true;
        isValid = false;
      }

      if (!this.newCategory.category_firma) {
        this.firmaError = true;
        isValid = false;
      }
      if (!isValid) return;

      const Category = {
        name: this.newCategory.category_name,
        firma_id: this.newCategory.category_firma,
      };
      console.log(Category);

      await ipcRenderer
        .invoke(
          eventNames.createCategoryEvent,
          JSON.parse(JSON.stringify(Category))
        )
        .then((res) => {
          if (res.status === 201) {
            // Muvaffaqiyatli yaratish
            return res;
          } else if (res.status === 401) {
            sendErrorToTelegram({
              name: "CategoryCreate: Unauthorized",
              message:
                "Category yaratishda ruxsat yetishmayapti yoki foydalanuvchi avtorizatsiyasi yo'q.",
            });
          } else if (res.status === 404) {
            sendErrorToTelegram({
              name: "CategoryCreate: Not Found",
              message:
                "Firmani topa olmayapti yoki category malumotlari noto'g'ri berilmoqda.",
            });
          } else if (res.status >= 500) {
            sendErrorToTelegram({
              name: "CategoryCreate: Internal server error",
              message: "Server xatosi. Login sahifasidagi xatolik.",
            });
          }
        })
        .catch((err) => {
          sendErrorToTelegram({
            name: "CategoryCreate: Unexpected Error",
            message: err.message,
          });
        });

      this.resetForm();
      this.closeModal();
    },
    resetErrors() {
      this.category_nameError = false;
      this.firmaError = false;
    },
    resetForm() {
      this.newCategory = {
        category_name: "",
        firma: "",
      };
      this.resetErrors();
    },
    async getClients() {
  await ipcRenderer
    .invoke(eventNames.listCompanyEvent, {})
    .then((res) => {
      console.log(res);
      if (res.status === 200) {
        this.companies = res?.args; // Muvaffaqiyatli kompaniyalar ma'lumotlari olindi
      } else if (res.status === 401) {
        sendErrorToTelegram({
          name: "GetClients: Unauthorized",
          message: "Kompaniyalar ro'yxatini olishda ruxsat etilmagan. Foydalanuvchi avtorizatsiyasini tekshiring.",
        });
      } else if (res.status === 500) {
        sendErrorToTelegram({
          name: "GetClients: Internal Server Error",
          message: "Serverda xatolik yuz berdi. Kompaniyalar ma'lumotlarini olishda muammo bor.",
        });
      }
    })
    .catch((err) => {
      sendErrorToTelegram({
        name: "GetClients: Unexpected Error",
        message: `Kutilmagan xato: ${err.message}`,
      });
    });
},

  },
  mounted() {
    this.getClients();
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
  min-height: 23%;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

form {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
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

.error {
  color: red;
  font-size: 0.9em;
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
  background-color: #007bff;
  color: #fff;
}

.modal-footer button:first-child {
  background-color: red;
  color: #fff;
}
</style>
