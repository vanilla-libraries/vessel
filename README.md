# Vessel

A tiny HTTP framework that makes you do all the work.

Vessel works with familiar web technologies including `Request` and `Response`. Rather than explicitly defining callbacks for a given route that match a given pattern, you define a series of middleware-like functions that either return a response or a falsey value. This structure enables increased control and (extreme) readability in exchange for lacking utilities that you should be able to reasonably implement yourself.

Here's the obligatory "Hello World" in Vessel.

```ts
import vessel from "@vanilla-libraries/vessel";
import assert from "assert";

vessel({
  services: [
    ({ req, ctx }) => {
      // this route only responds to the index route
      assert(new URL(req.url).pathname === "/");

      // return a basic response
      return new Response("hello", { status: 200 });
    },
  ],
}).listen(5000);
```
