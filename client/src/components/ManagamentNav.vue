<template>
  <ul class="management-nav">
    <li>
      <router-link to="/gestion/variables"><i class="ri-line-chart-line"></i> Variables</router-link>
    </li>
    <li>
      <router-link to="/gestion/utilisateurs"><i class="ri-user-line"></i> Utilisateurs</router-link>
    </li>
    <li>
      <router-link to="/gestion/textes"><i class="ri-text"></i> Textes</router-link>
    </li>
  </ul>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
@import "@/theme.scss";
.management-nav {
  background-color: lighten($dark, 10);
  border-radius: 10px;
  margin-right: 15px;
  display: flex;
  list-style-type: none;
  flex-direction: column;
  overflow: hidden;
  min-width: 200px;
}
a {
  padding: 15px;
  text-decoration: none;
  color: white;
  display: block;
}
a:hover {
  background-color: lighten($dark, 15);
}
a.router-link-active {
  background-color: $primary;
}
a.router-link-active:hover {
  background-color: lighten($primary, 5);
}
</style>