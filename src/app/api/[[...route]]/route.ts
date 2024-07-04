import { Hono } from "hono";
import { handle } from "hono/vercel";
import { accountsApi } from "./accounts";

export const runtime = "edge";

let app = new Hono().basePath("/api");

let routes = app.route("/accounts", accountsApi);

export let GET = handle(app);
export let POST = handle(app);

export type AppType = typeof routes;
