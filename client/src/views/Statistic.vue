<template>
  <div class="view">
    <div class="side">
      <h1>Visualisation</h1>
      <form name="visualisation" @submit.prevent="submit">
        <label for="donnes">Données</label>
        <select v-model="selected[0]">
          <option
            v-for="datatype in datatypes"
            :key="datatype.key"
            :value="datatype"
          >{{datatype.name}}</option>
        </select>
        <select v-model="selected[1]">
          <option
            v-for="datatype in datatypes"
            :key="datatype.key"
            :value="datatype"
          >{{datatype.name}}</option>
        </select>
        <button>Afficher</button>
        <!--
        <table>
          <caption class="title">Visualisation</caption>
          <tr>
            <td>Donné à voir:</td>
            <td>
              <select name="donnes" v-show="datatypes.length > 0" v-model="selected">
                <option v-for="datatype in datatypes" :key="datatype.key">{{datatype.name}}</option>
              </select>
            </td>
          </tr>
          <tr>
            <td>Date début:</td>
            <td>
              <input type="date" name="DateStart" v-model="dateStart" />
            </td>
          </tr>
          <tr>
            <td>Date fin:</td>
            <td>
              <input type="date" name="DateEnd" v-model="dateEnd" />
            </td>
          </tr>
        </table>
        <button>Soumettre</button>
        -->
      </form>
    </div>
    <div class="main">
      <!-- <template v-if="picked == 'graph'"> -->
      <chart
        v-if="series[0] && series[0].points.length > 0 || series[1] && series[1].points.length > 0"
        :series="series"
      />
      <!-- <template v-if="picked == 'table'">
        <template v-if="checkedOptions.length == 1"></template>
        <template v-if="checkedOptions.length == 2"></template>
      </template>-->
    </div>
  </div>
</template>

<script>
import chart from "../components/ChartTemplate";
export default {
  components: {
    chart
  },
  data() {
    return {
      selected: [null, null],
      dateStart: "",
      dateEnd: "",
      checkedOptions: [],
      donnesA: [],
      datatypes: [],
      aquariumData: [],
      series: { a: null, b: null }
    };
  },
  created() {
    this.$http.get(this.$apiUrl + `/datatypes`).then(res => {
      this.datatypes = res.data;
    });
    this.$http.get(this.$apiUrl + `/aquariums/1/data?sort=desc`).then(res => {
      this.aquariumData = res.data;
      console.log(this.aquariumData);
    });
  },
  methods: {
    submit() {
      let series = [null, null];
      for (let key in this.selected) {
        if (this.selected[key]) {
          series[key] = {
            label: this.selected[key].name,
            points: []
          };
        }
      }

      for (let dot of this.aquariumData) {
        for (let key in this.selected) {
          if (this.selected[key] && dot.data[this.selected[key].key]) {
            series[key].points.push({
              t: new Date(dot.end),
              y: dot.data[this.selected[key].key]
            });
          }
        }
      }
      this.series = series;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/theme.scss";
#app > .view {
  display: flex;
  flex-direction: row;
  padding: 0;
}
.side {
  flex: 2;
  background-color: lighten($dark, 10);
  padding: 10px;
  border-radius: 10px;
  text-align: center;

  table {
    width: 100%;
    td {
      padding: 10px 10px;
    }
  }
  select {
    color: $light;
    background-color: $dark;
    border: none;
  }
  input {
    color: $light;
    background-color: $dark;
    border: none;
  }
}
.title {
  font-size: 20px;
}
.main {
  flex: 5;
  background-color: lighten($dark, 10);
  margin-left: 15px;
  border-radius: 10px;
}
</style>