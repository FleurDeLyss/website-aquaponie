<template>
  <div class="page">
    <ManagamentNav/>
    <div class="view">
    <h1>Changer la description de l'accueil</h1>
    <form @submit.prevent="submit">
      <textarea v-model="text" rows="9"></textarea>
      <button :disabled="text==unchanged || loading">Appliquer</button>
    </form>
    </div>
  </div>
</template>

<script>
import ManagamentNav from "@/components/ManagamentNav.vue";
export default {
  components: {
    ManagamentNav
  },
  data: function() {
    return {
      text: "",
      unchanged: "",
      loading: true
    };
  },
  created() {
    this.$http.get(this.$apiUrl + `/texts/accueil`).then(res => {
      this.text = res.data.text;
      this.unchanged = res.data.text;
      this.loading = false;
    });
  },
  methods: {
    submit(){
      this.loading = true;
      this.$http.put(this.$apiUrl + `/texts/accueil`,{text:this.text}).then(() => {
        this.loading = false;
        this.unchanged = this.text;
    });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/theme.scss";
#app>.page{
  display:flex;
  flex-direction: row;
  padding: 0;
  align-items:flex-start;
}
.view {
  background-color: lighten($dark, 10);
  border-radius: 10px;
  padding: 15px 15px;
  flex-grow:1;
}
form {
  & > textarea,
  & > button {
    grid-column: 1 / 3;
  }
}
</style>