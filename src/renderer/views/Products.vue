<template>
  <div class="products">
    <div class="product-top">
      <h2>Продукты</h2>
      <div class="d-flex a-center j-between gap12">
        <select class="product-search" v-model="selectedFilter">
          <option value="day">День</option>
          <option value="price">Цена</option>
        </select>        
        <input class="product-search" type="text" placeholder="Поиск продуктов" v-model="searchQuery" />
        <button class="create-button" @click="showModal = true">Создать продукт</button>
      </div>
    </div>
    <div class="product-bottom">
      <table class="w-100 overflow">
        <thead>
          <tr>
            <th>Имя клиента</th>
            <th>Номер клиента</th>
            <th>Название продукта</th>
            <th>Цена продукта</th>
            <th>Цвет продукта</th>
            <!-- <th>Подготовитель</th> -->
            <th>Адрес клиента</th>
            <th>Статус</th>
            <th></th>
          </tr>
        </thead>
        <tbody v-if="paginatedProducts.length > 0">
          <tr v-for="product in paginatedProducts" :key="product._id">
            <td>{{ product.name }}</td>
            <td><a style="color: blue ;" :href="`tel:${product.phone}`">{{ product.phone }}</a></td>
            <td>{{ product.type }}</td>
            <td>{{ formatSumma(product.price )}}</td>
            <td>{{ product.color }}</td>
            <!-- <td><p v-for="worker in product.workers" :key="worker.id">{{ worker }}</p></td> -->
            <td>{{ product.address }}</td>
            <td>{{ product.status }}</td>
            <td class="table__buttonbox d-flex gap12">
              <IconComponent name="editIcon" @click="editProduct(product._id)" />
              <IconComponent name="deleteIcon" @click="deleteProduct(product._id)" />
            </td>
          </tr>
        </tbody>
      </table>
      <p v-if="paginatedProducts.length == 0" style="text-align: center; height:80%">Продукт не найден</p>
      <div class="pagination">
        <button :disabled="currentPage === 1" @click="currentPage--">Previous</button>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <button :disabled="currentPage === totalPages || totalPages === 0" @click="currentPage++">Next</button>
      </div>
    </div>
      <requiredModal :showModal="deleteModal" @close="deleteModal = false" :title="'Вы хотите удалить этот продукт?'"
        @confirm="handleDeleteConfirmation" />
      <ProductCreate  :editProduct="editProductItem" @status="handleStatus($event,obj)" :showModal="showModal" @close="closeModal($event)" />
      <ToastComponent :toastOptions="toastOptions"/>
    </div>
</template>
<script>
import ProductCreate from '../models/ProductCreate.vue';
import IconComponent from '../components/IconComponent.vue';
import requiredModal from '../models/requiredModal.vue';
import { ipcRenderer } from 'electron';
import eventNames from '@/universal/eventNames';
import ToastComponent from "../components/Toastiff.vue";
export default {
  name: "ProductPage",
  components: {
    ProductCreate,
    IconComponent,
    requiredModal,
    ToastComponent
    
  },
  data() {
    return {
      searchQuery: "",
      showModal: false,
      currentPage: 1,
      itemsPerPage: 13,
      deleteModal: false,
      products: [],
      editProductItem: null,
      deletesuccess: null,
      selectedFilter: 'day',
      toastOptions: {
        open: false,
        text: "",
        style:{background: "#4CAF50"}
      },
    };
  },
  computed: {
    filteredProducts() {
      let filtered = this.products; 
      if (this.searchQuery) {
        filtered = filtered.filter(product =>
          product?.name?.toLowerCase()?.includes(this.searchQuery.toLowerCase())
        );
      }
      if (this.selectedFilter === 'day') {
        filtered = filtered.sort((a, b) => {
          const dateA = new Date(a.date2);
          const dateB = new Date(b.date2);
          return dateA - dateB;
        });
      } else if (this.selectedFilter === 'price') {
        filtered = filtered.sort((a, b) =>a.price - b.price);
      }

      return filtered;
    },
    paginatedProducts() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredProducts.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredProducts.length / this.itemsPerPage);
    },
  },
  methods: {
    formatSumma(summa) {
      return new Intl.NumberFormat('ru-RU').format(summa);
    },
    handleStatus(event){
      console.log(event);
      
      if(event.type=='success'){
        this.toastOptions = {
              open: true,
              text: event?.text,
              style: { background: "#4CAF50" },
            };
      }
      else{
        this.toastOptions = {
              open: true,
              text: event?.text,
              style: { background: "#FF0000" },
            };
      }
      
    },
    closeModal(){
      this.getProducts()
      this.showModal=false
    },
    editProduct(id) {
      const product = this.products.find(product => product._id === id);
      console.log(product);

      if (product) {
        this.editProductItem = product;
      }
      this.showModal = true;
    },
    deleteProduct(id) {
      this.deleteModal = true;
      this.deletesuccess = id
    },

    async handleDeleteConfirmation(e) {
      if (e === true) {
        try {
          const res = await ipcRenderer.invoke(eventNames.deleteProductEvent, {
            id: this.deletesuccess 
          });

          if (res.status === 201) {
            this.getProducts();
            this.toastOptions = {
              open: true,
              text: "Mahsulot muvaffaqqiyatli o'chirldi ! ",
              style: { background: "#4CAF50" },
            };
          }
        } catch (err) {
          console.log(err); 
        }
      }
    },

    getProducts() {
      ipcRenderer.invoke(eventNames.listProductEvent, {}).then(res => {
        console.log(res);
        if (res.status == 200) {
          this.products = res?.args.reverse()
        }
        else if (res.status <= 400 && res.status >= 499) {
          console.log('page not found');
        }
        else {
          console.log('Internal server error');

        }

      })
    }
  },
  mounted() {
    this.getProducts()
  }
};
</script>
<style>
.products {
  width: 85%;
  height: 100% !important;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.product-top {
  width: 100%;
  padding: 24px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
}

.product-search {
  width: 320px;
  height: 48px;
  border: 1px solid gray;
  border-radius: 8px;
  font-size: 14px;
  padding: 12px;
}
.product-bottom{
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between
}
</style>
