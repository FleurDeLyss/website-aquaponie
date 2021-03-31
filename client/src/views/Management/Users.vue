<template>
  <div class="page">
    <ManagamentNav/>
    <div class="view">
    <h1>Utilisateurs</h1>
    <table>
      <tr>
        <th>Prénom</th>
        <th>Nom</th>
        <th>Email</th>
        <th class="perm">Permissions</th>
        <th class="ok"><i class="ri-check-line"></i></th>
      </tr>
      <tr v-for="user in users" :key="user.id">
        <td>{{user.firstname}}</td>
        <td>{{user.lastname}}</td>
        <td>{{user.email}}</td>
        <td class="perm">
          <select v-model="user.newPermissions" :disabled="$store.state.user.id == user.id">
            <option value="0">Aucune</option>
            <option value="10">Utilisateur</option>
            <option value="50">Administrateur</option>
          </select>
        </td>
        <td class="ok">
          <button :disabled="user.permissions==user.newPermissions || loading" @click="updatePermissions(user)"><i class="ri-check-line"></i></button>
        </td>
      </tr>
    </table>
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
      users: [],
      loading: false
    };
  },
  methods: {
    updatePermissions(user) {
      this.loading = true;
      this.$http
        .put(this.$apiUrl + `/users/${user.id}/permissions`, {
          permissions: user.newPermissions
        })
        .then(() => {
          user.permissions = user.newPermissions;
          this.loading = false;
        });
    }
  },
  created() {
    this.$http.get(this.$apiUrl + `/users`).then(res => {
      this.users = res.data.map(elem => {
        elem.newPermissions = elem.permissions;
        return elem;
      });
      console.log(res.data);
    });
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
table {
  width: 100%;
}
.perm {
  width: 140px;
  select {
    width: 100%;
  }
}
.ok {
  width: 60px;
  button {
    width: 100%;
  }
  text-align:center;
}
</style>