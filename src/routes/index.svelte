<script context="module" lang="ts">
  interface Bookmark {
    uuid: string;
    title: string;
    logo: string;
    plugin: string;
    props: object;
  }
  // export async function preload({ params }) {
  //   const res = await this.fetch("/bookmarks.json");
  //   const bookmarks = await res.json();

  //   return { bookmarks };
  // }
</script>

<script lang="ts">
  import { scale } from "svelte/transition";

  export let bookmarks: Bookmark[] = [];

  $: hover = null;

  function onEnter(i) {
    return () => {
      hover = i;
    };
  }

  function onLeave(i) {
    return () => {
      hover = null;
    };
  }
</script>

<style type="text/scss">
  .bookmark {
    transition: box-shadow 0.25s ease-in-out;
    color: white;

    cursor: pointer;

    .img {
      width: 200px;
      display: flex;
      justify-content: center;
      padding-top: 25px;
    }
    .title {
      font-size: 22px;
      text-align: center;
    }
  }
</style>

<div class="d-flex justify-center" style="flex-wrap:wrap; padding: 20px;">
  {#each bookmarks as bookmark, i}
    <a
      href={`/bookmark/${bookmark.uuid}`}
      transition:scale
      class="bookmark"
      class:elevation-3={hover !== i}
      class:elevation-7={hover === i}
      style="max-width:350px; margin:5px;"
      on:mouseenter={onEnter(i)}
      on:mouseleave={onLeave(i)}>
      <div class="img">
        <img width={64} height={64} src={bookmark.logo} alt="cover" />
      </div>
      <h3 class="title">{bookmark.title}</h3>
    </a>
  {/each}
</div>
