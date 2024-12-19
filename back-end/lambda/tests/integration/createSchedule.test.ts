import { handler } from "../../src/createSchedule";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { ScheduleService } from "../../src/services/scheduleService";
import dotenv from "dotenv";

// Load the test environment variables
dotenv.config({ path: ".env.local" });

describe("Handler Integration Test", () => {
  it("should create a schedule and tasks", async () => {
    const event: APIGatewayProxyEvent = {
      body: JSON.stringify({
        account_id: 1,
        agent_id: 2,
        start_time: "2024-12-18T08:00:00Z",
        end_time: "2024-12-18T10:00:00Z",
        tasks: [
          {
            account_id: 1,
            start_time: "2024-12-18T08:15:00Z",
            duration: 30,
            type: "work",
          },
        ],
      }),
    } as any;

    const result: APIGatewayProxyResult = await handler(event);

    expect(result.statusCode).toBe(201);
    const responseBody = JSON.parse(result.body);
    expect(responseBody.account_id).toBe(1);
    expect(responseBody.agent_id).toBe(2);
    expect(responseBody.tasks.length).toBe(1);
  });

  it("should return 400 if required fields are missing", async () => {
    const event: APIGatewayProxyEvent = {
      body: JSON.stringify({}),
    } as any;

    const result: APIGatewayProxyResult = await handler(event);

    expect(result.statusCode).toBe(400);
    const responseBody = JSON.parse(result.body);
    expect(responseBody.message).toBe("Missing required fields");
  });

  it("should roll back the transaction in case of an error", async () => {
    // Simulate DB error by mocking ScheduleService
    jest
      .spyOn(ScheduleService.prototype, "createScheduleAndTasks")
      .mockRejectedValue(new Error("Database error"));

    const event: APIGatewayProxyEvent = {
      body: JSON.stringify({
        account_id: 1,
        agent_id: 2,
        start_time: "2024-12-18T08:00:00Z",
        end_time: "2024-12-18T10:00:00Z",
        tasks: [
          {
            account_id: 1,
            start_time: "2024-12-18T08:15:00Z",
            duration: 30,
            type: "work",
          },
        ],
      }),
    } as any;

    const result: APIGatewayProxyResult = await handler(event);

    expect(result.statusCode).toBe(500);
    const responseBody = JSON.parse(result.body);
    expect(responseBody.message).toBe("Internal Server Error");
  });
});
