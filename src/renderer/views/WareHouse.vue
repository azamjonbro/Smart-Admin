<template>
    <div class="warehouse">
      <div class="product-top">
        <h2>Продукты</h2>
        <div class="d-flex a-center j-between gap12">
          <button class="create-button" @click="createCategory">
            Создать категорию
          </button>
        </div>
      </div>
      <div class="warehouse-bottom">
        <div class="bottom-container">
          <div v-for="item in items" :key="item.id" class="category">
            <div class="d-flex j-between a-center">
              <div class="category-title d-flex gap24">
                <span>{{ item.name }}</span>
              </div>
              <div class="all-debts">{{ formatSumma(item?.summa) }} Sum</div>
              <div class="warehouseButtonbox d-flex gap24">
                <div class="context d-flex gap12 a-center">
                  <div
                    class="context-item deleteItem"
                    @click="editCategories(item._id)"
                  >
                    <IconComponent name="editIcon" />
                  </div>
                  <div
                    class="context-item deleteItem"
                    @click="openDeleteModal(item._id)"
                  >
                    <IconComponent name="deleteIcon" />
                  </div>
                </div>
              </div>
              <div class="openArchive" @click.stop="toggleArchive(item)">
                <IconComponent
                  :name="item.archiveOpen ? 'arrowTop' : 'arrowBottom'"
                />
              </div>
            </div>
  
            <!-- Archive with Pagination -->
            <div v-if="item.archiveOpen" class="archive-box">
              <div
                v-for="archiveItem in filteredArchiveItems(item._id)"
                :key="archiveItem.id"
                class="archive-item"
              >
                <p>{{ archiveItem.product_name }}</p>
                <p>{{ archiveItem.status=='removed'?`-${archiveItem.summa}`:archiveItem.summa }}</p> 
                {{ console.log(archiveItem) }}
              </div>
              <div class="pagination">
                <button @click="prevPage" :disabled="currentPage === 1">
                  Previous
                </button>
                <button @click="nextPage" :disabled="currentPage === totalPages">
                  Next
                </button>
              </div>
            </div>
          </div>
          <div v-if="!items.length" style="text-align: center">
            Категория пока нет
          </div>
        </div>
      </div>
      
      <CategoryCreate
        :editCategory="editCategoryItem"
        :showModal="showModal"
        @close="closeModal('createModal')"
      />
      <ConfirmationModal
        :showModal="deleteModal"
        :title="'Вы хотите удалить этот раздел товаров?'"
        @close="closeModal('deleteModal')"
        @confirm="handleDeleteConfirmation"
      />
      <EditCategory
        :showModal="editModal"
        :editCategor="editCategoryItem"
        @close="closeModal('payModal')"
      />
    </div>
  </template>
  
  <script>
  import CategoryCreate from "../models/CategoryCreate.vue";
  import ConfirmationModal from "../models/requiredModal.vue";
  import IconComponent from "../components/IconComponent.vue";
  import { ipcRenderer } from "electron";
  import eventNames from "@/universal/eventNames";
  import EditCategory from "../models/EditCategory.vue";
  
  export default {
    components: {
      CategoryCreate,
      ConfirmationModal,
      IconComponent,
      EditCategory,
    },
    data() {
      return {
        showModal: false,
        context: false,
        editModal: false,
        editCategoryItem: null,
        deleteModal: false,
        currentPage: 1,
        itemsPerPage: 5,
        categoryId: "",
        currentCategoryId: null, 
        items: [],
      };
    },
    computed: {
      totalPages() {
        return Math.ceil(this.filteredArchiveItems(this.currentCategoryId).length / this.itemsPerPage);
      },
      paginatedItems() {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        return this.filteredArchiveItems(this.currentCategoryId).slice(start, end);
      },
    },
    methods: {
      formatSumma(summa) {
        return new Intl.NumberFormat("ru-RU").format(summa);
      },
      closeModal(eventName) {
        if (eventName == "createModal") {
          this.showModal = false;
        }
        if (eventName == "purchaseModal") {
          this.purchased = false;
        }
        if (eventName == "payModal") {
          this.editModal = false;
        }
        if (eventName == "deleteModal") {
          this.deleteModal = false;
        }
        this.getCategory();
      },
      async toggleArchive(item) {
        this.items.forEach((category) => {
          if (category.id !== item.id) {
            category.archiveOpen = false;
          }
        });
        this.filteredArchiveItems(item._id)
        item.archiveOpen = !item.archiveOpen;
        this.currentCategoryId = item.id; // Track the current category ID
  
        await ipcRenderer
          .invoke(eventNames.oneCategoryEvent, { id: item._id })
          .then((res) => {
            res
          })
          .catch((err) => console.log(err));
      },
      filteredArchiveItems(categoryId) {        
        const archivedData = JSON.parse(localStorage.getItem('archiveCategory')) || {};
        return archivedData[categoryId] || []; 
      },
      closeAllArchives() {
        this.items.forEach((category) => {
          category.archiveOpen = false;
        });
      },
      handleClickOutside(event) {
        const archiveBoxes = document.querySelectorAll(".archive-box");
        let clickedInside = false;
  
        archiveBoxes.forEach((box) => {
          if (box.contains(event.target)) {
            clickedInside = true;
          }
        });
  
        if (!clickedInside) {
          this.closeAllArchives();
        }
      },
      nextPage() {
        if (this.currentPage < this.totalPages) {
          this.currentPage++;
        }
      },
      editCategories(id) {
        this.editModal = true;
        const item = this.items.find((product) => product._id == id);
        this.editCategoryItem = item;
      },
      prevPage() {
        if (this.currentPage > 1) {
          this.currentPage--;
        }
      },
      createCategory() {
        this.showModal = true;
      },
      openDeleteModal(id) {
        this.categoryId = id;
        this.deleteModal = true;
      },
      async handleDeleteConfirmation(item) {
        this.deleteModal = false;
        if (item) {
          await ipcRenderer
            .invoke(eventNames.deleteCategoryEvent, { id: this.categoryId })
            .then((res) => { res; })
            .catch((err) => {
              console.log(err);
            });
        }
      },
      async getCategory() {
        await ipcRenderer
          .invoke(eventNames.listCategoryEvent, {})
          .then((res) => {
            console.log(res);
  
            if (res.status == 200) {
              this.items = res?.args;
            }
          })
          .catch((err) => {
            console.log(err);
          });
      },
    },
    mounted() {
      document.addEventListener("click", this.handleClickOutside);
      this.getCategory();
      console.log(this.filteredArchiveItems('670e6b55101ba288f7e73ff5'));
      
    },
    beforeUnmount() {
      document.removeEventListener("click", this.handleClickOutside);
    },
  };
  </script>

<style>
.warehouse {
  width: 85%;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.warehouse-bottom {
  width: 100%;
  height: 100%;
  background: #fff;
  border-radius: 8px;
  overflow-y: auto;
  /* Allow scroll for the entire category list */
}

.bottom-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 24px;
}

.category {
  width: 100%;
  padding: 12px;
  background-color: #fff;
  box-shadow: 0px 0px 2px gray;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.warehouseButtonbox {
  display: flex;
  gap: 12px;
}

.all-debts {
  width: 20%;
  display: flex;
  justify-content: center;
  font-size: 20px;
  font-weight: 700;
}

.category-title {
  width: 60%;
  display: flex;
  gap: 24px;
  font-size: 18px;
  font-weight: 600;
}

.buttonbox {
  display: flex;
  gap: 12px;
}

.buttonbox > button {
  padding: 12px 36px;
  font-size: 14px;
  border-radius: 4px;
  color: #fff;
  cursor: pointer;
}

.context-item {
  padding: 12px;
  background: #3898ec;
  border-radius: 4px;
}

.context-item:last-child {
  background: red;
}

.context-item > div > svg > path {
  stroke: #fff;
}

.buttonbox > button:first-child {
  background: #3898ec;
}

.buttonbox > button:last-child {
  background: red;
}

.openArchive {
  cursor: pointer;
}

.archive-box {
  width: 100%;
  border-radius: 8px;
  margin-top: 12px;
  padding: 6px;
  transition: max-height 0.3s ease-in-out;
  overflow: hidden;
}

.archive-item {
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 1px solid #ccc;
}

.pagination {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}

.pagination button {
  padding: 8px 12px;
  border-radius: 4px;
  border: none;
  background-color: #3898ec;
  color: white;
  cursor: pointer;
}

.pagination button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.slide-fade-enter,
.slide-fade-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>
