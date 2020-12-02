<script context="module" lang="ts">
  export async function preload({}, session){
    if(!session.user){
      this.redirect(302, '/auth')
    }
  }
</script>
<script lang="ts">
  import Nav from "../../components/Nav.svelte";
  export let segment;
</script>

<style global type="text/scss">
  a {
    text-decoration: none;
  }
  :global(.s-app) {
    height: 100vh;
  }
</style>

<Nav />
<div class="content">
  <slot {segment} />
</div>
