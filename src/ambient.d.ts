/**
 * These declarations tell TypeScript that we allow import of images, e.g.
 * ```
		<script lang='ts'>
			import successkid from 'images/successkid.jpg';
		</script>

		<img src="{successkid}">
	 ```
 */
declare module "*.gif" {
  const value: string;
  export = value;
}

declare module "*.jpg" {
  const value: string;
  export = value;
}

declare module "*.jpeg" {
  const value: string;
  export = value;
}

declare module "*.png" {
  const value: string;
  export = value;
}

declare module "*.svg" {
  const value: string;
  export = value;
}

declare module "*.webp" {
  const value: string;
  export = value;
}

declare namespace NodeJS {
  export interface Process {
    browser: boolean;
  }
  export interface ProcessEnv {
    NODE_ENV: "development" | "production";
    PORT: number;
  }
}

declare interface PluginProps {
  label: string;
  description: string;
  type: string;
  require?: boolean;
  default?: any;
  rules?: string[];
  useForLogo?: boolean;
}

declare module "*.svelte" {
  export const props: PluginProps;
}
