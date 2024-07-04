import { hc } from "hono/client";
import { AppType } from "./../app/api/[[...route]]/route";

export let client = hc<AppType>(process.env.NEXT_PUBLIC_APP_URL!);
