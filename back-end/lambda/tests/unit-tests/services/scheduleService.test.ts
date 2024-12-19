import { PrismaClient, Schedule, Task } from "@prisma/client";
import { ScheduleService } from "../../../src/services/scheduleService"; // Adjust the import path as needed

jest.mock("@prisma/client", () => {
  const mPrismaClient = {
    schedule: {
      create: jest.fn(),
    },
  };
  return {
    PrismaClient: jest.fn(() => mPrismaClient),
    Schedule: jest.fn(),
    Task: jest.fn(),
  };
});

describe("ScheduleService", () => {
  let scheduleService: ScheduleService;
  let prisma: PrismaClient;

  beforeEach(() => {
    scheduleService = new ScheduleService();
    prisma = new PrismaClient();
  });

  it("should create a schedule and tasks successfully", async () => {
    const mockData = {
      account_id: 1,
      agent_id: 2,
      start_time: new Date("2024-12-19T00:00:00Z"),
      end_time: new Date("2024-12-19T01:00:00Z"),
      tasks: [
        {
          account_id: 1,
          start_time: new Date("2024-12-19T00:30:00Z"),
          duration: 30,
          type: "task type",
        },
      ],
    };

    const expectedResult = {
      id: "123",
      ...mockData,
      tasks: mockData.tasks.map((task, index) => ({
        id: (index + 1).toString,
        ...task,
      })),
    };

    jest.mocked(prisma.schedule.create).mockResolvedValue(expectedResult);

    const result = await scheduleService.createScheduleAndTasks(mockData);

    expect(prisma.schedule.create).toHaveBeenCalledWith({
      data: {
        account_id: mockData.account_id,
        agent_id: mockData.agent_id,
        start_time: mockData.start_time,
        end_time: mockData.end_time,
        tasks: {
          create: mockData.tasks.map((task) => ({
            account_id: 0,
            start_time: new Date(),
            duration: 0,
            type: "",
          })),
        },
      },
      include: { tasks: true },
    });

    expect(result).toEqual(expectedResult);
  });

  it("should handle errors gracefully and throw an error", async () => {
    const mockData = {
      account_id: 1,
      agent_id: 2,
      start_time: new Date("2024-12-19T00:00:00Z"),
      end_time: new Date("2024-12-19T01:00:00Z"),
      tasks: [],
    };

    jest
      .mocked(prisma.schedule.create)
      .mockRejectedValue(new Error("Database error"));
    try {
      await scheduleService.createScheduleAndTasks(mockData);
    } catch (error) {
      if (error instanceof Error) {
        expect(error.message).toBe("Database error");
      } else {
        // If the error is not an instance of Error, fail the test
        throw new Error("Unexpected error type");
      }
    }
  });
});
