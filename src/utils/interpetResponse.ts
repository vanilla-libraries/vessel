import http from "http";

/**
 * Interpret a response appropriately \
 * Essentially convert the familiar Response object into a http Server Response
 *
 * @param serviceRes Response object returned from a user-written service
 * @param httpRes Server response
 */
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
