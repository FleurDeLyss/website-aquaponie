<template>
  <div class="popup">
    <div class="background" @click="close"></div>
    <div class="box"><slot></slot></div>
  </div>
</template>

<script>
export default {
  name: "PopUp",
  methods:{
    close(){
      this.$emit("close");
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/theme.scss";
.popup {
  //background-color: #000000b6;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  .box {
    background-color: $dark;
    max-width: 100vw;
    width:600px;
    padding: 15px;
    z-index: 1010;
    box-shadow: #00000077 0 3px 7px;
    border-radius: 5px;
  }
  .background{
    background-color: #00000081;
    width:100%;
    height:100%;
    position: absolute;
    z-index: 1005;
  }
}
</style>