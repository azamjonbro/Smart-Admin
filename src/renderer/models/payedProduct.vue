<template>
    <div class="worker_monthlymodal modal-overlay" v-if="openModal">
        <div class="modal-content" >
          <h3>{{title}}</h3>
          <form >
            <div class="modal-box">
              <label for="price">{{label}}</label>
              <input type="number" v-model="priceInput" placeholder="Введите сумму" step="any" min="1">
            </div>
            <div class="modal-footer">
              <button type="button" @click="closeModal" class="btn-cancel">
                  Отмена
              </button>
              <button type="button"  @click="updateworkerSumma" class="btn-save">Сохранить</button>
          </div>
          </form>
        </div>
      </div>
</template>

<script>
export default {
    props:{
        openModal:{
            type:Boolean,
            default:false,
        },
        title:{
            type:String,
            default:''
        },
        label:{
            type:String,
            default:'Введите сумму'
        }
    },
    data(){
        return{
            priceInput:'',
        }
    },
    methods:{
        closeModal(){
            this.$emit('close')
        },
        updateworkerSumma(){
            this.$emit("success",this.priceInput)
            this.closeModal()
            this.priceInput=''
        }

    }
}
</script>


