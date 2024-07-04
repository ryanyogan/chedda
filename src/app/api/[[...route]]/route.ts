import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { handle } from "hono/vercel";
import { accountsApi } from "./accounts";

export const runtime = "edge";

let app = new Hono().basePath("/api");

app.onError((err, ctx) => {
  if (err instanceof HTTPException) {
    return err.getResponse();
  }

  return ctx.json({ error: "Internal Error" }, 500);
});

let routes = app.route("/accounts", accountsApi);

export let GET = handle(app);
export let POST = handle(app);

export type AppType = typeof routes;
