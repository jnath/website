import { writable } from "svelte/store";

const bookmarks = writable("bookmarks");

export default bookmarks;
