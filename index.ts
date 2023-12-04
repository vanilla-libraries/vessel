import assert from "assert";
import vessel from "./src";

interface Context {
  count: number;
}

vessel({
  services: [
    ({ ctx }) => {
      ctx.count = 1;
    },
    ({ req, ctx }) => {
      assert(new URL(req.url).pathname === "/");
      return new Response("hello" + ctx.count, { status: 200 });
    },
  ],
  createContext: () =>
    ({
      count: 0,
    } satisfies Context),
}).listen(5000);
