<template>
  <div v-if="showModal" class="modal-overlay">
    <div class="modal">
      <h3>{{ editLead ? 'Редактировать Лиды' : 'Добавлять Лиды' }}</h3>
      <div class="modal-content">
        <div class="form-group">
          <label>Имя клиента</label>
          <input type="text" v-model="lead.clientname" placeholder="Имя клиента" @input="clearError('clientname')" />
          <span v-if="errors.clientname" class="error-text">{{ errors.clientname }}</span>
        </div>
        <div class="form-group">
          <label>Номер клиента</label>
          <input type="tel" v-model="lead.phone" placeholder="Номер клиента" @input="clearError('phone')" />
          <span v-if="errors.phone" class="error-text">{{ errors.phone }}</span>
        </div>
        <div class="form-group">
          <label>Услуга</label>
          <input type="text" v-model="lead.service" placeholder="Услуга" @input="clearError('service')" />
          <span v-if="errors.service" class="error-text">{{ errors.service }}</span>
        </div>
        <div class="form-group">
          <label>Была ли консультация?</label>
          <select v-model="lead.consultation">
            <option :value="true">Да</option>
            <option :value="false">Нет</option>
          </select>
        </div>
        <div class="form-group">
          <label>Статус</label>
          <select v-model="lead.status">
            <option>Под консультацией</option>
            <option>Потенциальный клиент</option>
            <option>Закрыто</option>
          </select>
        </div>
        <div class="form-group">
          <label>Комментарии</label>
          <input v-model="lead.comments" placeholder="Введите комментарии" />
        </div>
      </div>
      <div class="modal-buttons">
        <button @click="closeModal">Отмена</button>
        <button @click="validateAndSave">Сохранить</button>
      </div>
    </div>
  </div>
</template>

<script>
import eventNames from '@/universal/eventNames';
import { ipcRenderer } from 'electron';

export default {
  name: "LeadCreate",
  props: {
    showModal: Boolean,
    editLead: Object
  },
  data() {
    return {
      lead: this.editLead ? { ...this.editLead } : {
        clientname: "",
        phone: "",
        service: "",
        consultation: false,
        status: "Потенциальный клиент",
        comments: ""
      },
      errors: {
        clientname: "",
        phone: "",
        service: ""
      }
    };
  },
  methods: {
    validateAndSave() {
      this.errors = {
        clientname: "",
        phone: "",
        service: ""
      };

      let isValid = true;

      if (!this.lead.clientname) {
        this.errors.clientname = "Имя клиента обязательно";
        isValid = false;
      }
      if (!this.lead.phone) {
        this.errors.phone = "Номер клиента обязателен";
        isValid = false;
      } else if (!/^\+?[0-9]{10,15}$/.test(this.lead.phone)) {
        this.errors.phone = "Некорректный номер телефона";
        isValid = false;
      }
      if (!this.lead.service) {
        this.errors.service = "Услуга обязательна";
        isValid = false;
      }

      if (isValid&&this.editLead) {
        this.updateLead()
        this.$emit("close");
      }
      if(isValid&&!this.editLead){
        this.createLead()
      }
    },
    async updateLead(){

    },
    async createLead(){
      const newLead = {
        name: this.lead.clientname,
        phone: this.lead.phone,
        service: this.lead.service,
        status: this.lead.status,
        description: this.lead.comments,
        consultation: this.lead.consultation,
      }
      console.log(newLead);
      
      await ipcRenderer.invoke(eventNames.createLeadEvent,JSON.parse(JSON.stringify(newLead)))
      .then((res)=>console.log(res))
      .catch((err)=>console.log(err))
    },
    clearError(field) {
      this.errors[field] = "";
    },
    closeModal(){
      this.errors=[]
      this.$emit('close');
    }
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  width: 60%;
  height: auto;
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  gap: 12px;
}
.modal-content{
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.form-group {
  margin-bottom: 16px;
  width: 48%;

}

.form-group label {
  display: block;
  margin-bottom: 8px;
}
.modal-buttons{
  width: 100%;
  display: flex;
  justify-content: center;
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
  background-color: #3898EC;
  color: #fff;
}

.modal-buttons button:first-child {
  background-color: red;
  color: #fff;
}

.form-group input, .form-group select, .form-group textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.error-text {
  color: red;
  font-size: 12px;
}
</style>
