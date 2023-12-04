import http from "http";

export async function interpetResponse(
  serviceRes: Response,
  httpRes: http.ServerResponse<http.IncomingMessage>
) {
  httpRes.statusCode = serviceRes.status;
  for (const [headerName, headerValue] of serviceRes.headers.entries()) {
    httpRes.setHeader(headerName, headerValue);
  }

  httpRes.end(await serviceRes.text());
}
