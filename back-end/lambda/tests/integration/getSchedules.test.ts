import { handler } from "../../src/getSchedules";
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

  beforeEach(async () => {
    // Insert test data
    await prisma.schedule.create({
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
            {
              account_id: 12,
              start_time: "2024-12-18T08:15:00Z",
              duration: 55,
              type: "sleep",
            },
          ],
        },
      },
    });
  });

  afterAll(async () => {
    // Disconnect Prisma client after tests
    await prisma.$disconnect();
  });

  it("should get all the Schedules", async () => {
    const event: APIGatewayProxyEvent = {} as any;

    const result: APIGatewayProxyResult = await handler(event);

    expect(result.statusCode).toBe(200);
    const responseBody = JSON.parse(result.body);

    const schedule = responseBody[0];
    console.log(responseBody[0].tasks);

    expect(schedule.account_id).toBe(1);
    expect(schedule.agent_id).toBe(2);
    expect(schedule.tasks.length).toBe(2);

    const tasks = schedule.tasks;
    expect(tasks[0].type).toBe("work");
    expect(tasks[1].type).toBe("sleep");
  });

  it("should roll back the transaction in case of an error", async () => {
    // Simulate DB error by mocking ScheduleService
    jest
      .spyOn(ScheduleService.prototype, "getAllSchedules")
      .mockRejectedValue(new Error("Database error"));

    const event: APIGatewayProxyEvent = {} as any;

    const result: APIGatewayProxyResult = await handler(event);

    expect(result.statusCode).toBe(500);
    const responseBody = JSON.parse(result.body);
    expect(responseBody.message).toBe("Internal Server Error");
  });
});
