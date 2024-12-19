import { handler } from "../../src/updateTaskType";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { ScheduleService } from "../../src/services/scheduleService";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

// Load the test environment variables
dotenv.config({ path: ".env.local" });

//client to set up test data
const prisma = new PrismaClient();

describe("Handler Integration Test", () => {
  beforeAll(async () => {
    // Clear existing data from the Schedule and Task tables
    await prisma.task.deleteMany({});
    await prisma.schedule.deleteMany({});
  });

  afterAll(async () => {
    // Disconnect Prisma client after tests
    await prisma.$disconnect();
  });

  it("should sucessfully update for a existing task type", async () => {
    const createdSchedule = await prisma.schedule.create({
      data: {
        account_id: 1,
        agent_id: 2,
        start_time: "2024-12-18T08:00:00Z",
        end_time: "2024-12-18T10:00:00Z",
        tasks: {
          create: [
            {
              account_id: 11,
              start_time: "2024-12-18T08:15:00Z",
              duration: 23,
              type: "work",
            },
          ],
        },
      },
      include: {
        tasks: true, // Include the related `tasks` field
      },
    });

    const originalTask = createdSchedule.tasks[0];
    const newType: string = "sleep";
    const event: APIGatewayProxyEvent = {
      body: JSON.stringify({ taskId: originalTask.id, type: newType }),
    } as any;

    const result: APIGatewayProxyResult = await handler(event);

    expect(result.statusCode).toBe(200);

    const responseBody = JSON.parse(result.body);
    console.log(responseBody);
    expect(responseBody).toStrictEqual({
      ...originalTask,
      start_time: originalTask.start_time.toISOString(),
      type: newType,
    });
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

  it("should return and error for when task is not found ", async () => {
    const event: APIGatewayProxyEvent = {
      body: JSON.stringify({ taskId: "wrongId", type: "dance" }),
    } as any;

    const result: APIGatewayProxyResult = await handler(event);

    expect(result.statusCode).toBe(500);
    const responseBody = JSON.parse(result.body);
    expect(responseBody.message).toBe("Internal Server Error");
  });

  it("should serverreturn and error for when shedule is not found ", async () => {
    // Simulate DB error by mocking ScheduleService
    jest
      .spyOn(ScheduleService.prototype, "updateTask")
      .mockRejectedValue(new Error("Database error"));

    const createdSchedule = await prisma.schedule.create({
      data: {
        account_id: 1,
        agent_id: 2,
        start_time: "2024-12-18T08:00:00Z",
        end_time: "2024-12-18T10:00:00Z",
        tasks: {
          create: [
            {
              account_id: 11,
              start_time: "2024-12-18T08:15:00Z",
              duration: 23,
              type: "work",
            },
          ],
        },
      },
      include: {
        tasks: true, // Include the related `tasks` field
      },
    });

    const originalTask = createdSchedule.tasks[0];
    const newType: string = "sleep";
    const event: APIGatewayProxyEvent = {
      body: JSON.stringify({ taskId: originalTask.id, type: newType }),
    } as any;
    const result: APIGatewayProxyResult = await handler(event);

    expect(result.statusCode).toBe(500);
    const responseBody = JSON.parse(result.body);
    expect(responseBody.message).toBe("Internal Server Error");
  });
});
