import { APIGatewayProxyEvent } from "aws-lambda";
import { handler } from "../../../src/handlers/createSchedule"; // Adjust the import path
import { ScheduleService } from "../../../src/services/scheduleService";
import { createResponse } from "../../../src/utils/response";
import { isValidSchedule } from "../../../src/utils/validation";
import { Schedule, Task } from "@prisma/client";

jest.mock("../../../src/services/scheduleService", () => {
  const originalModule = jest.requireActual(
    "../../../src/services/scheduleService"
  );

  return {
    ...originalModule,
    ScheduleService: jest.fn().mockImplementation(() => {
      return {};
    }),
  };
});

jest.mock("../../../src/utils/response", () => ({
  createResponse: jest.fn(),
}));

jest.mock("../../../src/utils/validation", () => ({
  isValidSchedule: jest.fn(),
}));

describe("Lambda Handler", () => {
  ScheduleService.prototype.createScheduleAndTasks = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 201 and schedule data when the input is valid", async () => {
    const mockEvent = {
      body: JSON.stringify({
        account_id: 1,
        agent_id: 2,
        start_time: new Date().toISOString(),
        end_time: new Date().toISOString(),
        tasks: [
          {
            account_id: 1,
            start_time: new Date().toISOString(),
            duration: 30,
            type: "task",
          },
        ],
      }),
    } as APIGatewayProxyEvent;

    const mockScheduleData: Schedule & { tasks: Task[] } = {
      id: "123",
      account_id: 1,
      agent_id: 2,
      start_time: new Date(),
      end_time: new Date(),
      tasks: [
        {
          id: "1",
          account_id: 1,
          start_time: new Date(),
          duration: 30,
          type: "task",
          schedule_id: "123",
        },
      ],
    };

    jest.mocked(isValidSchedule).mockReturnValue(true);
    jest
      .mocked(ScheduleService.prototype.createScheduleAndTasks)
      .mockResolvedValue(mockScheduleData);
    jest.mocked(createResponse).mockReturnValue({
      statusCode: 201,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mockScheduleData),
    });

    const result = await handler(mockEvent);

    expect(isValidSchedule).toHaveBeenCalledWith(
      JSON.parse(mockEvent.body || "{}")
    );

    // expect(createResponse).toHaveBeenCalledWith(201, mockScheduleData);

    const responseBody = {
      ...mockScheduleData,
      end_time: mockScheduleData.end_time.toISOString(),
      start_time: mockScheduleData.start_time.toISOString(),
      tasks: mockScheduleData.tasks.map((task) => ({
        ...task,
        start_time: task.start_time.toISOString(),
      })),
    };
    expect(result.statusCode).toBe(201);
    expect(JSON.parse(result.body)).toEqual(responseBody);
  });
  // {"account_id": 1, "agent_id": 2, "end_time": "2024-12-19T01:40:22.926Z", "id": "123", "start_time": "2024-12-19T01:40:22.926Z", "tasks": [{"account_id": 1, "duration": 30, "id": "1", "schedule_id": "123", "start_time": "2024-12-19T01:40:22.926Z", "type": "task"}]}

  //   it("should return 400 if the input is invalid", async () => {
  //     const mockEvent = {
  //       body: JSON.stringify({}),
  //     } as APIGatewayProxyEvent;

  //     // Mock invalid schedule
  //     mockIsValidSchedule.mockReturnValue(false);

  //     const result = await handler(mockEvent);

  //     expect(mockIsValidSchedule).toHaveBeenCalledWith({});
  //     expect(mockCreateResponse).toHaveBeenCalledWith(400, {
  //       message: "Missing required fields",
  //     });

  //     expect(result.statusCode).toBe(400);
  //     expect(JSON.parse(result.body).message).toBe("Missing required fields");
  //   });

  //   it("should return 500 if there is an internal server error", async () => {
  //     const mockEvent = {
  //       body: JSON.stringify({
  //         account_id: 1,
  //         agent_id: 2,
  //         start_time: new Date().toISOString(),
  //         end_time: new Date().toISOString(),
  //       }),
  //     } as APIGatewayProxyEvent;

  //     // Mock successful validation, but simulate service failure
  //     mockIsValidSchedule.mockReturnValue(true);
  //     mockCreateScheduleAndTasks.mockRejectedValue(new Error("Database error"));

  //     const result = await handler(mockEvent);

  //     expect(mockIsValidSchedule).toHaveBeenCalledWith(
  //       JSON.parse(mockEvent.body || "{}")
  //     );
  //     expect(mockCreateScheduleAndTasks).toHaveBeenCalledWith(
  //       JSON.parse(mockEvent.body || "{}")
  //     );
  //     expect(mockCreateResponse).toHaveBeenCalledWith(500, {
  //       message: "Internal Server Error",
  //     });

  //     expect(result.statusCode).toBe(500);
  //     expect(JSON.parse(result.body).message).toBe("Internal Server Error");
  //   });
});
