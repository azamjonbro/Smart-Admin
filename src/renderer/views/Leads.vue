<template>
  <div class="leads">
    <div class="leads-top">
      <h2>Лиды</h2>
      <div class="d-flex a-center j-between gap12"> 
        <input class="leads-search" type="text" placeholder="Поиск Лиды" v-model="searchQuery" />
        <button class="create-button" @click="showModal = true">Добавить лид</button>
      </div>
    </div>
    <div class="leads-bottom">
      <table class="w-100 overflow">
        <thead>
          <tr>
            <th>Имя клиента</th>
            <th>Номер клиента</th>
            <th>Услуга</th>
            <th>Консультация</th>
            <th>Консультация</th>
            <th>Статус</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="lead in paginatedLeads" :key="lead._id">
            <td>{{ lead.name }}</td>
            <td><a style="color: blue;" :href="`tel:${lead.phone}`">{{ lead.phone }}</a></td>
            <td>{{ lead.service }}</td>
            <td>{{ lead.consultation ? 'Да' : 'Нет' }}</td>
            <td>{{ lead.consultation ? 'Да' : 'Нет' }}</td>
            <td>{{ lead.status }}</td>
            <td class="table__buttonbox d-flex gap12">
              <IconComponent name="editIcon" @click="editLead(lead._id)" />
              <IconComponent name="deleteIcon" @click="deleteLead(lead._id)" />
            </td>
          </tr>
        </tbody>
      </table>
      <div class="pagination">
        <button :disabled="currentPage === 1" @click="currentPage--">Previous</button>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <button :disabled="currentPage === totalPages" @click="currentPage++">Next</button>
      </div>
      
      <LeadCreate :editLead="editLeadItem" :showModal="showModal" @close="showModal=false"/>
      <RequiredModal :showModal="deleteModal" @close="deleteModal = false" :title="'Вы хотите удалить этот лид?'" @confirm="handleDeleteConfirmation"/>
    </div>
  </div>
</template>

<script>
import LeadCreate from '../models/LeadsCreate.vue';
import IconComponent from '../components/IconComponent.vue';
import RequiredModal from '../models/requiredModal.vue';
import { ipcRenderer } from 'electron';
import eventNames from '@/universal/eventNames';
export default {
  name: "LeadsPage",
  components: {
    LeadCreate,
    IconComponent,
    RequiredModal
  },
  data() {
    return {
      searchQuery: "",
      showModal: false,
      deleteModal:false,
      currentPage: 1,
      itemsPerPage: 13, 
      editLeadItem:null,
      leads: []
    };
  },
  computed: {
    filteredLeads() {
      return this.leads.filter(lead =>
        lead.name?.toLowerCase?.()?.includes(this.searchQuery?.toLowerCase?.())
      );
    },
    paginatedLeads() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredLeads.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredLeads.length / this.itemsPerPage);
    }
  },
  methods: {
    editLead() {
      this.showModal=true
      this.editLeadItem={
          clientname: "Aziza",
          phone: "+998998564123",
          service: "Консультация по IT услугам",
          consultation: true,
          status: "Потенциальный клиент"
        }
    },
    deleteLead(id) {
      if(id){
        this.deleteModal=true
      }
    },
    handleDeleteConfirmation(event){
      console.log(event);
      
    },
    async getLeads(){
      await ipcRenderer.invoke(eventNames.listLeadEvent,{})
      .then((res)=>{
        if(res?.status==200){
          this.leads=res?.args?.reverse()
        }
      })
      .catch((err)=>console.log(err))
    },
  },
  mounted(){
    this.getLeads()
  }
};
</script>

<style>
.leads {
  width: 85%;
  height: 100%;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.leads-top {
  width: 100%;
  padding: 24px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
}

.leads-search {
  width: 320px;
  height: 48px;
  border: 1px solid gray;
  border-radius: 8px;
  font-size: 14px;
  padding-left: 12px;
}

.leads-bottom {
  width: 100%;
  height: 100%;
  background: #fff;
  padding: 12px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}


.pagination {
  display: flex;
  justify-content: end;
  align-items: center;
  gap: 48px;
  margin-top: 16px;
}
</style>
