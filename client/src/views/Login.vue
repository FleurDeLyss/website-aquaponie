<template>
  <div class="login">
    <h1>Connexion</h1>
    <form @submit.prevent="submit">
      <label for="email">Courriel</label>
      <input id="email" type="text" v-model="email" />
      <label for="password">Mot de passe</label>
      <input id="password" type="password" v-model="password" />
      <button>Se connecter</button>
    </form>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
        email: "",
        password: ""
    };
  },
  methods: {
    submit() {
      this.$http
        .post(this.$apiUrl + `/login`, {
          email: this.email,
          password: this.password,
        })
        .then((res) => {
          console.log(res.data);
          this.$store.dispatch("login",res.data);
          this.$router.push('/');
        })
        .catch(() => {
          alert("Une erreur s'est produite");
        });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/theme.scss";
#app > .login {
  max-width: 500px;
  background-color: lighten($dark, 10);
  border-radius: 10px;
  padding: 15px 15px;
}
</style>