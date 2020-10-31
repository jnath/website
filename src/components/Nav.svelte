<script context="module" lang="ts">
  interface Bookmark {
    uuid: string;
    title: string;
    logo: string;
    plugin: string;
    props: object;
  }
  export async function preload() {
    console.log("nav");
    const res = await this.fetch("/bookmarks.json");
    const bookmarks = await res.json();
    console.log("nav", bookmarks);
    return { bookmarks };
  }
</script>

<script lang="ts">
  import { mdiMenu } from "@mdi/js";

  import {
    Avatar,
    Button,
    Icon,
    ListItem,
    NavigationDrawer,
    List,
    Overlay,
  } from "svelte-materialify";

  export let bookmarks: Bookmark[] = [];

  let active = false;
  function toggleNavigation() {
    active = !active;
  }

  function close() {
    active = false;
  }

  import { onMount } from "svelte";
  $: smallAndDown = true;
  onMount(async () => {
    const breakpoints = (
      await import("svelte-materialify/src/utils/breakpoints")
    ).default;

    // check if screen size is less than or equal to medium
    smallAndDown = window.matchMedia(breakpoints["sm-and-down"]).matches;
    let timer = null;
    addEventListener("resize", () => {
      smallAndDown = window.matchMedia(breakpoints["sm-and-down"]).matches;
    });
    addEventListener("mousemove", (e: MouseEvent) => {
      if (smallAndDown) return;
      if (e.pageX < 15) {
        if (timer) {
          clearTimeout(timer);
        }
        active = true;
      } else if (active && e.pageX > 56) {
        if (timer) {
          clearTimeout(timer);
        }
        timer = setTimeout(() => {
          active = false;
        }, 250);
      }
    });
    document.addEventListener("mouseleave", () => {
      if (smallAndDown) return;
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        active = false;
      }, 250);
    });
  });

  console.log(bookmarks);
</script>

<style type="text/scss">
  @import "svelte-materialify/src/styles/variables";
  .nav-menu {
    position: fixed;
    height: 100%;
    z-index: 99;
    @media #{map-get($display-breakpoints, "sm-and-down")} {
      :global(.s-navigation-drawer__content) {
        margin-top: 56px;
      }
    }
  }
  .btn-menu {
    position: fixed;
    z-index: 9999;

    :global(.s-btn) {
      width: 40px;
      height: 40px;
      margin: 8px;
      background-color: rgba(#000000, 0.25);
    }
  }
</style>

{#if smallAndDown}
  <div class="btn-menu">
    <Button fab depressed on:click={toggleNavigation}>
      <Icon path={mdiMenu} />
    </Button>
  </div>
{/if}

<div class="nav-menu">
  <NavigationDrawer borderless mini {active}>
    <ListItem>
      <span slot="prepend" class="ml-n2">
        <Avatar size={40}>
          <img src="//picsum.photos/200" alt="profile" />
        </Avatar>
      </span>
      Mudit Somani
    </ListItem>
    <List dense nav>
      {#each bookmarks as bookmark, i}
        <ListItem>
          <span slot="prepend">
            <img width={32} height={32} src={bookmark.logo} alt="logo" />
          </span>
          {bookmark.title}
        </ListItem>
      {/each}
    </List>
  </NavigationDrawer>
</div>
<Overlay index={1} {active} opacity={0} on:click={close} absolute />
