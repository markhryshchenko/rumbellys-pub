// Public env vars read by the shared `envs` package. They are optional: unset values are
// undefined at runtime (Storybook sets PUBLIC_CHROMATIC via its script).
declare module '$env/static/public' {
	export const PUBLIC_SITE_MODE: string | undefined;
	export const PUBLIC_SENTRY_DSN: string | undefined;
	export const PUBLIC_CHROMATIC: string | undefined;
}
