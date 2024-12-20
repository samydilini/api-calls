/**
 * used to create response sent to the user
 * @param statusCode response status code
 * @param body response body
 * @returns the response for the user
 */
export const createResponse = (statusCode: number, body: any) => ({
  statusCode,
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(body),
});
