import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Button,
  Form,
  Input,
  notification,
  Select,
  Divider,
  Row,
  Col,
  Modal,
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
  postCheckExistName,
  putData,
} from '../../../../api/jf-schedule';

function editJobfairSchedule() {
  const [form] = Form.useForm();
  const router = useRouter();
  const [beforeEditName, setbeforeEditName] = useState('');
  const [milestonesList, setMilestonesList] = useState([]);
  const [templateTaskList, setTemplateTaskList] = useState([]);
  const [addedMilestonesList, setAddedMilestonesList] = useState([]);
  const [addedTemplateTaskList, setAddedTemplateTaskList] = useState([]);
  const [nameInput, setNameInput] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(async () => {
    const temp = /[/](\d+)[/]/.exec(window.location.pathname);
    const id = `${temp[1]}`;

    await getSchedule(id)
      .then(({ data }) => {
        setbeforeEditName(data.name);
        setNameInput(data.name);
        form.setFieldsValue({
          jfschedule_name: data.name,
        });
      })
      .catch((err) => console.error(err));
    await getMilestonesList()
      .then(({ data }) => {
        setMilestonesList(data);
      })
      .catch((err) => console.error(err));
    await getTemplateTaskList()
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
        form.setFieldsValue({
          milestone_select: arr,
        });
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

  const onFinish = async () => {
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
    if (nameInput !== beforeEditName) {
      await postCheckExistName(dataSend)
        .then(({ data }) => {
          console.log(data);
          if (data === 'exist') {
            openNotification('error', 'このJFスケジュール名は存在しています。');
          } else {
            putData(id, dataSend)
              .then((res) => {
                console.log(res);
                if (res.status === 200)
                  openNotification('success', '変更は正常に保存されました。');
                setTimeout(() => {
                  router.push(`/jf-schedule/`);
                }, 2500);
              })
              .catch((err) => console.log(err));
          }
        })
        .catch((err) => console.log(err));
    } else {
      putData(id, dataSend)
        .then((res) => {
          console.log(res);
          if (res.status === 200)
            openNotification('success', '変更は正常に保存されました。');
          setTimeout(() => {
            router.push(`/jf-schedule/`);
          }, 2500);
        })
        .catch((err) => console.log(err));
    }
  };

  const onFinishFailed = (errorInfo) => {
    const { errorFields } = errorInfo;
    errorFields.forEach((itemError) => {
      itemError.errors.forEach((error) => openNotification('error', error));
    });
  };

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
    form.setFieldsValue({
      milestone_select: newState,
    });
  };

  const onAddTemplateTask = (id) => {
    console.log(`Add template task id:${id}`);
    let newState = [...addedTemplateTaskList, id];
    console.log(newState);
    setAddedTemplateTaskList(newState);
  };

  const selectMilestoneProps = {
    mode: 'multiple',
    optionFilterProp: 'label',
    // value: addedMilestonesList,
    options: milestonesOptions,
    onChange: (newValue) => {
      setAddedMilestonesList(newValue);
    },
    placeholder: 'マイルストーンを入力してください。',
    maxTagCount: 'responsive',
    showArrow: true,
  };

  const onValueNameChange = (e) => {
    setNameInput(e.target.value);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onBlur = async () => {
    const dataSend = {
      name: nameInput,
    };
    console.log(dataSend);
    if (nameInput !== beforeEditName) {
      await postCheckExistName(dataSend)
        .then(({ data }) => {
          console.log(data);
          if (data === 'exist') {
            form.setFields([
              {
                name: 'jfschedule_name',
                errors: ['このJFスケジュール名は存在しています。'],
              },
            ]);
          }
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <Layout>
      <Layout.Main>
        <h1>JFスケジュール編集</h1>
        <Form
          labelAlign="left"
          labelCol={{ span: 7 }}
          size="large"
          form={form}
          name="edit-jfschedule"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          requiredMark={'optional'}
        >
          <div className="w-1/2">
            <Form.Item
              label={
                <div className="flex items-center justify-between">
                  <ScheduleOutlined style={{ fontSize: '32px' }} />
                  <span className="ml-2">JFスケジュール名</span>
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
                onBlur={onBlur}
              />
            </Form.Item>
            <Form.Item
              label={
                <div className="flex items-center w-full">
                  <FlagOutlined style={{ fontSize: '32px' }} />
                  <span className="ml-2">マイルストーン</span>
                </div>
              }
              name="milestone_select"
              rules={[
                {
                  required: true,
                  message: 'マイルストーンを入力してください。',
                },
              ]}
            >
              <Select {...selectMilestoneProps} />
            </Form.Item>
          </div>
          <Divider />
          <Row gutter={[24, 24]}>
            {milestonesList.map((milestone) => {
              if (addedMilestonesList.includes(milestone.id)) {
                const templateTaskChildernList = _.filter(templateTaskList, {
                  milestone_id: milestone.id,
                });
                const templateTaskOptions = [];
                templateTaskChildernList.forEach((item) => {
                  let value = item.id;
                  templateTaskOptions.push({
                    label: item.name,
                    value,
                  });
                });
                const addedTemplateTaskChildernList = [];
                templateTaskChildernList.forEach((item) => {
                  if (_.includes(addedTemplateTaskList, item.id)) {
                    addedTemplateTaskChildernList.push(item.id);
                  }
                });

                return (
                  <Col span={12} key={milestone.id}>
                    <List
                      milestone={milestone}
                      templateTaskChildernList={templateTaskChildernList}
                      addedTemplateTaskChildernList={
                        addedTemplateTaskChildernList
                      }
                      templateTaskOptions={templateTaskOptions}
                      onDeleteTemplateTask={onDeleteTemplateTask}
                      onDeleteMilestone={onDeleteMilestone}
                      onAddTemplateTask={onAddTemplateTask}
                      selectName={`template_task_select_${milestone.id}`}
                      form={form}
                    />
                  </Col>
                );
              }
            })}
          </Row>

          <Form.Item>
            <div className="mt-5 flex justify-end">
              <Button className="mr-3">キャンセル</Button>
              <Button type="primary" htmlType="submit">
                保存
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Layout.Main>
    </Layout>
  );
}

export default editJobfairSchedule;
