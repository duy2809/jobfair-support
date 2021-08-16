import React, { useEffect, useState, useRef } from "react";
import Navbar from "../../components/navbar";
import List from "../../components/list";
import { tasks, members, jobfairs } from "../../api/top-page";
import { getTaskList } from "../../api/template-task";
import { ListScheduleApi } from "../../api/schedule";

const { getListShedule } = ListScheduleApi;

const jfListDataColumn = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Time",
    dataIndex: "time",
    key: "time",
  },
];

const memListDataColumn = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
];

const jfScheduleDataColumn = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
];

const templateTaskDataColumn = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Category",
    dataIndex: "category",
    key: "category",
  },
  {
    title: "Milestone",
    dataIndex: "milestone",
    key: "milestone",
  },
];

const taskListDataColumn = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Type",
    dataIndex: "type",
    key: "type",
  },
  {
    title: "Time",
    dataIndex: "time",
    key: "time",
  },
];

const Top = () => {
  const ref = useRef();
  const [taskData, setTaskData] = useState([]);
  const taskDataItem = [];

  const [memberData, setMemberData] = useState([]);
  const memberDataItem = [];

  const [jobfairData, setJobfairData] = useState([]);
  const jobfairDataItem = [];

  //   const [scheduleData, setScheduleData] = useState([]);
  //   const scheduleDataItem = [];

  //   const [templateTaskData, setTemplateTaskData] = useState([]);
  //   const templateTaskDataItem = [];
  const [templateData, setTemplateData] = useState([]);
  const [scheduleData, setScheduleData] = useState([]);

  useEffect(() => {
    const getTask = async () => {
      const response = await tasks();
      setTaskData(response.data);
    };

    const getMember = async () => {
      const response = await members();
      setMemberData(response.data);
    };

    const getJobfair = async () => {
      const response = await jobfairs();
      setJobfairData(response.data);
    };

    const getTemplate = async () => {
      await getTaskList().then((res) => {
        const datas = [];
        res.data.forEach((data) => {
          const categoriesName = data.categories.map(
            (category) => category.category_name
          );
          categoriesName.forEach((categoryName) => {
            datas.push({
              name: data.name,
              category: categoryName,
              milestone: data.template_milestone.name,
            });
          });
        });
        setTemplateData(datas);
      });
    };

    const getSchedule = async function () {
      let dataItem = [];
      await getListShedule().then((res) => {
        dataItem = res.data.map((data) => ({ name: data.name }));
      });
      setScheduleData(dataItem);
    };

    getTask();
    getMember();
    getJobfair();
    getTemplate();
    getSchedule();
  }, []);

  jobfairData.forEach((jobfair) => {
    const jobfairItem = { key: "", name: "", time: "" };
    jobfairItem.key = jobfair.id;
    jobfairItem.name = jobfair.name;
    jobfairItem.time = jobfair.start_date;

    jobfairDataItem.push(jobfairItem);
  });

  memberData.forEach((member) => {
    const memberItem = { key: "", name: "" };
    memberItem.key = member.id;
    memberItem.name = member.name;

    memberDataItem.push(memberItem);
  });

  taskData.forEach((task) => {
    const taskItem = { key: "", name: "", type: "", time: "" };
    taskItem.key = task.id;
    taskItem.name = task.name;
    taskItem.type = task.status;
    taskItem.time = task.start_time;

    taskDataItem.push(taskItem);
  });
  return (
    <div ref={ref}>
      <Navbar />
      <div style={{ width: "90%", margin: "auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "50% 50%",
            gridGap: "20px",
            width: "100%",
          }}
        >
          <List
            key={1}
            dataColumn={jfListDataColumn}
            dataSource={jobfairDataItem}
            text="JF一覧"
            searchIcon
            showTimeInput
            showCategoryInput={false}
            showMilestoneInput={false}
          />
          <List
            key={2}
            dataColumn={memListDataColumn}
            dataSource={memberDataItem}
            text="メンバ一覧"
            searchIcon
            showTimeInput={false}
            showCategoryInput={false}
            showMilestoneInput={false}
          />
          <List
            key={3}
            dataColumn={jfScheduleDataColumn}
            dataSource={scheduleData}
            text="JFスケジュール一覧"
            searchIcon
            showTimeInput={false}
            showCategoryInput={false}
            showMilestoneInput={false}
          />
          <List
            key={4}
            dataColumn={templateTaskDataColumn}
            text="テンプレートタスク詳細"
            dataSource={templateData}
            searchIcon
            showTimeInput={false}
            showCategoryInput
            showMilestoneInput
          />
          <List
            key={5}
            dataColumn={taskListDataColumn}
            dataSource={taskDataItem}
            text="マスク一覧"
            searchIcon
            showTimeInput
            showCategoryInput={false}
            showMilestoneInput={false}
            showSearchByJFInput
          />
        </div>
      </div>
    </div>
  );
};
Top.middleware = ["auth:superadmin", "auth:admin", "auth:member"];
export default Top;
