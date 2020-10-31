<script lang="ts">
  import { onMount } from "svelte";

  import setXframeBybass from "./x-frame-bypass";

  export let src: string = "";
  export let title: string = "";
  export let frameBypass: boolean = false;

  onMount(() => {
    setXframeBybass(customElements);
  });
</script>

<style type="text/scss">
  .frame {
    width: 100vw;
    height: 100vh;
    border: none;
  }
</style>

<svelte:head>
  <script src="https://unpkg.com/@ungap/custom-elements-builtin">
  </script>
</svelte:head>

<!-- svelte-ignore avoid-is -->
<iframe class="frame" is={frameBypass ? 'x-frame-bypass' : ''} {src} {title} />
