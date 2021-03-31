<template>
  <header>
    <nav>
      <ul>
        <li>
          <router-link to="/" class="homelink">Accueil</router-link>
        </li>
        <li>
          <router-link to="/statistique">Statistique</router-link>
        </li>
        <template v-if="$store.state.user">
          <li v-if="$store.state.user.permissions >= 10">
            <router-link to="/donnees">Données</router-link>
          </li>
          <li class="spacer"></li>
          <li v-if="$store.state.user.permissions >= 50">
            <router-link to="/gestion">Gestion</router-link>
          </li>
          <li>
            <a @click.prevent="$store.dispatch('logout')">Se déconnecter</a>
          </li>
        </template>
        <template v-else-if="!$store.state.user">
          <li class="spacer"></li>
          <li>
            <router-link to="/connexion">Se connecter</router-link>
          </li>
          <li>
            <router-link to="/inscription">Créer un compte</router-link>
          </li>
        </template>
      </ul>
    </nav>
  </header>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
@import "@/theme.scss";
header {
  background-color: lighten($dark, 5);
}
ul {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  list-style-type: none;
}
a {
  padding: 15px;
  text-decoration: none;
  color: white;
  display: block;
}
a:hover,
a:focus {
  background-color: lighten($dark, 10);
}
a.router-link-active:not(.homelink),
a.router-link-exact-active.homelink {
  background-color: $primary;
}
a.router-link-active:not(.homelink):hover,
a.router-link-exact-active.homelink:hover {
  background-color: lighten($primary, 5);
}
.spacer {
  flex-grow: 1;
}
</style>