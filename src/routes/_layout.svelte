<script lang="ts">
  import { MaterialApp } from "svelte-materialify";
  import client, { setRefreshTokenProcess } from '../lib/axios'
  import decode from "jwt-decode";

  import { stores } from '@sapper/app';
  const { page, session } = stores();
  
  export let segment;
  if(process.browser){

    page.subscribe(async ({ path }) => {
      if ($session.refreshToken && $session.user?.exp <= Date.now() / 1000) {
        const {
          data: { token },
        } = await client.post("/auth/token", {
          refreshToken: $session.refreshToken,
        });
        $session.user = decode(token) as any;
        $session.token = token;
      }
    });
  
    setRefreshTokenProcess($session, ['/auth/login', '/auth/register']);
  }

</script>

<style global type="text/scss">
  a {
    text-decoration: none;
  }
  :global(.s-app) {
    height: 100vh;
  }
</style>

<MaterialApp theme="dark">
  <slot {segment} />
</MaterialApp>
