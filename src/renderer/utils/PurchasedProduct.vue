<template>
    <div v-if="showModal" class="modal-overlay">
        <div class="modal-contentt">
            <h3>Добавить купленные товары в категорию</h3>
            <form @submit.prevent="submitForm">
                <div class="form-group">
                    <label for="productPrice">Цена продукта</label>
                    <input type="number" v-model="newCategory.price" placeholder="Введите цену продукта"
                        id="productPrice" />
                    <span v-if="priceError" class="error">Пожалуйста, введите цену продукта</span>
                </div>
                <div class="form-group">
                    <label for="productName">Comment</label>
                    <input type="text" v-model="newCategory.category_name" placeholder="Введите название продукта"
                        id="productName" />
                    <span v-if="categoryNameError" class="error">Пожалуйста, введите название продукта</span>
                </div>

                <div class="form-group drop-file">
                    <label for="productImages">Изображения продукта</label>
                    <label for="customFileInput" class="custom-file-upload">
                        Выберите файлы
                    </label>
                    <input type="file" @change="handleImageUpload" accept="image/*" multiple id="customFileInput"
                        style="display: none" />
                    <span v-if="imageError" class="error">Пожалуйста, загрузите изображение продукта</span>
                </div>

                <div v-if="newCategory.images.length" class="image-previews">
                    <div v-for="(image, index) in imagePreviews" :key="index" class="image-preview">
                        <img :src="image" alt="Предпросмотр изображения" style="width: 150px; height:150px;" />
                    </div>
                </div>

                <!-- Modal Footer -->
                <div class="modal-footer">
                    <button type="button" @click="closeModal" class="btn-cancel">
                        Отмена
                    </button>
                    <button type="submit" class="btn-save">Сохранить</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
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
                comment: "",
                price: "",
                images: [],
            },
            imagePreviews: [],
            categoryNameError: false,
            priceError: false,
            imageError: false,
        };
    },
    methods: {
        closeModal() {
            this.imagePreviews=[]
            this.$emit("close");
        },
        handleImageUpload(event) {
            const files = event.target.files;
            if (files.length) {
                const newFiles = Array.from(files);
                this.newCategory.images = [...this.newCategory.images, ...newFiles];
                this.imageError = false;

                newFiles.forEach(file => {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        this.imagePreviews.push(e.target.result);
                    };
                    reader.readAsDataURL(file);
                });
            } else {
                this.imageError = true;
            }
        },

        submitForm() {
            this.categoryNameError = !this.newCategory.category_name;
            this.priceError = !this.newCategory.price;
            this.imageError = !this.newCategory.images.length;

            if (!this.categoryNameError && !this.priceError && !this.imageError) {
                console.log("Product created:", this.newCategory);
                this.addProduct();
            }
        },
        addProduct() {
            this.imagePreviews=[]
            this.$emit("save", this.newCategory);
            this.closeModal();
        },
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

.modal-contentt {
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
</style>
