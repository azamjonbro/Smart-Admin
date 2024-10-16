<template>
    <div v-if="showModal" class="modal-overlay" @click="handleOverlayClick">
      <div class="modal-content-box" @click.stop>
        <h3>{{title}}</h3>
        <div class="modal-buttons">
            <button class="modal-error" @click="confirmAction(false)">Cancel</button>
            <button class="modal-button" @click="confirmAction(true)">OK</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      showModal: {
       type: Boolean,
       default:false
    },
    title:{
        type:String,
    }
    },
    methods: {
      handleOverlayClick() {
        this.$emit('close');
      },
      confirmAction(action) {
        this.$emit('confirm', action);
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
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  .modal-content-box {
    background: white;
    padding: 20px;
    border-radius: 8px;
    text-align: center;
    width: 600px;
  }
  .modal-buttons {
    margin-top: 20px;
  }
  .modal-error,
  .modal-button {
    padding: 10px 20px;
    margin: 5px;
    border-radius: 5px;
    color: white;
    cursor: pointer;
  }
  .modal-button{
    background-color: #007bff;
  }
  .modal-error{
    background: red;
  }
  .modal-error:hover{
    background: rgb(177, 4, 4);
  }
  .modal-button:hover {
    background-color: #0056b3;
  }
  </style>
  