<template>
  <div class="warehouse">
    <div class="product-top">
      <h2>Специалист</h2>
      <div class="d-flex a-center j-between gap12">
        <button class="create-button" @click="showModal = true">Создать рабочие</button>
      </div>
    </div>

    <div class="warehouse-bottom">
      <div class="bottom-container">
        <div class="category" v-for="item in items" :key="item.id">
          <div class="d-flex j-between a-center">
            <div class="category-titles d-flex gap24">
              <span>{{ item.name }}</span>
              <span style="font-weight: 500; font-size: 16px">{{ item.foiz }}%</span>
            </div>

            <div class="all-debts">{{ formatSumma(item?.summa) }} Sum</div>

            <div class="warehouseButtonbox d-flex gap24">
              <div class="buttonbox">
                <button @click="oplatit(item._id)">Оплатить</button>
              </div>

              <div class="context d-flex gap12 a-center">
                <div class="context-item deleteItem" @click="editWorker(item._id)">
                  <IconComponent name="editIcon" />
                </div>
                <div class="context-item deleteItem" @click="openDeleteModal(item._id)">
                  <IconComponent name="deleteIcon" />
                </div>
              </div>
            </div>

            <div class="openArchive" @click.stop="toggleArchive(item)">
              <IconComponent :name="item.archiveOpen ? 'arrowTop' : 'arrowBottom'" />
            </div>
          </div>

          <div v-if="item.archiveOpen" class="archive-box">
            <div v-for="archiveItem in paginatedItems" :key="archiveItem._id" class="archive-item">
              <p style="color: blue;">#{{ archiveItem?._id }}</p>
              <p>{{ formatDate(archiveItem.updatedAt) }}</p>
              <p>{{ formatSumma(archiveItem.status === 'returned' ? `-${archiveItem.summa}` : `+${archiveItem.summa}`) }}</p>
              <p>{{ formatSumma(archiveItem.worker_summa_new) }}</p>
            </div>

            <div class="pagination">
              <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
              <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
            </div>
          </div>
        </div>

        <div v-if="!items.length" class="no-items">Специалистов пока нет</div>
      </div>
    </div>

    <PayedProduct  :title="'Ежемесячно или аванс для специалиста'" :openModal="monthlyModal" @close="handleModalClose('PayedProduct')" @success="updateworkerSumma($event)" />
    <UserCreate @close="handleModalClose('UserCreate')" @status="handleStatus($event)" :showModal="showModal" :editWorker="editWorkerItem" />
    <RequiredModal @close="handleModalClose('RequiredModal')" :showModal="deleteModal" :title="title" @confirm="handleDeleteConfirmation" />
    <ToastComponent :toastOptions="toastOptions" />
  </div>
</template>
<script>
import UserCreate from "../models/UserCreate.vue";
import IconComponent from "../components/IconComponent.vue";
import { ipcRenderer } from "electron";
import eventNames from "@/universal/eventNames";
import RequiredModal from "../models/requiredModal.vue";
import ToastComponent from '../components/Toastiff.vue';
import PayedProduct from "../models/payedProduct.vue";

export default {
  components: {
    UserCreate,
    IconComponent,
    RequiredModal,
    ToastComponent,
    PayedProduct
  },
  data() {
    return {
      showModal: false,
      editWorkerItem: null,
      deleteModal: false,
      workerId: "",
      currentPage: 1,
      itemsPerPage: 5,
      title: '',
      items: [],
      monthlyModal: false,
      toastOptions: {
        open: false,
        text: "",
        style: { background: "#4CAF50" }
      },
      archiveWorker: [],
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.archiveWorker.length / this.itemsPerPage);
    },
    paginatedItems() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.archiveWorker.slice(start, end);
    }
  },
  methods: {
    async updateworkerSumma(input) {
      const AllSum = this.items.find((product) => product._id === this.workerId);
      const sum = AllSum.summa - Number(input);
      AllSum.summa = sum;

      const oneWorker = {
        ...AllSum,
        summa: sum,
        status: 'paid'
      };

      try {
        const res = await ipcRenderer.invoke(eventNames.updateWorkerEvent, JSON.parse(JSON.stringify(oneWorker)));
        
        if (res.status === 201) {
          this.monthlyModal = false; 
        }
      } catch (err) {
        console.log(err);
      }
    },

    oplatit(id) {
      this.monthlyModal = true;
      this.workerId = id;
    },

    formatSumma(summa) {
      return new Intl.NumberFormat('ru-RU').format(summa);
    },

    formatDate(date) {
      return new Date(date).toLocaleDateString('ru-RU');
    },

    handleStatus(event) {
      this.toastOptions = {
        open: true,
        text: event?.text,
        style: event.type === 'success' ? { background: "#4CAF50" } : { background: "#FF0000" }
      };
    },

    async toggleArchive(item) {
  // Close all archives first
  this.items.forEach(category => {
    if (category._id !== item._id) {
      category.archiveOpen = false;
    }
  });

  // Toggle the selected worker's archive
  const isCurrentlyOpen = item.archiveOpen;
  item.archiveOpen = !isCurrentlyOpen;

  if (item.archiveOpen) {
    try {
      const res = await ipcRenderer.invoke(eventNames.oneWorkerEvent, { id: item._id });
      if (res.status === 200) {
        console.log(res.args?.histories);
        this.archiveWorker = res?.args?.histories || [];
      }
    } catch (err) {
      console.error(err);
    }
  }
},


    nextPage() {
      this.currentPage = Math.min(this.currentPage + 1, this.totalPages);
    },

    prevPage() {
      this.currentPage = Math.max(this.currentPage - 1, 1);
    },

    editWorker(id) {
      const product = this.items.find(product => product._id === id);
      this.showModal = true;
      console.log(product);
      
      this.editWorkerItem = product;
    },

    async getWorkers() {
      try {
        const res = await ipcRenderer.invoke(eventNames.listWorkerEvent, {});
        if (res.status === 200) {
          this.items = res?.args || [];
        }
      } catch (err) {
        console.error(err);
      }
    },

    handleModalClose(modalName) {
      if (modalName === 'UserCreate' || modalName === 'RequiredModal') {
        this.showModal = false;
        this.deleteModal = false;
        this.getWorkers()
      } else if (modalName === 'PayedProduct') {
        this.monthlyModal = false;
        this.getWorkers()
      }
    },

    openDeleteModal(id) {
      const product = this.items.find(product => product._id === id);
      if (product.summa > 0) {
        this.title = 'Вы действительно хотите удалить этого специалиста?';
        this.deleteModal = true;
        this.workerId = id;
        this.handleDeleteConfirmation(true);
      } else {
        this.title = 'Вы не можете удалить этого специалиста.';
        this.deleteModal = true;
      }
    },

    async handleDeleteConfirmation(confirm) {
      if (confirm) {
        try {
          await ipcRenderer.invoke(eventNames.deleteWorkerEvent, { id: this.workerId });
          this.getWorkers(); 
        } catch (err) {
          console.error(err);
        }
      }
    }
  },
  mounted() {
    this.getWorkers();
  }
};
</script>
<style scoped>
.warehouse {
  width: 85%;
  height: 100%;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.category-titles {
  width: 40%;
}

.warehouseButtonbox {
  display: flex;
  gap: 24px;
}

.all-debts {
  font-weight: bold;
  color: #333;
}

.pagination {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
}

.no-items {
  text-align: center;
  font-size: 18px;
  color: #666;
}
</style>
