<template>
  <div class="home">
    <div class="main">
      <h1>Aquaponie</h1>
      <p v-for="(text,index) in texts" :key="index">{{text}}</p>
    </div>
    <div class="side">
        <table>
          <caption class="title">Données des capteurs</caption>
          <br />
          <tr>
            <td>Volume Aquarium</td>
            <td>{{lastData['volume-aquarium']}}</td>
            <!-- <td>{{datatype.data.volume-aquarium + "L"}}</td> -->
          </tr>
          <tr>
            <td>ph</td>
            <td>{{lastData['ph']}}</td>
            <!-- <td>{{datatype.data.ph}}</td> -->
          </tr>
          <tr>
            <td>Temperature de l'eau</td>
            <td>{{lastData['temperature-eau']}}</td>
            <!-- <td>{{datatype.data.temperature-eau + "°C"}} °C</td> -->
          </tr>
          <tr>
            <td>photoperiode</td>
            <td>{{lastData['photoperiode']}}</td>
            <!-- <td>{{datatype.data.photoperiode + "heure(s)"}}</td> -->
          </tr>
          <tr v-if="time">
            <td>Date</td>
            <td>
              {{new Date(time).toLocaleDateString("fr-CA", {
              year: "numeric",
              month: "short",
              day: "numeric"
              })}}
            </td>
          </tr>
          <tr v-if="time">
            <td>Jour</td>
            <td>
              {{new Date(time).toLocaleTimeString("fr-CA", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false
              })}}
            </td>
          </tr>
        </table>
        <router-link to="/statistique">Voir toutes les données</router-link>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      lastData: {},
      time: null,
      texts: []
    };
  },
  created() {
    this.$http
      .get(this.$apiUrl + `/aquariums/1/data?sort=desc&limit=1`)
      .then(res => {
        this.lastData = res.data[0].data;
        this.time = res.data[0].end;
        console.log(this.lastData);
      });
    this.$http.get(this.$apiUrl + `/texts/accueil`).then(res => {
      this.texts = res.data.text.split("\n");
    });
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
@import "@/theme.scss";
#app > .home {
  display: flex;
  flex-direction: row;
  padding: 0;
}
.main {
  flex: 3;
  background-color: lighten($dark, 10);
  padding: 20px;
  text-align: justify;
  border-radius: 10px;
}
.side {
  flex: 1;
  margin-left: 15px;
  border-radius: 10px;
  padding: 10px;
  background-color: lighten($dark, 10);
  table {
    width: 100%;
  }
  td {
    padding-bottom: 10px;
    text-align: left;
  }
  a {
    padding: 15px;
    color: white;
    display: block;
  }
  text-align: center;
}
.title {
  font-size: 20px;
}
.news {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 30px;
  border-radius: 10px;
  padding: 10px;
  background-color: lighten($dark, 10);
  text-align: center;
  div {
    display: flex;
    align-items: left;
    div {
      background-color: $primary;
      text-decoration: none;
      width: 100px;
      height: 75px;
      padding: 20px;
      margin: 10px;
    }
  }
}
</style>