<script context="module" lang="ts">
  export const props = {
    src:{
      label: 'Source',
      description: 'http or https url for your website to bookmark',
      type: "string",
      require: true,
      rules:['http'],
      useForLogo: true
    },
    frameBypass: {
      label: 'X-FRAME-ORIGIN bypass',
      description: 'set to true if the website use (x-frame-origin)',
      type: "boolean",
      default: false
    }
  }
</script>
<script lang="ts">
  import { onMount } from "svelte";

  import setXframeBybass from "./x-frame-bypass";

  export let src: string = "";
  export let title: string = "";
  export let frameBypass: boolean = false;
  let loaded: boolean = false;

  function customElementsLoaded() {
    setXframeBybass(customElements);
    loaded = true;
  }
</script>

<style type="text/scss">
  .frame {
    width: 100vw;
    height: 100vh;
    border: none;
  }
</style>

<svelte:head>
  {#if frameBypass}
    <script 
      src="https://unpkg.com/@ungap/custom-elements-builtin"
      on:load={customElementsLoaded}
      async={true}
    >
    </script>
  {/if}
</svelte:head>

{#if frameBypass && loaded}
  <!-- svelte-ignore avoid-is -->
  <iframe class="frame" is={frameBypass ? 'x-frame-bypass' : ''} {src} {title} />
{:else if !frameBypass}
  <iframe class="frame" {src} {title} />
{/if}
