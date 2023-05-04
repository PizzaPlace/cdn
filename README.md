# PizzaPlace CDN Worker

> This project was originally created by [SerenModz21](https://github.com/SerenModz21/). It was adapted for use by the PizzaPlace team.

![GitHub](http://172.28.240.1:8787/eaZhHJvU.png)

This project is a Cloudflare Worker that serves static assets from a Cloudflare R2 store.
It is open source for the sake of transparency and to allow others to use it as a quick CDN to host for their own use cases.

## Setup

```bash
git clone https://github.com/PizzaPlace/cdn.git
cd cdn
pnpm i
```

Create a `wrangler.toml` file, based on `wrangler.toml.example`. Edit it as needed.

```bash
pnpm deploy
```

Past the above guide, we do not offer self hosting support for this project. If you want to host it yourself, you're on your own.

## Usage

The routes are as follows:

- GET `/` will redirect to the `REDIRECT_URL` variable specified in your `wrangler.toml` file.
- GET `/:id` route will serve the file with the ID `:id` from the R2 store.
- POST `/upload` will upload the provided image to the R2 store and return the ID, and the URL of the uploaded file. This route is guarded by the `auth` middleware, that checks if the `Authorization` header matches the `ACCESS_TOKEN` variable specified in your `wrangler.toml` file.
- DELETE `/:id` will delete the file with the ID `:id` from the R2 store. This route is guarded by the `auth` middleware, that checks if the `Authorization` header matches the `ACCESS_TOKEN` variable specified in your `wrangler.toml` file.
