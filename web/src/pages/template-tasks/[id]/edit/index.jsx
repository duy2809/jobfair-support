import React, { useState, useEffect } from 'react';
import OtherLayout from '../../../../layouts/OtherLayout';
import { Form, Input, Button, Modal, notification } from 'antd';
import ItemInput from '../../../../components/template-task-edit/form-item/input';
import CancelEditTemplateTask from '../../../../components/CancelEditTemplateTask';
import './style.scss';
import ItemDropdow from '../../../../components/template-task-edit/form-item/dropdown';
import ItemMultipleDropdown from '../../../../components/template-task-edit/form-item/multiple-dropdown';
import Effort from '../../../../components/template-task-edit/form-item/effort';
import Detail from '../../../../components/template-task-edit/form-item/detail';
import {
  getCategoryData,
  getTemplateTask,
  getMilestoneData,
  getNextTasks,
  getPrevTasks,
  updateTemplateTask,
  getTemplateTasksList,
} from '../../../../api/template-task-edit';
import './style.scss';

const unitData = [
  { id: 1, name: '学生数' },
  { id: 2, name: '企業数' },
  { id: 3, name: 'None' },
];

const isDayData = [
  { id: 0, name: '時間' },
  { id: 1, name: '日' },
];

const EditTemplateTaskPage = () => {
  const [categoryId, setCategoryId] = useState(0);
  const [milestoneId, setMilestoneId] = useState(0);
  const [isDay, setIsDay] = useState(0);
  const [unit, setUnit] = useState('');
  const [description, setDescription] = useState('');
  const [tasks, setTasks] = useState([]);
  const [pathId, setPathId] = useState('');
  const [categoryData, setCategoryData] = useState([]);
  const [milestoneData, setMilestoneData] = useState([]);
  const [prevTasks, setPrevTasks] = useState([]);
  const [nextTasks, setNextTasks] = useState([]);
  const [templateTaskNameInput, setTemplateTaskNameInput] = useState('');
  const [categoryInput, setCategoryInput] = useState('');
  const [milestoneInput, setMilestoneInput] = useState('');
  const [effortNumber, setEffortNumber] = useState('');
  const [form] = Form.useForm();
  const [checkSpace, setCheckSpace] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const fetchTemplateTask = async (id) => {
    await getTemplateTask(id).then((res) => {
      setTemplateTaskNameInput(res.data.name);
      let category_name;
      if (res.data.categories.length > 0) {
        setCategoryInput(res.data.categories[0].category_name);
        category_name = res.data.categories[0].category_name;
        setCategoryId(res.data.categories[0].id);
      } else {
        category_name = '';
      }
      setMilestoneInput(res.data.template_milestone.name);
      setMilestoneId(res.data.template_milestone.id);
      setDescription(res.data.description_of_detail);
      setEffortNumber(res.data.effort);
      setUnit(res.data.unit);
      setIsDay(res.data.is_day);

      form.setFieldsValue({
        templateTaskName: res.data.name,
        category: category_name,
        milestone: res.data.template_milestone.name,
        description: res.data.description_of_detail,
        effort: res.data.effort,
        unit: res.data.unit,
        is_day: isDayData[res.data.is_day].name,
      });
    });
  };

  const fetchCategoryData = async () => {
    await getCategoryData().then((res) => {
      setCategoryData((prevState) => (prevState = res.data));
    });
  };

  const fetchMilestoneData = async () => {
    await getMilestoneData().then((res) => {
      setMilestoneData((prevState) => (prevState = res.data));
    });
  };

  const fetchPrevTasks = async (id) => {
    await getPrevTasks(id).then((res) => {
      setPrevTasks((prevState) => (prevState = res.data.before_tasks));
      let value = [];
      res.data.before_tasks.forEach((item) => value.push(item.name));
      // setTasks((prevState) => prevState.concat(res.data.before_tasks));
      form.setFieldsValue({
        prevTasks: value,
      });
    });
  };

  const fetchNextTasks = async (id) => {
    await getNextTasks(id).then((res) => {
      setNextTasks(res.data.after_tasks);
      let value = [];
      res.data.after_tasks.forEach((item) => value.push(item.name));
      // setTasks((prevState) => prevState.concat(res.data.after_tasks));
      form.setFieldsValue({
        nextTasks: value,
      });
    });
  };

  const fetchTasks = async () => {
    await getTemplateTasksList().then((res) => {
      setTasks(res.data);
    });
  };

  const openNotificationSuccess = () => {
    notification.success({
      message: '変更は正常に保存されました。',
      duration: 0,
    });
    // setTimeout(() => {
    //   window.location.href = '/template-tasks';
    // }, 3000);
  };

  useEffect(async () => {
    const temp = /[/](\d+)[/]/.exec(window.location.pathname);
    const id = `${temp[1]}`;
    setPathId(id);

    fetchTemplateTask(id);
    fetchCategoryData();
    fetchMilestoneData();
    fetchPrevTasks(id);
    fetchNextTasks(id);
    fetchTasks();
  }, []);

  const showModal = () => {
    if (
      templateTaskNameInput !== '' &&
      categoryInput !== '' &&
      milestoneInput !== '' &&
      effortNumber !== 0 &&
      checkSpace === false
    ) {
      setIsModalVisible(true);
    }
  };

  const handleOk = () => {
    setIsModalVisible(false);
    const temp = /[/](\d+)[/]/.exec(window.location.pathname);
    const id = `${temp[1]}`;
    const newCategories = [
      {
        id: categoryId,
        category_name: categoryInput,
      },
    ];
    const newTemplate_milestone = {
      id: milestoneId,
      name: milestoneInput,
    };
    console.log(templateTaskNameInput);
    console.log(description);
    console.log(milestoneId);
    console.log(isDay);
    console.log(unit);
    console.log(effortNumber);
    console.log(newCategories);
    console.log(newTemplate_milestone);
    console.log(milestoneId);
    console.log(categoryId);
    console.log(prevTasks);
    console.log(nextTasks);
    let submitPrevTasks = [];
    let submitNextTasks = [];
    prevTasks.forEach((item) => submitPrevTasks.push(item.id));
    nextTasks.forEach((item) => submitNextTasks.push(item.id));
    console.log(submitPrevTasks);
    console.log(submitNextTasks);
    updateTemplateTask(id, {
      name: templateTaskNameInput,
      description_of_detail: description,
      milestone_id: milestoneId,
      is_day: isDay,
      unit: unit,
      effort: effortNumber,
      category_id: categoryId,
      beforeTasks: submitPrevTasks,
      afterTasks: submitNextTasks,
    })
      .then(() => openNotificationSuccess())
      .catch((error) => {
        // if (
        //   JSON.parse(error.response.request.response).errors.name[0] ===
        //   'The name has already been taken.'
        // ) {
        //   notification.error({
        //     message: 'このマイルストーン名は存在しています',
        //   });
        // }
        console.log(error);
        notification.error({
          message: 'Error',
        });
      });
    // window.location.href = '/template-tasks/' + id;
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  return (
    <div>
      <OtherLayout>
        <OtherLayout.Main>
          <>
            <p className='title mb-8' style={{ fontSize: '36px' }}>
              テンプレートタスク編集
            </p>
            <div className='h-screen flex flex-col items-center pt-10 bg-white my-8'>
              <Form
                form={form}
                name='basic'
                labelCol={{
                  span: 8,
                }}
                wrapperCol={{
                  span: 12,
                }}
                className='space-y-12 w-1/2'
              >
                <ItemInput
                  form={form}
                  label='タスクテンプレート名'
                  name='templateTaskName'
                  setCheckSpace={setCheckSpace}
                  setInput={setTemplateTaskNameInput}
                />
                <ItemDropdow
                  form={form}
                  label='カテゴリー'
                  name='category'
                  setCheckSpace={setCheckSpace}
                  data={categoryData}
                  setInput={setCategoryInput}
                  setId={setCategoryId}
                />
                <ItemDropdow
                  form={form}
                  label='マイルストーン'
                  name='milestone'
                  setCheckSpace={setCheckSpace}
                  data={milestoneData}
                  setInput={setMilestoneInput}
                  setId={setMilestoneId}
                />
                <Form.Item
                  label={
                    <p
                      style={{
                        color: '#2d334a',
                        fontSize: '18px',
                        alignItems: 'start',
                      }}
                    >
                      リレーション
                    </p>
                  }
                  labelAlign='left'
                  className='text-4xl justify-between'
                  required='true'
                >
                  <ItemMultipleDropdown
                    form={form}
                    label='前のタスク'
                    name='prevTasks'
                    options={tasks}
                    selectedItems={prevTasks}
                    setSelectedItems={setPrevTasks}
                  />
                  <ItemMultipleDropdown
                    form={form}
                    label='後のタスク'
                    name='nextTasks'
                    options={tasks}
                    selectedItems={nextTasks}
                    setSelectedItems={setNextTasks}
                  />
                </Form.Item>
                <Modal
                  title='マイルストーン編集'
                  visible={isModalVisible}
                  onOk={handleOk}
                  onCancel={handleCancel}
                  cancelText='いいえ'
                  okText='はい'
                  centered={true}
                >
                  <p className='mb-5'>このまま保存してもよろしいですか？ </p>
                </Modal>

                <Effort
                  form={form}
                  unitData={unitData}
                  isDayData={isDayData}
                  setCheckSpace={setCheckSpace}
                  setInput={setEffortNumber}
                  setUnit={setUnit}
                  setIsDay={setIsDay}
                ></Effort>

                <Detail
                  form={form}
                  input={description}
                  setInput={setDescription}
                />

                <Form.Item className=' justify-end '>
                  <div className='flex  my-10 '>
                    <CancelEditTemplateTask id={pathId} />
                    <Button
                      type='primary'
                      htmlType='submit'
                      className='text-base px-10 '
                      onClick={showModal}
                    >
                      保存
                    </Button>
                  </div>
                </Form.Item>
              </Form>
            </div>
          </>
        </OtherLayout.Main>
      </OtherLayout>
    </div>
  );
};

export default EditTemplateTaskPage;
