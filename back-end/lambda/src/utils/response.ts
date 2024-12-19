/*
used to create response sent to the user
 */
export const createResponse = (statusCode: number, body: any) => ({
  statusCode,
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(body),
});
