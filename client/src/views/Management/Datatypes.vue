<template>
  <div class="page">
    <ManagamentNav />
    <div class="view">
      <h1>Variables</h1>
      <button class="add" @click="addDatatype=true">Ajouter</button>
      <table>
        <tr>
          <th>Clé</th>
          <th>Nom</th>
          <th class="center">Numérique</th>
          <th class="center">Unité</th>
        </tr>
        <tr v-for="datatype in datatypes" :key="datatype.key">
          <td>{{datatype.key}}</td>
          <td>{{datatype.name}}</td>
          <td class="center">
            <i v-if="datatype.numeric" class="ri-check-line"></i>
          </td>
          <td class="center">{{datatype.units}}</td>
        </tr>
      </table>
    </div>
    <PopUp v-if="addDatatype" @close="addDatatype=false">
      <h3>Ajouter une variable</h3>
      <form @submit.prevent="add">
        <label for="name">Nom</label>
        <input type="text" id="name" v-model="newDatatype.name" />
        <label for="key">Clé</label>
        <input type="text" id="key" v-model="newDatatype.key" />
        <label for="numeric">Numérique</label>
        <input type="checkbox" id="numeric" v-model="newDatatype.numeric" />
        <label for="unit">Unité</label>
        <input type="text" id="unit" v-model="newDatatype.units" :disabled="!newDatatype.numeric" />
        <button>Ajouter</button>
      </form>
    </PopUp>
  </div>
</template>

<script>
import ManagamentNav from "@/components/ManagamentNav.vue";
import PopUp from "@/components/PopUp.vue";
export default {
  components: {
    ManagamentNav,
    PopUp,
  },
  data: function () {
    return {
      datatypes: [],
      addDatatype: false,
      newDatatype: {},
    };
  },
  methods: {
    add() {
      this.$http.post(this.$apiUrl + `/datatypes`, this.newDatatype).then((res) => {
        console.log(res.data);
      });
    },
  },
  created() {
    this.$http.get(this.$apiUrl + `/datatypes`).then((res) => {
      this.datatypes = res.data;
    });
  },
};
</script>

<style lang="scss" scoped>
@import "@/theme.scss";
#app > .page {
  display: flex;
  flex-direction: row;
  padding: 0;
  align-items: flex-start;
}
.view {
  background-color: lighten($dark, 10);
  border-radius: 10px;
  padding: 15px 15px;
  flex-grow: 1;
}
table {
  width: 100%;
}
.center {
  text-align: center;
}
.add {
  margin: 15px 0;
  display: block;
}
</style>