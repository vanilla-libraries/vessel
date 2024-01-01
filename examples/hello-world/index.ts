import assert from "assert";
import vessel from "../../src";

// @todo something like this might be more useful
// throw new VesselError(VesselErrorMessage.UNAUTHORIZED)
// VesselCodes.REDIRECT

vessel({
  services: [
    ({ req }) => {
      assert(new URL(req.url).pathname === "/");
      return new Response("Hello World", { status: 200 });
    },

    // redirect back to home
    ({ req }) => {
      return Response.redirect(new URL("/", req.url), 307);
    },
  ],
}).listen(5000, "127.0.0.1");
