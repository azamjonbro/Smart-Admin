<template>
  <div class="archive">
    <div class="archive-top">
      <h2>Архивные продукты</h2>
      <div class="d-flex a-center j-between gap12">
        <input class="archive-search" type="text" placeholder="Поиск архивного продукта" v-model="searchQuery" />
        <!-- <button class="unarchive-button" @click="unarchiveSelected">Unarchive Selected</button> -->
      </div>
    </div>
    <div class="archive-bottom">
      <table class="w-100 overflow">
        <thead>
          <tr>
            <th>Имя клиента</th>
            <th>Номер клиента</th>
            <th>Название продукта</th>
            <th>Цена продукта</th>
            <th>Цвет продукта</th>
            <!-- <th>Услуга</th> -->
            <th>Адрес клиента</th>
            <th>Статус</th>
            <th>Дата архивирования</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in paginatedProducts" :key="product._id">
            <td>{{ product.name }}</td>
            <td><a style="color: blue;" :href="`tel:${product.phone}`">{{ product.phone }}</a></td>
            <td>{{ product.type }}</td>
            <td>{{ product.price }}</td>
            <td>{{ product.color }}</td>
            <!-- <td>{{ product.workers }}</td> -->
            <td>{{ product.address }}</td>
            <td>Архивирования</td>
            <td>{{ formatDate(product.date2) }}</td>
            <td class="table__buttonbox d-flex gap12">
              <!-- <IconComponent name="unarchiveIcon" @click="unarchiveProduct(product._id)" /> -->
              <!-- <IconComponent name="rightArrowIcon" /> -->
            </td>
          </tr>
        </tbody>
      </table>
      <p v-if="paginatedProducts.length == 0" style="text-align: center; height:80%">Продукт не найден</p>
      <div class="pagination">
        <button :disabled="currentPage === 1" @click="currentPage--">Previous</button>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <button :disabled="currentPage === totalPages || totalPages == 0" @click="currentPage++">Next</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron';
// import IconComponent from '../components/IconComponent.vue';
import eventNames from '@/universal/eventNames';
import { sendErrorToTelegram } from '../utils';

export default {
  name: "ArchivePage",
  components: {
    // IconComponent
  },
  data() {
    return {
      searchQuery: "",
      currentPage: 1,
      itemsPerPage: 13,
      products: []
    };
  },
  computed: {
    filteredProducts() {
      return this.products.filter(product =>
        product.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
    paginatedProducts() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredProducts.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredProducts.length / this.itemsPerPage);
    }
  },
  methods: {
    formatDate(date) {
      const d = new Date(date);
      let day = d.getDate();
      let month = d.getMonth() + 1; // JavaScriptda oylar 0dan boshlanadi
      const year = d.getFullYear();

      // Kun va oyni ikki xonali qilib ko'rsatish uchun 0 qo'shish
      if (day < 10) {
        day = '0' + day;
      }
      if (month < 10) {
        month = '0' + month;
      }

      return `${day}-${month}-${year}`;
    },
    //   unarchiveProduct(id) {
    //     // logic to unarchive the product
    //   },
    //   deleteProduct(id) {
    //     // logic to delete the product permanently
    //   },
    //   unarchiveSelected() {
    //     // logic to unarchive selected products
    //   }
    async getArchive() {
  await ipcRenderer.invoke(eventNames.listArchivesEvent, {})
    .then((res) => {
      if (res.status == 200) {
        this.products = res.args;
      } else if (res.status === 400) {
        sendErrorToTelegram({
          name: "ArchiveGet: Bad Request",
          message: "400 hatolik. Ma'lumotlar noto'g'ri."
        });
      } else if (res.status === 401) {
        sendErrorToTelegram({
          name: "ArchiveGet: Unauthorized",
          message: "401 hatolik. Foydalanuvchi avtorizatsiyadan o'tmagan."
        });
      } else if (res.status === 403) {
        sendErrorToTelegram({
          name: "ArchiveGet: Forbidden",
          message: "403 hatolik. Kirish taqiqlangan."
        });
      } else if (res.status === 404) {
        sendErrorToTelegram({
          name: "ArchiveGet: Not Found",
          message: "404 hatolik. Arxiv topilmadi."
        });
      } else if (res.status >= 500) {
        sendErrorToTelegram({
          name: "ArchiveGet: Internal Server Error",
          message: "500+ hatolik. Server bilan bog'liq xato."
        });
      } else {
        sendErrorToTelegram({
          name: "ArchiveGet: Unexpected Error",
          message: `Noma'lum xato. Status kodi: ${res.status}`
        });
      }
    })
    .catch((err) => {
      sendErrorToTelegram({
        name: "GetArchive: Unhandled Rejection",
        message: `Xato: ${err.message}`
      });
    });
}

  },
  mounted() {
    this.getArchive()
  }
};
</script>

<style>
.archive {
  width: 85%;
  height: 100%;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.archive-top {
  width: 100%;
  padding: 24px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
}

.archive-search {
  width: 320px;
  height: 48px;
  border: 1px solid gray;
  border-radius: 8px;
  font-size: 14px;
  padding-left: 12px;
}

.archive-bottom {
  width: 100%;
  height: 100%;
  background: #fff;
  padding: 12px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

table {
  width: 100%;
  border-collapse: collapse;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
}

th {
  text-align: left;
  padding: 24px 16px;
  font-size: 14px;
  color: #333;
  font-weight: 600;
  border-bottom: 2px solid #ddd;
}

td {
  padding: 12px 16px;
  font-size: 14px;
  color: #555;
  border-bottom: 1px solid #eee;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 48px;
  margin-top: 16px;
}

.pagination>button {
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background-color: #aaa;
  cursor: not-allowed;
}
</style>
