<script lang="ts">
  import Select from 'svelte-materialify/src/components/Select';
  import Switch from 'svelte-materialify/src/components/Switch';
  import { TextField, Button, Avatar } from 'svelte-materialify';
  import { goto } from '@sapper/app';

  import { default as pluginCollection } from '../../../../plugins';
  import { add, save } from '../../../../stores/bookmarks';
  import type{ Bookmark } from '../../../../stores/bookmarks';

  export let uuid: string;
  export let plugin: string = '';
  export let logo: string = '';
  export let title: string = '';
  export let props = {};
  let error = {};

  const plugins = Object.keys(pluginCollection).map((name)=>({
    name,
    value: name
  }))
  
  function ruleRequire(require: boolean): (value) => string | false{
    if(require){
      return (v: string)=>{
        return !!v ? false : 'require';
      }
    }

    return undefined
  }
  const rules: {[ruleNam:string]:((value) => string | false)} = {
    http: (v)=>{
      const urlPattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
            '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
      return !!urlPattern.test(v) ? false : 'is not a valid url';
    }
  }

  function getRules(names:string[]){
    if(!names) return []
    return names.map((r)=>rules[r])
  }

  async function submit(){
    const bookmark = {
      uuid,
      plugin,
      logo,
      title,
      props
    } as Bookmark;

    if(bookmark.uuid){
      await save(bookmark)
    }else{
      await add(bookmark)
    }
    goto('/profile')
  }

  function inputChange(name:string, pluginProps: PluginProps){
    if(pluginProps[name].useForLogo){
      return ()=>{
        if(error[name] === false){
          const url = new URL('/favicon.ico', props[name]).href;
          // TODO: check if url exist with call http and get status 200
          logo = url
        }else{
          logo = null
        }
      }
    }

    return undefined
  }

</script>

<style type="text/scss">
  .props{
    margin-top: 24px;
  }

  .logo {
    display: flex;
  }
</style>

<Select bind:value={plugin} items={plugins} >Plugin</Select>
{#await pluginCollection[plugin]}
  <p>...waiting</p>
{:then c}
  {#if c}
    <div class="props">
      <h4>{plugin} parameters</h4>
      {#each Object.keys(c.props) as name}
        {#if c.props[name].type === "string"}
          <TextField 
            bind:value={props[name]}
            bind:error={error[name]}
            on:input={inputChange(name, c.props)}
            rules={[ruleRequire(c.props[name].require)].concat(getRules(c.props[name].rules))} 
            hint={c.props[name].label + (c.props[name].require ? ' ( require )' : '')}
            validateOnBlur={false}
            >
            {c.props[name].description}
          </TextField>
        {:else if c.props[name].type === "boolean"}
          <Switch 
            bind:checked={props[name]}
            color="blue"
            >
            {c.props[name].label + ' : ' + c.props[name].description}
          </Switch>
        {/if}
      {/each}
    </div>
  {/if}
{:catch error}
  <p style="color: red">{error.message}</p>
{/await}
{#if plugin !== ""}
  <div class="title">
    <TextField
      bind:value={title}
      bind:error={error['title']}
      rules={[]}
      hint={'Title'}
      validateOnBlur={false}
      >
        Title for retreive easely your bookmark
      </TextField>
  </div>
  <div class="logo">
    {#if logo}
      <Avatar>
        <img src={logo} alt='logo' />
      </Avatar>
    {/if}
    
    <TextField
      bind:value={logo}
      bind:error={error['logo']}
      rules={[ruleRequire(true), rules.http]} 
      hint={'logo ( require )'}
      validateOnBlur={false}
      >
        Url of logo
      </TextField>
  </div>
{/if}
<Button 
  on:click={submit}
  disabled={Object.values(error).filter(e=>e).length > 0}
  >
  OK
</Button>