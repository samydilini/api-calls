import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { ScheduleService } from "./services/scheduleService";
import { createResponse } from "./utils/response";
import { isValidTaskUpdateRequest } from "./utils/validation";

/*
This is the lambda handler for creating a shedule with or without tasks
*/
const scheduleService = new ScheduleService();

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const body = JSON.parse(event.body || "{}");

    // Validate input
    if (!isValidTaskUpdateRequest(body)) {
      return createResponse(400, { message: "Missing required fields" });
    }

    // Delegate to service layer
    const task = await scheduleService.updateTask(body);

    return createResponse(200, task);
  } catch (error) {
    console.error("Error updating task:", error);
    return createResponse(500, { message: "Internal Server Error" });
  }
};
