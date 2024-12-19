import { handler } from "../../src/deleteSchedule";
import { APIGatewayProxyResult } from "aws-lambda";
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

  it("should sucessfully delete for a existing id", async () => {
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

    const event: any = { pathParameters: { id: createdSchedule.id } } as any;

    const result: APIGatewayProxyResult = await handler(event);

    expect(result.statusCode).toBe(200);
    const responseBody = JSON.parse(result.body);
    expect(responseBody).toBe(
      `Schedule with ${createdSchedule.id} was sucessfully deleted`
    );
  });

  it("should return and error for when shedule is not found ", async () => {
    const event: any = { pathParameters: { id: "wrongId" } } as any;

    const result: APIGatewayProxyResult = await handler(event);

    expect(result.statusCode).toBe(500);
    const responseBody = JSON.parse(result.body);
    expect(responseBody.message).toBe("Internal Server Error");
  });

  it("should serverreturn and error for when shedule is not found ", async () => {
    // Simulate DB error by mocking ScheduleService
    jest
      .spyOn(ScheduleService.prototype, "deleteSchedule")
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

    const event: any = { pathParameters: { id: createdSchedule.id } } as any;
    const result: APIGatewayProxyResult = await handler(event);

    expect(result.statusCode).toBe(500);
    const responseBody = JSON.parse(result.body);
    expect(responseBody.message).toBe("Internal Server Error");
  });
});
