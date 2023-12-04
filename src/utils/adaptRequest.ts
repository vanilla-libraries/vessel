import http from "http";

export async function adaptRequest(
  req: http.IncomingMessage
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

  return new Request(`http://localhost${req.url}`, {
    method: req.method!,
    headers,
    body,
  });
}
