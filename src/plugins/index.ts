export default {
  iframe: import("./iframe/index.svelte"),
} as { [name: string]: Promise<typeof import("*.svelte")> };
