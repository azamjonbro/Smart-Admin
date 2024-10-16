    <template>
        <div class="products">
            <div class="product-top">
                <h2>Возвращенный товар</h2>
                <div class="d-flex a-center j-between gap12">
                    <button class="create-button" @click="showModal = true">
                        Добавить возврат
                    </button>
                </div>
            </div>

            <div class="product-bottom">
                <table class="w-100 overflow">
                    <thead>
                        <tr>
                            <th>Имя клиента</th>
                            <th>Название продукта</th>
                            <th>Цена продукта</th>  
                            <th>Специалисты</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(returnItem, index) in returnItems" :key="index">
                            <td>{{ returnItem.client_name }}</td>
                            <td>{{ returnItem.product_name }}</td>
                            <td>-{{ returnItem.price }}</td>
                            <td><span v-for="worker in returnItem.workers" :key="worker._id">{{worker.name}}, </span></td>
                        </tr>
                    </tbody>
                </table>
                <div class="pagination">
                    <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
                    <span>Page {{ currentPage }} of {{ totalPages }}</span>
                    <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
                </div>
            </div>
            <ReturnedModal :showModal="showModal" @close="closeModal"/>
        </div>
    </template>

<script>
import { ipcRenderer } from 'electron';
import ReturnedModal from '../models/ReturnedModal.vue'
import eventNames from '@/universal/eventNames';

export default {
    components: {
        ReturnedModal
    },
    data() {
        return {
            showModal: false,
            returnItems: []*2,
            currentPage: 1,
            itemsPerPage: 20,
        };
    },
    computed: {
        totalPages() {
            return Math.ceil(this.returnItems.length / this.itemsPerPage);
        },
    },
    methods: {
        closeModal(){
            this.showModal=false
        },
        prevPage() {
            if (this.currentPage > 1) { 
                this.currentPage--;
            }
        },
        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
            }
        },
        async getReturn(){
            await ipcRenderer.invoke(eventNames.listInvalidEvent,{})
            .then((res)=>{
                console.log(res);
                if(res.status==200){
                    this.returnItems=res.args
                    
                }
            })
            .catch((err)=>console.log(err))
        }
    },
    mounted(){
        this.getReturn()
    }
};
</script>

<style scoped>
.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-content {
    background: white;
    padding: 20px;
    border-radius: 8px;
    width: 400px;
}

.modal-buttons {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
}

.pagination {
    display: flex;
    justify-content: end;
    padding: 10px 0;
}

table {
    border-collapse: collapse;
    width: 100%;
}

th,
td {
    padding: 8px;
    text-align: left;
    border-bottom: 1px solid #ddd;
}

.table__buttonbox {
    cursor: pointer;
}
</style>
