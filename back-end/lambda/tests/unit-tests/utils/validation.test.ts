import { isValidSchedule, isValidTask } from "../../../src/utils/validation"; // adjust path as needed

describe("isValidSchedule", () => {
  it("should return false if account_id is not a number", () => {
    const data = {
      account_id: "string",
      agent_id: 1,
      start_time: "2024-12-19T00:00:00Z",
      end_time: "2024-12-19T01:00:00Z",
      tasks: [],
    };
    expect(isValidSchedule(data)).toBe(false);
  });

  it("should return false if agent_id is not a number", () => {
    const data = {
      account_id: 1,
      agent_id: "string",
      start_time: "2024-12-19T00:00:00Z",
      end_time: "2024-12-19T01:00:00Z",
      tasks: [],
    };
    expect(isValidSchedule(data)).toBe(false);
  });

  it("should return false if start_time is not a valid date", () => {
    const data = {
      account_id: 1,
      agent_id: 1,
      start_time: "invalid date",
      end_time: "2024-12-19T01:00:00Z",
      tasks: [],
    };
    expect(isValidSchedule(data)).toBe(false);
  });

  it("should return false if end_time is not a valid date", () => {
    const data = {
      account_id: 1,
      agent_id: 1,
      start_time: "2024-12-19T00:00:00Z",
      end_time: "invalid date",
      tasks: [],
    };
    expect(isValidSchedule(data)).toBe(false);
  });

  it("should return false if tasks is not an array", () => {
    const data = {
      account_id: 1,
      agent_id: 1,
      start_time: "2024-12-19T00:00:00Z",
      end_time: "2024-12-19T01:00:00Z",
      tasks: "not an array",
    };
    expect(isValidSchedule(data)).toBe(false);
  });

  it("should return true if all fields are valid and tasks are valid", () => {
    const data = {
      account_id: 1,
      agent_id: 1,
      start_time: "2024-12-19T00:00:00Z",
      end_time: "2024-12-19T01:00:00Z",
      tasks: [
        { start_time: "2024-12-19T00:30:00Z", duration: 30, type: "task type" },
      ],
    };
    expect(isValidSchedule(data)).toBe(true);
  });

  it("should return false if tasks contain an invalid task", () => {
    const data = {
      account_id: 1,
      agent_id: 1,
      start_time: "2024-12-19T00:00:00Z",
      end_time: "2024-12-19T01:00:00Z",
      tasks: [{ start_time: "invalid date", duration: 30, type: "task type" }],
    };
    expect(isValidSchedule(data)).toBe(false);
  });
});

describe("isValidTask", () => {
  it("should return false if start_time is not a valid date", () => {
    const task = {
      start_time: "invalid date",
      duration: 30,
      type: "task type",
    };
    expect(isValidTask(task)).toBe(false);
  });

  it("should return false if duration is not a number", () => {
    const task = {
      start_time: "2024-12-19T00:30:00Z",
      duration: "not a number",
      type: "task type",
    };
    expect(isValidTask(task)).toBe(false);
  });

  it("should return false if type is not a string", () => {
    const task = {
      start_time: "2024-12-19T00:30:00Z",
      duration: 30,
      type: 123,
    };
    expect(isValidTask(task)).toBe(false);
  });

  it("should return true if task is valid", () => {
    const task = {
      start_time: "2024-12-19T00:30:00Z",
      duration: 30,
      type: "task type",
    };
    expect(isValidTask(task)).toBe(true);
  });
});
