<script context="module" lang="ts">
  export async function preload({ query }, session){
    if(session.token){
      this.redirect(302, '/profile')
    }

    return {
      tabIndex: query.tab || 0
    }
  }
</script>
<script lang="ts">
  import { goto } from '@sapper/app';

  import { AppBar } from "svelte-materialify";
  import Tabs from 'svelte-materialify/src/components/Tabs';
  import Tab from 'svelte-materialify/src/components/Tabs/Tab.svelte';
  import Window from 'svelte-materialify/src/components/Window';
  import WindowItem from 'svelte-materialify/src/components/Window/WindowItem.svelte';
  import Signin from "./_signin.svelte";
  import Signup from "./_signup.svelte";
  export let tabIndex;

  function onChange(){
    goto(`/auth?tab=${tabIndex}`)
  }

</script>
<AppBar>
  <span slot="title">Connection</span>
  <div slot="extension">
    <Tabs 
      class="green-text" 
      on:change={onChange} 
      bind:value={tabIndex} 
      fixedTabs>
      <div slot="tabs">
        <Tab>Sign up</Tab>
        <Tab>Sign in (login)</Tab>
      </div>
    </Tabs>
  </div>
</AppBar>
<Window value={tabIndex} class="mt-4">
  <WindowItem>
    <Signup />
  </WindowItem>
  <WindowItem>
    <Signin />
  </WindowItem>
</Window>