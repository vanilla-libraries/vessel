import http from "http";
import { AssertionError } from "assert";
import { getAddress } from "./utils/getAddress";
import { adaptRequest } from "./utils/adaptRequest";
import { interpetResponse } from "./utils/interpetResponse";

type None = undefined | null | boolean | void;

export type ServiceArgs<Context> = { req: Request; ctx: Context };
export type Service<Context> = (
  args: ServiceArgs<Context>
) => Promise<Response | None> | (Response | None);

export type VesselArgs<Context> = {
  /**
   * List of services that should be interpreted on each request
   */
  services: (Service<Context> | None)[];

  /**
   * Create initial context for each request
   * @returns Context object
   */
  createContext: () => Promise<Context> | Context;
};

/**
 * Create a new vessel server
 * @param vesselArgs Configuration operations
 * @returns
 */
export function vessel<Context extends {}>({
  services = [],
  createContext = () => ({} as Context),
}: VesselArgs<Context>) {
  // filter out everything except functions
  const filteredServices: Service<Context>[] = services.filter(
    (service) => service && typeof service === "function"
  ) as Service<Context>[];

  // create the http server base
  const server = http.createServer(async (httpReq, httpRes) => {
    // resolve URL & create request object
    const { hostname, port } = getAddress(server);
    const req = await adaptRequest(
      httpReq,
      new URL(httpReq.url || "/", `http://${hostname}:${port}`)
    );

    // create initial context
    const initialContext = await createContext();

    // interpret each service
    for (const service of filteredServices) {
      try {
        const serviceRes = await service({ req, ctx: initialContext });
        if (serviceRes instanceof Response) {
          return interpetResponse(serviceRes, httpRes);
        }
      } catch (error) {
        // assertion errors are used to describe if the route should match or not
        if (!(error instanceof AssertionError)) {
          return interpetResponse(
            Response.json({ error: new String(error) }, { status: 500 }),
            httpRes
          );
        }
      }
    }

    // default 404 response
    return interpetResponse(
      Response.json({ error: "404 not found" }, { status: 404 }),
      httpRes
    );
  });

  return server;
}

export default vessel;
