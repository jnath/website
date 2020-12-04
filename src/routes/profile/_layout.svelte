<script context="module" lang="ts">
  export async function preload({}, session){
    if(!session.user){
      this.redirect(302, '/auth')
    }
  }
</script>

<script lang="ts">
  export let segment;
</script>

<style type="text/scss">
  .layout {
    max-width: 600px;
    margin: auto;
    padding: 56px;
  }
</style>

<div class="layout">
  <slot {segment}/>
</div>