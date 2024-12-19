/*
Validation to user inputs
*/
export const isValidSchedule = (data: any): boolean => {
  // Check for required fields
  if (
    typeof data.account_id !== "number" ||
    typeof data.agent_id !== "number" ||
    !isValidDate(data.start_time) ||
    !isValidDate(data.end_time) ||
    (data.tasks && !Array.isArray(data.tasks))
  ) {
    return false;
  }
  // validate tasks array if present
  if (data.tasks) {
    for (const task of data.tasks) {
      if (!isValidTask(task)) return false;
    }
  }

  return true;
};

// Validate that start_time and end_time are valid dates
function isValidDate(date: any): date is Date {
  const parsedDate: Date = new Date(date);

  return parsedDate instanceof Date && !isNaN(parsedDate.getTime());
}

export const isValidTask = (task: any): boolean => {
  if (
    !isValidDate(task.start_time) ||
    typeof task.duration !== "number" ||
    typeof task.type !== "string"
  ) {
    return false;
  }
  return true;
};
