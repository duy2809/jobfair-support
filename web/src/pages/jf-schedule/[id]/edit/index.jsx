import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  Button,
  Form,
  Input,
  notification,
  Select,
  Divider,
  Row,
  Col,
} from 'antd';
import List from '../../../../components/jf-schedule-edit-list';
import { ScheduleOutlined, FlagOutlined } from '@ant-design/icons';
import Layout from '~/layouts/OtherLayout';
import _ from 'lodash';
import './styles.scss';
import {
  getMilestonesList,
  getSchedule,
  getTemplateTaskList,
  getAddedMilestonesList,
  getAddedTemplateTaskList,
  putData,
} from '../../../../api/jf-schedule';

function editJobfairSchedule() {
  const [form] = Form.useForm();
  const { Option } = Select;
  // const router = useRouter()
  // const { id } = router.query
  // console.log(id)
  // const [jfScheduleData, setJfScheduleData] = useState({});

  const [milestonesList, setMilestonesList] = useState([]);
  const [templateTaskList, setTemplateTaskList] = useState([]);
  const [addedMilestonesList, setAddedMilestonesList] = useState([]);
  const [addedTemplateTaskList, setAddedTemplateTaskList] = useState([]);
  const [nameInput, setNameInput] = useState('');

  // API GET 1: /api/schedules/1
  // const jfscheduleData = {
  //   id: 1,
  //   name: 'JF Schedule 1',
  //   jobfair_id: 2,
  // };

  // API POST: /api/schedules/1
  const dataSend = {
    schedule: {
      name: 'JF Schedule 1',
    },
    addedMilestonesList: [1, 2, 3, 4],
    addedTemplateTaskList: [1, 3, 5, 6],
  };

  useEffect(async () => {
    const temp = /[/](\d+)[/]/.exec(window.location.pathname);
    const id = `${temp[1]}`;

    await getSchedule(id)
      .then(({ data }) => {
        setNameInput(data.name);
        form.setFieldsValue({
          jfschedule_name: data.name,
        });
      })
      .catch((err) => console.error(err));
    await getMilestonesList(id)
      .then(({ data }) => {
        setMilestonesList(data);
      })
      .catch((err) => console.error(err));
    await getTemplateTaskList(id)
      .then(({ data }) => {
        setTemplateTaskList(data);
      })
      .catch((err) => console.error(err));
    await getAddedMilestonesList(id)
      .then(({ data }) => {
        let arr = [];
        data.forEach((item) => {
          arr.push(item.id);
        });
        setAddedMilestonesList(arr);
      })
      .catch((err) => console.error(err));
    await getAddedTemplateTaskList(id)
      .then(({ data }) => {
        let arr = [];
        data.forEach((item) => {
          arr.push(item.id);
        });
        setAddedTemplateTaskList(arr);
      })
      .catch((err) => console.error(err));
  }, []);

  const openNotification = (type, message, description) => {
    notification[type]({
      message,
      description,
      duration: 2.5,
    });
  };

  const milestonesOptions = [];
  milestonesList.forEach((item) => {
    let value = item.id;
    milestonesOptions.push({
      label: item.name,
      value,
    });
  });

  const onFinish = async (values) => {
    // try {
    //   const response = await login(values);
    //   if (response.request.status === 200)
    //     openNotification('success', '正常にログインしました');
    //   setTimeout(() => {
    //     router.push('/top-page');
    //   }, 2500);
    // } catch (error) {
    //   if (error.request.status === 400) {
    //     openNotification(
    //       'error',
    //       'メールアドレスもしくはパスワードが間違っています',
    //     );
    //   }
    // }
  };

  const onFinishFailed = (errorInfo) => {
    openNotification('error', errorInfo);
  };

  function onChange(value) {
    console.log(`selected ${value}`);
  }

  function onBlur() {
    console.log('blur');
  }

  function onFocus() {
    console.log('focus');
  }

  function onSearch(val) {
    console.log('search:', val);
  }

  const onDeleteTemplateTask = (id) => {
    console.log(`Delete template task id:${id}`);
    const newState = _.filter(addedTemplateTaskList, (item) => item !== id);
    console.log(newState);
    setAddedTemplateTaskList(newState);
  };

  const onDeleteMilestone = (id) => {
    console.log(`Delete milestone id:${id}`);
    const newState = _.filter(addedMilestonesList, (item) => item !== id);
    console.log(newState);
    setAddedMilestonesList(newState);
  };

  const onAddTemplateTask = (id) => {
    console.log(`Add template task id:${id}`);
    let newState = [...addedTemplateTaskList, id];
    console.log(newState);
    setAddedTemplateTaskList(newState);
  };

  const selectMilestoneProps = {
    mode: 'multiple',
    style: { width: '100%' },
    value: addedMilestonesList,
    options: milestonesOptions,
    onChange: (newValue) => {
      setAddedMilestonesList(newValue);
    },
    placeholder: 'マイルストーン. . .',
    maxTagCount: 'responsive',
    size: 'large',
  };

  const onValueNameChange = (e) => {
    setNameInput(e.target.value);
    console.log(nameInput);
  };

  const onHandleSubmit = async () => {
    const temp = /[/](\d+)[/]/.exec(window.location.pathname);
    const id = `${temp[1]}`;
    const dataSend = {
      schedule: {
        name: nameInput,
      },
      addedMilestones: addedMilestonesList,
      addedTemplateTasks: addedTemplateTaskList,
    };
    console.log(dataSend);
    await putData(id, dataSend)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err));
  };

  return (
    <Layout>
      <Layout.Main>
        <h1>JFスケジュール編集</h1>
        <Form
          form={form}
          name="edit-jfschedule"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          className="w-1/2"
          requiredMark={'optional'}
        >
          <Form.Item
            label={
              <div className="flex items-center w-full">
                <ScheduleOutlined style={{ fontSize: '32px' }} />
                <p className="ml-2">JFスケジュール名</p>
              </div>
            }
            name="jfschedule_name"
            rules={[
              {
                required: true,
                message: 'JFスケジュール名を入力してください。',
              },
            ]}
          >
            <Input
              placeholder="JFスケジュール名を入力してください。"
              onChange={onValueNameChange}
            />
          </Form.Item>
        </Form>

        <div className="flex items-center w-1/2 justify-between selectWrapper">
          <div className="flex items-center">
            <FlagOutlined style={{ fontSize: '32px' }} />
            <p
              className="ml-2 mr-5"
              style={{
                'white-space': 'nowrap',
                overflow: 'hidden',
              }}
            >
              マイルストーン :
            </p>
          </div>
          <Select {...selectMilestoneProps} />
        </div>
        <Divider />

        <Row gutter={[24, 24]}>
          {milestonesList.map((milestone) => {
            if (addedMilestonesList.includes(milestone.id))
              return (
                <Col span={12} key={milestone.id}>
                  <List
                    milestone={milestone}
                    templateTaskParentList={templateTaskList}
                    addedTemplateTaskParentList={addedTemplateTaskList}
                    onDeleteTemplateTask={onDeleteTemplateTask}
                    onDeleteMilestone={onDeleteMilestone}
                    onAddTemplateTask={onAddTemplateTask}
                  />
                </Col>
              );
          })}
        </Row>
        <div className="mt-5 flex justify-end">
          <Button className="mr-3">キャンセル</Button>
          <Button type="primary" onClick={onHandleSubmit}>
            保存
          </Button>
        </div>
      </Layout.Main>
    </Layout>
  );
}

export default editJobfairSchedule;
