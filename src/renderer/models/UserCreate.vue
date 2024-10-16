<template>
    <div v-if="showModal" class="modal-overlay">
        <div class="modal-content-user">
            <h3>{{ editWorker ? "Редактировать специалиста" : "Добавить специалиста" }}</h3>
            <form >
                <div class="form-group">
                    <button @click="setWorkerType('percent')" type="button"  :class="{ activeType: workerType === 'percent' }" class="userCreateType"> Специалист по процентам</button>
                  </div>
                  <div class="form-group">
                    <button @click="setWorkerType('monthly')" type="button" :class="{ activeType: workerType === 'monthly' }" class="userCreateType">Специалист с ежемесячной</button>
                  </div>
                <div class="form-group">
                    <label for="productName">Имя специалиста</label>
                    <input type="text" v-model="newCategory.name" placeholder="Введите имя специалиста"
                        id="productName" />
                    <span v-if="categoryNameError" class="error">Пожалуйста, введите имя специалиста</span>
                </div>

                <div class="form-group">
                    <label for="productPrice">{{workerType=='percent'?'Введите процент':'Введите ежемесячной'}}</label>
                    <input type="text" v-model="newCategory.foiz" placeholder="Введите процент" id="productPrice" />
                    <span v-if="priceError" class="error">Пожалуйста, введите процент</span>
                </div>

                <div class="modal-footer">
                    <button type="button" @click="closeModal" class="btn-cancel">
                        Отмена
                    </button>
                    <button type="button" @click="submitForm" class="btn-save">Сохранить</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import eventNames from '@/universal/eventNames';
import { ipcRenderer } from 'electron';
import { sendErrorToTelegram } from '../utils';

export default {
    props: {
        showModal: {
            type: Boolean,
            default: false,
        },
        editWorker: {
            type: Object,
            default: null,
        },
    },
    data() {
        return {
            newCategory: {
                name: "",
                foiz: "",
            },
            workerId: "",
            categoryNameError: false,
            priceError: false,
            workerType:'percent'
        };
    },
    watch: {
        editWorker: {
            immediate: true,
            handler(newVal) {
                console.log(newVal);
                
                if (newVal) {
                    this.newCategory.name = newVal?.name;
                    this.newCategory.foiz = newVal?.foiz;
                    this.workerId = newVal._id
                } else {
                    this.newCategory.name = "";
                    this.newCategory.foiz = "";
                }
            },
        },
    },
    methods: {
        setWorkerType(type) {
            this.workerType = type; 
        },
        closeModal() {
            this.$emit("close");
            this.resetModal()
        },
        resetModal() {
            this.newCategory.name = ""
            this.newCategory.foiz = ""
        },
        submitForm() {
            this.categoryNameError = !this.newCategory.name;
            this.priceError = !this.newCategory.foiz;
            if (!this.categoryNameError && !this.priceError) {
                if (this.editWorker) {
                    this.updateWorker()
                } else {
                    this.createWorker()
                }
                this.closeModal();
            }
        },
        async createWorker() {
            const newWorker = {
                name: this.newCategory.name,
                foiz: this.newCategory.foiz
            }
            await ipcRenderer.invoke(eventNames.createWorkerEvent, newWorker).then(res => {
                if (res.status == 201) {
                    this.$emit('status', { type: 'success', text: "Ishchi muvaffaqqiyatli qo'shildi" })
                }
                else if (res.status <= 400) {
                    this.$emit('status', { type: 'success', text: "Ishchi qo'shishda hatolik" })
                }
                if (res.status == 401) {
                    sendErrorToTelegram({ name: "UserCreate : firma not found", message: "Firmaidsi Topilmadi" })
                }
                if (res.status == 500) {
                    sendErrorToTelegram({ name: "User Create: Internal server error", message: "Code hatolik" })
                }
            }).catch((error) => {
                sendErrorToTelegram({ name: "UserCreate: Internal server error", message: error.message })

            })
        },
        async updateWorker() {
            const newWorker = {
                id: this.workerId,
                name: this.newCategory.name,
                foiz: this.newCategory.foiz
            }
            await ipcRenderer.invoke(eventNames.updateWorkerEvent, newWorker).then(res => {
                if (res.status == 201) {
                    this.$emit('status', { type: 'success', text: "Ishchi muvaffaqqiyatli o'zgartirldi" })
                }
                else if (res.status <= 400) {
                    this.$emit('status', { type: 'success', text: "Ishchi o'zgartirishda hatolik" })
                }
            }).catch((error) => {
                sendErrorToTelegram({name:"UpdateWorker: Internal server error",message:error.message })
            })
        }
    },
};
</script>
<style>
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

.modal-content-user {
    width: 60%;
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
}

form {
    margin-top: 24px;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 12px;
}

.form-group {
    width: 48%;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

form>div>input {
    border: 1px solid #ccc;
    padding: 12px;
    border-radius: 4px;
}

.modal-footer {
    width: 100%;
    display: flex;
    justify-content: center;
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

input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

.drop-file {
    width: 100%;
    height: 200px;
}

.custom-file-upload {
    display: inline-block;
    width: 100%;
    height: 100%;
    cursor: pointer;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: #fff;
    color: #333;
    display: flex;
    align-items: center;
    justify-content: center;
}

.image-previews {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}

.error {
    color: red;
    font-size: 12px;
}
.userCreateType{
    padding: 12px;
    border:1px solid lightgray;
    border-radius:4px;
    font-size: 14px;
    cursor: pointer;
}
.activeType{
    background: #007bff;
    color: #fff;
}
</style>
