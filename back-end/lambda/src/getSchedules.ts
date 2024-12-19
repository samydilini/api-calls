import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { ScheduleService } from "./services/scheduleService";
import { createResponse } from "./utils/response";

/*
This is the lambda handler for getting all the shecdulesin the db
*/
const scheduleService = new ScheduleService();

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    // You can use event.queryStringParameters or event.pathParameters if needed to filter results
    const schedules = await scheduleService.getAllSchedules();

    return createResponse(200, schedules);
  } catch (error) {
    console.error("Error retrieving schedules:", error);
    return createResponse(500, { message: "Internal Server Error" });
  }
};
