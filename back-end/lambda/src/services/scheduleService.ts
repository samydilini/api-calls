import { PrismaClient, Schedule, Task } from "@prisma/client";

const prisma = new PrismaClient();
/* 
Service layer for handling schedules
*/
export class ScheduleService {
  async createScheduleAndTasks(
    data: Partial<Schedule> & { tasks?: Partial<Task>[] }
  ): Promise<Schedule> {
    const {
      account_id = 0,
      agent_id = 0,
      start_time = new Date(),
      end_time = new Date(),
      tasks = [],
    } = data;

    // Ensure tasks are mapped correctly
    const taskData = tasks.map((task) => ({
      account_id: task.account_id || 0,
      start_time: task.start_time || new Date(),
      duration: task.duration || 0,
      type: task.type || "",
    }));

    try {
      return await prisma.schedule.create({
        data: {
          account_id,
          agent_id,
          start_time,
          end_time,
          tasks: {
            create: taskData,
          },
        },
        include: {
          tasks: true,
        },
      });
    } catch (error) {
      console.error("Error in transaction:", error);
      throw error;
    }
  }

  async getAllSchedules(): Promise<Schedule[]> {
    return await prisma.schedule.findMany({
      include: {
        tasks: true, // Include related tasks
      },
    });
  }
}
