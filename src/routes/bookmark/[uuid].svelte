<script context="module" lang="ts">
  let Component: any = null;
  export async function preload({ params }) {
    const res = await this.fetch(`/bookmarks.json?uuid=${params.uuid}`);
    const bookmark = (await res.json())[0];
    if (!process.browser) {
      try {
        Component = await plugins[bookmark.plugin];
      } catch (error) {
        this.error(error);
      }
    }
    return { bookmark };
  }
</script>

<script lang="ts">
  import plugins from "../../plugins";
  import type { Bookmark } from "../../stores/bookmarks";
  export let bookmark: Bookmark;
  const { plugin, props} = bookmark;
</script>

{#if process.browser}
  {#await plugins[plugin]}
    <p>...waiting</p>
  {:then c}
    <svelte:component this={c.default} {...props} />
  {:catch error}
    <p style="color: red">{error.message}</p>
  {/await}
{:else if Component}
  <svelte:component this={Component.default} {...props} />
{/if}
