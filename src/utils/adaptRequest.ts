import http from "http";

/**
 * Convert the http request into a familiar Request object
 * @param req http message
 * @param url resolved url (includes hostname & port)
 * @returns familiar Request object
 */
export async function adaptRequest(
  req: http.IncomingMessage,
  url: URL
): Promise<Request> {
  const headers = new Headers();
  for (const [headerName, headerValue] of Object.entries(req.headers)) {
    if (headerValue) {
      headers.append(
        headerName,
        Array.isArray(headerValue) ? headerValue.join(", ") : headerValue
      );
    }
  }

  const body: BodyInit | null =
    req.method === "GET" || req.method === "POST"
      ? null
      : JSON.stringify(
          await new Promise((resolve, reject) => {
            const data: string[] = [];

            req.on("data", (chunk) => data.push(chunk));
            req.on("end", () => resolve(data.toString()));

            setTimeout(() => reject(), 2000);
          }).catch(() => ({}))
        );

  return new Request(url, {
    method: req.method!,
    headers,
    body,
  });
}
