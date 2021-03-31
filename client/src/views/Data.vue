<template>
  <div class="home">
    <h1>Données</h1>
    <form @submit.prevent="submit">
      <label for="start">Début</label>
      <datetime input-id="start" type="datetime" v-model="start"></datetime>
      <label for="end">Fin</label>
      <datetime input-id="end" type="datetime" v-model="end"></datetime>
      <button :disabled="loading || !start || !end">Ajouter</button>
    </form>
    <table>
      <tr>
        <th>Début</th>
        <th>Fin</th>
        <th>Modifié</th>
        <th>Modifier</th>
      </tr>
      <tr v-for="entry in aquariumData" :key="entry.id">
        <td>{{$moment(entry.start).format('lll')}}</td>
        <td>{{$moment(entry.end).format('lll')}}</td>
        <td>{{$moment(entry.modified).format('lll')}}</td>
        <td class="ok">
          <router-link :to="'/donnees/'+entry.id" class="link-button">Modifier</router-link>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      start: "",
      end: "",
      aquariumData: [],
      loading: false
    };
  },
  methods: {
    submit() {
      this.loading = true;
      let form = {
        start: this.start,
        end: this.end,
        data: {}
      };
      this.$http.post(this.$apiUrl + `/aquariums/1/data`, form).then(res => {
        this.loading = false;
        this.$router.push("/donnees/" + res.data.id);
      });
    }
  },
  created() {
    this.$http.get(this.$apiUrl + `/aquariums/1/data?sort=desc`).then(res => {
      this.aquariumData = res.data;
    });
  }
};
</script>

<style lang="scss" scoped>
@import "@/theme.scss";
#app > .home {
  background-color: lighten($dark, 10);
  border-radius: 10px;
  padding: 15px 15px;
}
table {
  width: 100%;
  max-height: 100px;
}
.ok {
  width: 60px;
  button {
    width: 100%;
  }
}
form {
  max-width: 500px;
  margin: 0 auto;
  margin-bottom: 15px;
}
</style>