import { Hono } from "hono";
import { handle } from "hono/vercel";

export const runtime = "edge";

let app = new Hono().basePath("/api");

export let GET = handle(app);
export let POST = handle(app);
