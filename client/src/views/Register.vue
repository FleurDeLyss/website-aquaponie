<template>
  <div class="register">
    <h1>Inscription</h1>
    <form @submit.prevent="submit">
      <label for="firstname">Prénom</label>
      <input id="firstname" type="text" v-model="firstname" />

      <label for="lastname">Nom</label>
      <input id="lastname" type="text" v-model="lastname" />

      <label for="email">Courriel</label>
      <input id="email" type="text" v-model="email" />

      <label for="password">Mot de passe</label>
      <input id="password" type="password" v-model="password" />

      <label for="confirm">Confirmer</label>
      <input id="confirm" type="password" v-model="confirm" />

      <button>S'inscrire</button>
    </form>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      email: "",
      password: "",
      confirm: "",
      firstname: "",
      lastname: ""
    };
  },
  methods: {
    submit() {
      this.$http
        .post(this.$apiUrl + `/register`, {
          email: this.email,
          password: this.password,
          firstname: this.firstname,
          lastname: this.lastname
        })
        .then(() => {
          alert('Votre compte à été créer');
          this.$router.push('/connexion');
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
#app > .register {
  max-width: 500px;
  background-color: lighten($dark, 10);
  border-radius: 10px;
  padding: 15px 15px;
}
</style>