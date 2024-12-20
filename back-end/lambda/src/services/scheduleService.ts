import { PrismaClient, Schedule, Task } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Service layer for handling schedules
 */
export class ScheduleService {
  /**
   * creates a Schedule
   * @param data  validated user input of the schedule
   * @returns created schedule
   */
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

  /**
   * returns all schedules with their tasks
   * @returns schedules in db
   */
  async getAllSchedules(): Promise<Schedule[]> {
    return await prisma.schedule.findMany({
      include: {
        tasks: true, // Include related tasks
      },
    });
  }

  /**
   * delete a shedule and all it's associated tasks
   * @param id shedule id to be deleted
   */
  async deleteSchedule(id: string) {
    // Delete all tasks associated with the schedule
    await prisma.task.deleteMany({
      where: {
        schedule_id: id,
      },
    });

    await prisma.schedule.delete({
      where: {
        id: id,
      },
    });
  }

  /**
   * updates task's type with id
   * @param body has task id and new type
   * @returns updated task
   */
  async updateTask(body: any): Promise<Task> {
    return await prisma.task.update({
      where: {
        id: body.taskId,
      },
      data: {
        type: body.type,
      },
    });
  }
}
