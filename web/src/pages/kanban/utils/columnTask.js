const singleTask = (type, taskIds) => {
  const obj = {}
  obj[type] = {
    id: type,
    title: type,
    taskIds,
  }
  return obj
}

export const columnTask = (type, data) => {
  const taskIds = data.filter((el) => el.status === type).map((el) => el.id)
  return singleTask(type, taskIds)
}
