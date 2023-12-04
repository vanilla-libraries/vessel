import http from "http";
import { AssertionError } from "assert";
import { adaptRequest } from "./utils/adaptRequest";
import { interpetResponse } from "./utils/interpetResponse";

type None = undefined | null | boolean | void;

export type ServiceArgs<Context> = { req: Request; ctx: Context };
export type Service<Context> = (
  args: ServiceArgs<Context>
) => Promise<Response | None> | (Response | None);

export function vessel<Context extends {}>({
  services = [],
  createContext = () => ({} as Context),
}: {
  services: (Service<Context> | None)[];
  createContext: () => Promise<Context> | Context;
}) {
  // filter out everything except functions
  const filteredServices: Service<Context>[] = services.filter(
    (service) => service && typeof service === "function"
  ) as Service<Context>[];

  // create the http server base
  const server = http.createServer(async (httpReq, httpRes) => {
    const req = await adaptRequest(httpReq);
    const initialContext = await createContext();
    for (const service of filteredServices) {
      try {
        const serviceRes = await service({ req, ctx: initialContext });
        if (serviceRes instanceof Response) {
          return interpetResponse(serviceRes, httpRes);
        }
      } catch (error) {
        if (!(error instanceof AssertionError)) {
          return interpetResponse(
            Response.json({ error: new String(error) }, { status: 500 }),
            httpRes
          );
        }
      }
    }

    return interpetResponse(
      Response.json({ error: "404 not found" }, { status: 404 }),
      httpRes
    );
  });

  return server;
}

export default vessel;
