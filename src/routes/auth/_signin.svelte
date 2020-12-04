<script lang="ts">
  import { goto, stores } from '@sapper/app'
  import axios from '../../lib/axios';
  import { mdiEyeOff, mdiEye, mdiAlert } from "@mdi/js";
  import { Alert, Button, Icon, TextField } from "svelte-materialify";
  import { onMount } from 'svelte';
  import onAnimationStart from '../../lib/fixTextField';
  import decode from "jwt-decode";

  const { session } = stores()

  let email: string;
  let password: string;
  let showPassword = false;

  const error = {
    email: false,
    password: false,
    password2: false
  };

  export let alert: Error | null = null;

  function ruleRequire(v: string){
    return !!v ? false : 'require';
  }

  function ruleEmail(v:string){
    const emailPattern = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'g')
    return !!emailPattern.test(v) ? false : 'is not a valid email'
  }

  async function submit(){
    const { data } = await axios.post('/auth/login', {
      email,
      password
    })
    if(data.error){
      alert = new Error("A error with your credential please use another email or password")
    }else{
      $session.user = decode(data.token)
      goto('/bookmark')
    }
  }

  onMount(()=>{
    document.querySelector('form#signin').querySelectorAll('input').forEach((input)=>{
      input.addEventListener('animationstart', onAnimationStart, false)
    })
  })
</script>

<h4>Sign in</h4>
{#if alert}
  <Alert class="error-color mt-10">
    <div slot="icon">
      <Icon path={mdiAlert} />
    </div>
    {alert.message}
  </Alert>
{/if}
<form id="signin">
  <TextField
    bind:value={email}
    bind:error={error['email']}
    rules={[ruleRequire, ruleEmail]}
    validateOnBlur={false}
    class="mt-10"
    >
      Your email ex: jon.doe@email.com
  </TextField>

  <TextField
    bind:value={password}
    bind:error={error['password']}
    rules={[ruleRequire]}
    validateOnBlur={false}
    type={showPassword ? 'text' : 'password'}
    class="mt-10"
    >
      Password
      <div
        slot="append"
        on:click={() => {
          showPassword = !showPassword;
        }}>
        <Icon path={showPassword ? mdiEyeOff : mdiEye} />
      </div>
  </TextField>

  <Button 
    on:click={submit}
    disabled={Object.values(error).filter(e=>e).length > 0}
    class="mt-10"
    >
    OK
  </Button>
</form>