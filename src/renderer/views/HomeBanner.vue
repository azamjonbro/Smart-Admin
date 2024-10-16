<template>
  <div class="homeBanner">
    <div class="top">
      <div class="box">
        <div class="iconbox"><IconComponent name="allPriceIcon" /></div>
        <div class="titlebox">
          <h2 class="box-order">Общая выгода</h2>
          <p class="pricebox">{{formatSumma(allCalculate.year?.plus)}}</p>
        </div>
      </div>
      <div class="box">
        <div class="iconbox"><IconComponent name="allIncrIcon" /></div>
        <div class="titlebox">
          <h2 class="box-order">Общие расходы</h2>
          <p class="pricebox">{{formatSumma(allCalculate.year?.minus)}}</p>
        </div>
      </div>
      <div class="box">
        <div class="iconbox"><IconComponent name="birOylikIcon" /></div>
        <div class="titlebox">
          <h2 class="box-order">Ежемесячный доход</h2>
          <p class="pricebox">{{formatSumma(allCalculate.month?.plus)}}</p>
        </div>
      </div>
      <div class="box">
        <div class="iconbox"><IconComponent name="birOylikMinusIcon" /></div>
        <div class="titlebox">
          <h2 class="box-order">Ежемесячные расходы</h2>
          <p class="pricebox">{{formatSumma(allCalculate.month?.minus)}}</p>
        </div>
      </div>
    </div>
    <div class="top">
      <div class="box">
        <div class="iconbox"><IconComponent name="birKunlikIcon" /></div>
        <div class="titlebox">
          <h2 class="box-order">Ежедневный доход</h2>
          <p class="pricebox">{{formatSumma(allCalculate.today?.plus)}}</p>
        </div>
      </div>
      <div class="box">
        <div class="iconbox"><IconComponent name="birKunlikMinusIcon" /></div>
        <div class="titlebox">
          <h2 class="box-order">Ежедневный расходы</h2>
          <p class="pricebox">{{formatSumma(allCalculate.today?.minus)}}</p>
        </div>
      </div>
      <div class="box">
        <div class="iconbox"><IconComponent name="allProductIcon" /></div>
        <div class="titlebox">
          <h2 class="box-order">Текущий счет</h2>
          <p class="pricebox">{{formatSumma(allCalculate?.qoldiq)}}</p>
        </div>
      </div>
      <div class="box">
        <div class="iconbox"><IconComponent name="pendingIcon" /></div>
        <div class="titlebox">
          <h2 class="box-order">Ожидаемый доход</h2>
          <p class="pricebox">{{formatSumma(allCalculate?.year?.pending)}}</p>
        </div>
      </div>
    </div>
    <!-- <div class="top">
      <div class="box">
        <div class="iconbox"><IconComponent name="onlyCard" /></div>
        <div class="titlebox">
          <h2 class="box-order">С картой</h2>
          <p class="pricebox">1200$</p>
        </div>
      </div>
      <div class="box">
        <div class="iconbox"><IconComponent name="perechisleniya" /></div>
        <div class="titlebox">
          <h2 class="box-order">С перечисления</h2>
          <p class="pricebox">1200$</p>
        </div>
      </div>
      <div class="box">
        <div class="iconbox"><IconComponent name="terminal" /></div>
        <div class="titlebox">
          <h2 class="box-order">Терминаль</h2>
          <p class="pricebox">1200$</p>
        </div>
      </div>
      <div class="box">
        <div class="iconbox"><IconComponent name="naqtPullar" /></div>
        <div class="titlebox">
          <h2 class="box-order">Наличные</h2>
          <p class="pricebox">1200$</p>
        </div>
      </div>
    </div> -->
    <div class="bottom">
      <div class="bottom-left">
        <div class="d-flex j-between">
          <h3>Список дел на день:</h3>
          <input type="date" class="datepicker">
        </div>
        <ul class="daily-tasks">
          <li v-if="dailyTasks.length === 0">Нет данных</li>
          <li v-for="(task, index) in dailyTasks" :key="index">{{ task }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from "electron";
import IconComponent from "../components/IconComponent.vue";
import eventNames from "@/universal/eventNames";
// import { sendErrorToTelegram } from "../utils";
export default {
  data() {
    return {
      allCalculate:'',
      dailyTasks: [
        // "Ish 1 - Yangi buyurtma qabul qilindi",
        // "Ish 2 - Mahsulotlar omborga joylandi",
        // "Ish 3 - Buyurtma jo'natildi",
        "Ish 4 - Mahsulotlar ko'rib chiqildi",
      ],
    };
  },
  components: {
    IconComponent,
  },
  methods:{
    async getHome(){
      await ipcRenderer.invoke(eventNames.homeEvent,{})
      .then((res)=>{
        if(res.status==200){
          this.allCalculate=res?.args
        }
      })
      .catch((err)=>{
        console.log(err);
      })
    },
    formatSumma(summa) {
      return new Intl.NumberFormat('ru-RU').format(summa);
    },
  },
  mounted(){
    this.getHome()
  }

};
</script>

<style>
.homeBanner {
  width: 85%;
  height: auto;
  display: flex;
  flex-direction: column;
  padding: 24px;
}

.top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  background: #fff;
  padding: 12px;
  border-radius: 8px;
  column-gap: 24px;
  row-gap: 46px;
}

.box {
  width: 22%;
  padding: 16px;
  height: 80px;
  margin: 0 10px;
  border-radius: 8px;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 24px;
}

.iconbox > div > svg {
  width: 36px;
  height: 36px;
}
.titlebox {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: start;
}

.box-order {
  font-size: 16px;
  color: gray;
}
.pricebox {
  font-size: 24px;
  font-weight: 700;
}

.bottom {
  margin-top: 20px;
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  gap: 12px;
  height: 100%;
}
.bottom-left{
  width: 100%;
  display: flex;
  flex-direction: column;
  gap:12px;
}

.daily-tasks {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.daily-tasks li {
  padding: 10px;
  background-color: #ececec;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.datepicker{
  width: 220px;
  height: 36px;
  border-radius: 4px;
  padding: 12px;
  border:1px solid lightgray;
  
}
</style>
