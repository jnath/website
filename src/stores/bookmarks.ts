import { writable } from "svelte/store";

import client from "../lib/axios";

export type Bookmark = {
  uuid: string;
  title: string;
  logo: string;
  plugin: string;
  props: object;
};

const store = writable<Bookmark[]>([]);
let timer: NodeJS.Timeout = null;

export async function sync() {
  if (timer) return;
  timer = setTimeout(() => {
    timer = null;
  }, 100);
  const response = await client.get("/bookmarks.json");
  store.set(response.data);
}

export async function add(
  bookmarks: Omit<Bookmark, "uuid">[] | Omit<Bookmark, "uuid">
) {
  const response = await client.post(`/bookmarks.json`, bookmarks);
  if (response.status === 200) {
    store.set(response.data);
    return true;
  }

  return false;
}

export async function save(bookmark: Omit<Bookmark, "uuid">) {
  const response = await client.put(`/bookmarks.json`, bookmark);
  if (response.status === 200) {
    store.set(response.data);
    return true;
  }

  return false;
}

export async function del(uuid: string) {
  const response = await client.delete(`/bookmarks.json?uuid=${uuid}`);
  if (response.status === 200) {
    store.set(response.data);
    return true;
  }

  return false;
}

export default store;
