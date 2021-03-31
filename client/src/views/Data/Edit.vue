<template>
  <div class="home">
    <h1>Données</h1>
    <router-link :to="'/donnees'" class="link-button">Retour</router-link>
    <form @submit.prevent="submit" v-show="datatypes.length > 0">
      <label for="start">Début</label>
      <datetime input-id="start" type="datetime" v-model="start"></datetime>
      <label for="end">Fin</label>
      <datetime input-id="end" type="datetime" v-model="end"></datetime>
      <hr />
      <template v-for="datatype in datatypes">
        <label :for="'f_'+datatype.key" :key="'label_'+datatype.key">{{datatype.name}}</label>
        <input
          :id="'f_'+datatype.key"
          inputmode="numeric"
          type="text"
          :key="'input_'+datatype.key"
          v-model="entry[datatype.key]"
          v-if="datatype.numeric"
        />
        <textarea
          :id="'f_'+datatype.key"
          :key="'input_'+datatype.key"
          v-model="entry[datatype.key]"
          v-else
        ></textarea>
      </template>
      <button :disabled="loading">Sauvegarder</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      start: null,
      end: null,
      entry: {},
      datatypes: [],
      loading: false
    };
  },
  created() {
    this.$http.get(this.$apiUrl + `/datatypes`).then(res => {
      res.data.forEach(datatype => {
        if (!this.entry[datatype.key]) {
          this.entry[datatype.key] = "";
        }
      });
      this.datatypes = res.data;
      console.log(this.entry);
    });
    this.$http
      .get(this.$apiUrl + `/aquariums/1/data/` + this.$route.params.id)
      .then(res => {
        this.start = res.data.start;
        this.end = res.data.end;
        for (let key in res.data.data) {
          this.entry[key] = "" + res.data.data[key];
        }
        console.log(this.entry);
      });
  },
  methods: {
    submit() {
      this.loading = true;
      let form = {
        start: this.start,
        end: this.end,
        data: {}
      };
      for (let key in this.entry) {
        if (this.entry[key]) {
          if (this.datatypes.find(e => e.key == key).numeric) {
            form.data[key] = Number(this.entry[key].replace(",", "."));
          } else {
            form.data[key] = this.entry[key];
          }
        }
      }
      this.$http
        .put(this.$apiUrl + `/aquariums/1/data/` + this.$route.params.id, form)
        .then(() => {
          this.loading = false;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/theme.scss";
#app > .home {
  max-width: 700px;
  background-color: lighten($dark, 10);
  border-radius: 10px;
  padding: 15px 15px;
}
</style>