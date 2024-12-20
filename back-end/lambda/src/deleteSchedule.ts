import { APIGatewayProxyResult } from "aws-lambda";
import { ScheduleService } from "./services/scheduleService";
import { createResponse } from "./utils/response";

/**
 * This is the lambda handler for deleting a schedule using an id
 */
const scheduleService = new ScheduleService();

export const handler = async (event: any): Promise<APIGatewayProxyResult> => {
  const id: string = event.pathParameters.id;
  try {
    const schedules = await scheduleService.deleteSchedule(id);

    return createResponse(200, `Schedule with ${id} was sucessfully deleted`);
  } catch (error) {
    console.error(`Error deleting schedule with the id: ${id}`, error);
    return createResponse(500, { message: "Internal Server Error" });
  }
};
