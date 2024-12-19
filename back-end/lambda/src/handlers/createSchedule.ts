import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { ScheduleService } from "../services/scheduleService";
import { createResponse } from "../utils/response";
import { isValidSchedule } from "../utils/validation";

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
    if (!isValidSchedule(body)) {
      return createResponse(400, { message: "Missing required fields" });
    }

    // Delegate to service layer
    const schedule = await scheduleService.createScheduleAndTasks(body);

    return createResponse(201, schedule);
  } catch (error) {
    console.error("Error creating schedule:", error);
    return createResponse(500, { message: "Internal Server Error" });
  }
};
