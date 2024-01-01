import http from "http";

/**
 * Extract the port and hostname from the server \
 * Sets some defaults if the address is a string
 *
 * @param server Server instance
 * @returns Port & hostname of the server
 */
export function getAddress(server: http.Server) {
  const address = server.address();

  // @audit what does a string address mean?
  if (address === null || typeof address === "string") {
    return {
      port: 5000,
      hostname: "localhost",
    };
  }

  return {
    port: address.port,
    hostname: address.address === "::" ? "0.0.0.0" : address.address,
  };
}
