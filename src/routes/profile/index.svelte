<script context="module" lang="ts">
  export async function preload({}, session){
    return {
      user: session.user
    }
  }
</script>

<script lang="ts">
  import { onMount } from "svelte";
  import { mdiDotsVertical, mdiHomeEdit, mdiPlus } from "@mdi/js";
  import { Avatar, Button, Icon, List, ListItem } from "svelte-materialify";
  import Menu from "svelte-materialify/src/components/Menu";
  import bookmarks, { sync, del } from "../../stores/bookmarks";
  import type { Bookmark } from '../../stores/bookmarks';
  import { goto } from '@sapper/app';
  import type { UserDoc } from "../../db/User";

  export let user: UserDoc;

  onMount(()=>{
    sync()
  })

  function add(){
    goto('/profile/bookmarks/edit')
  }

  function edit(bookmark: Bookmark){
    return ()=>{
      goto(`/profile/bookmarks/edit/${bookmark.uuid}`)
    }
  }

  function trash(bookmark: Bookmark){
    return ()=>{
      del(bookmark.uuid)
    }
  }

</script>

<style type="text/scss">
  .user{
    display: flex;
    align-items: center;
    justify-content: space-around;
  }
  .bookmarks {
    display: flex;
    flex-direction: column;

    :global(.add) {
      align-self: flex-end;
    }
  }
</style>

<div class="user">
  <Avatar size={100}>
    <img src={user.avatar || "//picsum.photos/200"} alt="profile" />
  </Avatar>
  <h6>{user.email}</h6>
  <Button>
    <Icon path={mdiHomeEdit}/>
  </Button>
</div>
<div class="bookmarks">
  <Button fab size="small" class="blue white-text add" on:click={add}>
    <Icon path={mdiPlus} />
  </Button>
  <List>
    {#each $bookmarks as bookmark}
    <ListItem ripple={null}>
      <div slot="prepend">
        <Avatar><img width={100} height={100} src={bookmark.logo} alt="Avatar" /></Avatar>
      </div>
      {bookmark.title}
      <span slot="subtitle"> <b>{bookmark.plugin}</b> - {Object.keys(bookmark.props).map(b=>`${b} : ${bookmark.props[b]}`).join(', ')} </span>
      <div slot="append">
        <Menu absolute>
          <div slot="activator">
            <Button icon>
              <Icon path={mdiDotsVertical} />
            </Button>
          </div>
          <List dense>
            <ListItem on:click={edit(bookmark)}>edit</ListItem>
            <ListItem on:click={trash(bookmark)} class="red white-text">delete</ListItem>
          </List>
        </Menu>
      </div>
    </ListItem>
    {/each}
  </List>
</div>
