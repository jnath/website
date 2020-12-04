<script context="module" lang="ts">
  export async function preload({ params }) {
    const res = await this.fetch(`/bookmarks.json?uuid=${params.uuid}`);
    const bookmark = (await res.json())[0];
    return { bookmark };
  }
</script>

<script lang="ts">
  import Edit from './index.svelte';
  import type { Bookmark } from '../../../../stores/bookmarks';
  export let bookmark: Bookmark;
</script>

<Edit {...bookmark}/>