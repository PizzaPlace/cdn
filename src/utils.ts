import type { MiddlewareHandler } from "hono";

export type Options = {
    Bindings: {
        CDN_BUCKET: R2Bucket;
        SENTRY_DSN: string;
        ACCESS_TOKEN: string;
        REDIRECT_URL: string;
    };
    Variables: {
        user: string;
    };
};

export type Middleware = MiddlewareHandler<Options>;

export function idLength(query: string | undefined, def: number) {
    const id = query ? parseInt(query) : null;
    if (!id || isNaN(id)) return def;
    return id;
}

export function auth(): Middleware {
    return async (c, next) => {
        const missingAccess = () =>
            c.json(
                { success: false, error: "For you this maze isn't" },
                401
            );

        const header = c.req.header("Authorization");
        if (!header) return missingAccess();

        const user = (await c.env.ACCESS_TOKEN) === header ? header : false;
        console.log(header);
        console.log(user);

        if (!user)
            return c.json({ success: false, error: "Invalid Token" }, 401);

        c.set("user", user);

        return next();
    };
}

export function cache(): Middleware {
    return async (c, next) => {
        const key = c.req.url;
        const cache = await caches.open("cdn:images");
        const response = await cache.match(key);

        if (response) {
            const ifNoneMatch =
                c.req.header("If-None-Match") || c.req.header("if-none-match");
            const etag =
                response.headers.get("ETag") || response.headers.get("etag");

            if (ifNoneMatch === etag) {
                return new Response(null, {
                    status: 304,
                    statusText: "Not Modified",
                    headers: response.headers,
                });
            }

            return response;
        }

        await next();

        c.executionCtx.waitUntil(cache.put(key, c.res.clone()));
    };
}
