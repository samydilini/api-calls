/**
 * validate shedule user input
 * @param data user input
 * @returns boolean of if input is validated or not
 */
export const isValidSchedule = (data: any): boolean => {
  // Check for required fields
  console.log("validation started", data);
  if (
    typeof data.account_id !== "number" ||
    typeof data.agent_id !== "number" ||
    !isValidDate(data.start_time) ||
    !isValidDate(data.end_time) ||
    (data.tasks && !Array.isArray(data.tasks))
  ) {
    console.error("Schedule validation failer");
    return false;
  }
  console.log("shedule validation passed");
  // validate tasks array if present
  if (data.tasks) {
    for (const task of data.tasks) {
      if (!isValidTask(task)) return false;
    }
  }

  return true;
};

/**
 * Validate that start_time and end_time are valid dates
 * @param date inpout to be validated
 * @returns boolean of if date input is validated or not
 */
function isValidDate(date: any): date is Date {
  const parsedDate: Date = new Date(date);

  return parsedDate instanceof Date && !isNaN(parsedDate.getTime());
}

export const isValidTask = (task: any): boolean => {
  console.log("task validation started", task);
  if (
    !isValidDate(task.start_time) ||
    typeof task.duration !== "number" ||
    typeof task.type !== "string"
  ) {
    console.error("Task validation failer");
    return false;
  }
  console.log("task validated");
  return true;
};

/**
 * validated task type update request body
 * @param data user input
 * @returns boolean validitiy of the data
 */
export const isValidTaskUpdateRequest = (data: any): boolean => {
  console.log("validation started", data);
  if (
    !data ||
    typeof data.taskId !== "string" ||
    typeof data.type !== "string"
  ) {
    console.error("Task update request validation failer");
    return false;
  }
  console.log("Task update request passed");
  return true;
};
