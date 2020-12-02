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