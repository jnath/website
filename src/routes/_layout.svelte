<script lang="ts">
  import { MaterialApp } from "svelte-materialify";
  import Nav from "../components/Nav.svelte";
</script>

<style global type="text/scss">
  a {
    text-decoration: none;
  }
  :global(.s-app) {
    height: 100vh;
  }
</style>

<MaterialApp theme="dark">
  <Nav />
  <div class="content">
    <slot />
  </div>
</MaterialApp>
