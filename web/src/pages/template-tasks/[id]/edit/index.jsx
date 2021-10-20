import React, { useState, useEffect } from 'react'
import { Form, Button, notification, Tag, Tooltip, Space } from 'antd'
import dynamic from 'next/dynamic'
import OtherLayout from '../../../../layouts/OtherLayout'
import ItemInput from '../../../../components/template-task-edit/form-item/input'
import CancelEditTemplateTask from '../../../../components/CancelEditTemplateTask'
import './style.scss'
import ItemDropdow from '../../../../components/template-task-edit/form-item/dropdown'
import ItemMultipleDropdown from '../../../../components/template-task-edit/form-item/multiple-dropdown'
import Effort from '../../../../components/template-task-edit/form-item/effort'
import {
  getCategoryData,
  getTemplateTask,
  getMilestoneData,
  getNextTasks,
  getPrevTasks,
  updateTemplateTask,
  getTemplateTasksList,
} from '../../../../api/template-task-edit'
import MarkDownView from '../../../../components/markDownView'

const MDEditor = dynamic(
  // eslint-disable-next-line import/no-unresolved
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false },
)

const unitData = [
  { id: 1, name: '学生数', sumbit: 'students' },
  { id: 2, name: '企業数', submit: 'companies' },
  { id: 3, name: 'None', submit: 'none' },
]

const isDayData = [
  { id: 0, name: '時間' },
  { id: 1, name: '日' },
]

let tasksList = []
getTemplateTasksList().then((res) => {
  tasksList = [...res.data]
})

const EditTemplateTaskPage = () => {
  const [categoryId, setCategoryId] = useState(0)
  const [milestoneId, setMilestoneId] = useState()
  const [isDay, setIsDay] = useState(0)
  const [unit, setUnit] = useState('')
  const [description, setDescription] = useState('')
  const [tasks1, setTasks1] = useState([])
  const [tasks2, setTasks2] = useState([])
  const [pathId, setPathId] = useState('')
  const [categoryData, setCategoryData] = useState([])
  const [milestoneData, setMilestoneData] = useState([])
  const [prevTasks, setPrevTasks] = useState([])
  const [nextTasks, setNextTasks] = useState([])
  const [templateTaskNameInput, setTemplateTaskNameInput] = useState('')
  const [categoryInput, setCategoryInput] = useState('')
  const [milestoneInput, setMilestoneInput] = useState('')
  const [effortNumber, setEffortNumber] = useState('')
  const [form] = Form.useForm()
  const [checkSpace, setCheckSpace] = useState(false)
  // const [isModalVisible, setIsModalVisible] = useState(false)

  const fetchTemplateTask = async (id) => {
    await getTemplateTask(id).then((res) => {
      setTemplateTaskNameInput(res.data.name)
      let categoryName
      if (res.data.categories.length > 0) {
        setCategoryInput(res.data.categories[0].category_name)
        categoryName = res.data.categories[0].category_name
        setCategoryId(res.data.categories[0].id)
      } else {
        categoryName = ''
      }
      setMilestoneInput(res.data.milestone.name)
      setMilestoneId(res.data.milestone.id)
      setDescription(res.data.description_of_detail)
      setEffortNumber(res.data.effort)
      if (res.data.unit === 'students') {
        setUnit('学生数')
      } else {
        setUnit('企業数')
      }
      setIsDay(res.data.is_day)

      form.setFieldsValue({
        templateTaskName: res.data.name,
        category: categoryName,
        milestone: res.data.milestone.name,
        description: res.data.description_of_detail,
        effort: res.data.effort,
        unit,
        is_day: isDayData[res.data.is_day].name,
      })
    })
  }

  const fetchCategoryData = async () => {
    await getCategoryData().then((res) => {
      setCategoryData(res.data)
    })
  }

  const fetchMilestoneData = async () => {
    await getMilestoneData().then((res) => {
      setMilestoneData(res.data)
    })
  }

  const fetchPrevTasks = async (id) => {
    await getPrevTasks(id).then((res) => {
      setPrevTasks(res.data.before_tasks)
      const value = []
      res.data.before_tasks.forEach((item) => value.push(item.name))
      form.setFieldsValue({
        prevTasks: value,
      })
    })
  }

  const fetchNextTasks = async (id) => {
    await getNextTasks(id).then((res) => {
      setNextTasks(res.data.after_tasks)
      const value = []
      res.data.after_tasks.forEach((item) => value.push(item.name))
      form.setFieldsValue({
        nextTasks: value,
      })
    })
  }

  const fetchTasks = async () => {
    const temp = /[/](\d+)[/]/.exec(window.location.pathname)
    const id = `${temp[1]}`
    await setTasks1(
      tasksList.filter((o) => o.id !== Number(id) && !nextTasks.find((item) => item.id === o.id)),
    )
    await setTasks2(
      tasksList.filter((o) => o.id !== Number(id) && !prevTasks.find((item) => item.id === o.id)),
    )
  }

  const openNotificationSuccess = () => {
    if (
      templateTaskNameInput !== ''
      && categoryInput !== ''
      && milestoneInput !== ''
      && effortNumber !== 0
      && checkSpace === false
    ) {
      notification.success({
        message: '変更は正常に保存されました。',
        duration: 3,
      })
    }
  }

  useEffect(async () => {
    const temp = /[/](\d+)[/]/.exec(window.location.pathname)
    const id = `${temp[1]}`
    setPathId(id)
    fetchTemplateTask(id)
    fetchCategoryData()
    fetchMilestoneData()
    fetchPrevTasks(id)
    fetchNextTasks(id)
    fetchTasks()
  }, [])

  useEffect(() => {
    const temp = /[/](\d+)[/]/.exec(window.location.pathname)
    const id = `${temp[1]}`
    setTasks1(
      tasksList.filter((o) => o.id !== Number(id) && !nextTasks.find((item) => item.id === o.id)),
    )
    setTasks2(
      tasksList.filter((o) => o.id !== Number(id) && !prevTasks.find((item) => item.id === o.id)),
    )
  }, [prevTasks, nextTasks])

  // const showModal = () => {
  //   if (
  //     templateTaskNameInput !== ''
  //     && categoryInput !== ''
  //     && milestoneInput !== ''
  //     && effortNumber !== 0
  //     && checkSpace === false
  //   ) {
  //     setIsModalVisible(true)
  //   }
  // }

  const handleOk = () => {
    // setIsModalVisible(false)
    const temp = /[/](\d+)[/]/.exec(window.location.pathname)
    const id = `${temp[1]}`
    const submitPrevTasks = []
    const submitNextTasks = []
    prevTasks.forEach((item) => submitPrevTasks.push(item.id))
    nextTasks.forEach((item) => submitNextTasks.push(item.id))
    updateTemplateTask(id, {
      name: templateTaskNameInput,
      description_of_detail: description,
      milestone_id: milestoneId,
      is_day: isDay,
      unit,
      effort: effortNumber,
      category_id: categoryId,
      beforeTasks: submitPrevTasks,
      afterTasks: submitNextTasks,
    })
      .then(() => {
        openNotificationSuccess()
        window.location.href = `/template-task-dt/${id}`
      })
      .catch((error) => {
        if (JSON.parse(error.response.request.response).message === 'Edit Failed') {
          notification.error({
            message: 'このテンプレートタスク名は存在しています',
            duration: 3,
          })
        }
        // notification.error({
        //   message: 'Error',
        // });
      })
  }
  // const handleCancel = () => {
  //   setIsModalVisible(false)
  // }
  const truncate = (input) => (input.length > 21 ? `${input.substring(0, 21)}...` : input)
  const [isPreview, setIsPreview] = useState(false)
  const [dataPreview, setDataPreview] = useState([])
  const checkIsFormInputNotEmpty = () => {
    // get all input values .
    const inputValues = form.getFieldsValue()
    //  return type :[]
    const inputs = Object.values(inputValues)

    for (let i = 0; i < inputs.length; i += 1) {
      const element = inputs[i]
      if (!element) {
        return false
      }
    }
    return true
  }
  const onFinishFail = () => {
    setIsPreview(false)
  }
  const onPreview = () => {
    if (checkIsFormInputNotEmpty) {
      setIsPreview(true)
      const data = {
        name: templateTaskNameInput,
        description_of_detail: description,
        milestone: milestoneInput,
        is_day: isDayData[isDay].name,
        unit,
        effort: effortNumber,
        category: categoryInput,
      }
      setDataPreview(data)
    }
  }
  return (
    <div>
      <OtherLayout>
        <OtherLayout.Main>
          <div className="edit-template-task">
            <h1>テンプレートタスク編集</h1>
            {/* <div className="h-screen flex flex-col items-center pt-10 bg-white my-8"> */}
            <div className="h-screen flex flex-col items-center pt-10 bg-white my-8">
              <Form
                form={form}
                name="basic"
                labelCol={{
                  span: 6,
                }}
                wrapperCol={{
                  span: 16,
                }}
                className="space-y-12 w-5/6"
                onFinishFailed={onFinishFail}
              >
                <div className="grid grid-cols-2">
                  <div className="col-span-1 ml-5 2xl:ml-8">
                    <Form.Item
                      label="テンプレートタスク名"
                      required={!isPreview}
                    >
                      <ItemInput
                        form={form}
                        name="templateTaskName"
                        setCheckSpace={setCheckSpace}
                        setInput={setTemplateTaskNameInput}
                        display={isPreview}
                      />
                      <p style={{ display: isPreview ? '' : 'none' }}>{dataPreview.name}</p>
                    </Form.Item>
                  </div>
                  <div className="col-span-1 ml-8">
                    <Form.Item label="カテゴリ" required={!isPreview}>
                      <ItemDropdow
                        form={form}
                        name="category"
                        setCheckSpace={setCheckSpace}
                        data={categoryData}
                        setInput={setCategoryInput}
                        setId={setCategoryId}
                        display={isPreview}
                      />
                      <p style={{ display: isPreview ? '' : 'none' }}>{dataPreview.category}</p>
                    </Form.Item>
                  </div>
                  <div className="col-span-1 ml-8">
                    <Form.Item label="マイルストーン" required={!isPreview}>
                      <ItemDropdow
                        form={form}
                        name="milestone"
                        setCheckSpace={setCheckSpace}
                        data={milestoneData}
                        setInput={setMilestoneInput}
                        setId={setMilestoneId}
                        display={isPreview}
                      />
                      <p style={{ display: isPreview ? '' : 'none' }}>{dataPreview.milestone}</p>
                    </Form.Item>
                  </div>
                  <div className="col-span-1 ml-8">
                    <Form.Item label="工数" required={!isPreview}>
                      <Effort
                        form={form}
                        unitData={unitData}
                        isDayData={isDayData}
                        setCheckSpace={setCheckSpace}
                        setInput={setEffortNumber}
                        setUnit={setUnit}
                        setIsDay={setIsDay}
                        display={isPreview}
                      />
                      <p style={{ display: isPreview ? '' : 'none' }}>
                        {dataPreview.effort}
                        {' '}
                        &nbsp;
                        {' '}
                        {dataPreview.is_day}
                        /
                        {dataPreview.unit}
                      </p>
                    </Form.Item>
                  </div>
                  <div className="col-span-1 ml-8">
                    <Form.Item label="前のタスク">
                      <ItemMultipleDropdown
                        form={form}
                        name="prevTasks"
                        options={tasks1}
                        selectedItems={prevTasks}
                        setSelectedItems={setPrevTasks}
                        display={isPreview}
                      />
                      {prevTasks
                        ? (
                          <ul
                            className="list__task col-span-2"
                            style={{ border: '1px solid #d9d9d9', display: isPreview ? '' : 'none' }}
                          >
                            {prevTasks.map((element) => (
                              <li className="task__chil">
                                <Tag
                                  style={{
                                    marginRight: 3,
                                    paddingTop: '5px',
                                    paddingBottom: '3px',
                                  }}
                                >
                                  <Tooltip placement="top" title={element.name}>
                                    <div className="inline-block text-blue-600 whitespace-nowrap">
                                      {truncate(element.name)}
                                    </div>
                                  </Tooltip>
                                </Tag>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <ul
                            className="list__task col-span-2"
                            style={{ border: '1px solid #d9d9d9', display: isPreview ? '' : 'none' }}
                          />
                        )}
                    </Form.Item>
                  </div>
                  <div className="col-span-1 ml-8">
                    <Form.Item label="次のタスク">
                      <ItemMultipleDropdown
                        form={form}
                        name="nextTasks"
                        options={tasks2}
                        selectedItems={nextTasks}
                        setSelectedItems={setNextTasks}
                        display={isPreview}
                      />
                      {nextTasks
                        ? (
                          <ul
                            className="list__task col-span-2"
                            style={{ border: '1px solid #d9d9d9', display: isPreview ? '' : 'none' }}
                          >
                            {nextTasks.map((element) => (
                              <li className="task__chil">
                                <Tag
                                  style={{
                                    marginRight: 3,
                                    paddingTop: '5px',
                                    paddingBottom: '3px',
                                  }}
                                >
                                  <Tooltip placement="top" title={element.name}>
                                    <div className="inline-block text-blue-600 whitespace-nowrap">
                                      {truncate(element.name)}
                                    </div>
                                  </Tooltip>
                                </Tag>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <ul
                            className="list__task col-span-2"
                            style={{ border: '1px solid #d9d9d9', display: isPreview ? '' : 'none' }}
                          />
                        )}
                    </Form.Item>
                  </div>
                </div>
                <div className="mr-4 2xl:mr-10 pl-12 mb-2" style={{ display: isPreview ? 'none' : '' }}>
                  <MDEditor style={{ height: '40px !important' }} preview="edit" height="300" value={description} onChange={setDescription} />
                </div>
                <div className="mr-8 ml-14 mb-2 des" style={{ display: isPreview ? '' : 'none' }}>
                  <MarkDownView source={description} />
                </div>
                <Form.Item className="justify-end">
                  <Space size={20} className="flex place-content-end" style={{ display: isPreview ? 'none' : '' }}>
                    <CancelEditTemplateTask id={pathId} />
                    <Button
                      className="preview_btn"
                      htmlType="submit"
                      onClick={() => {
                        onPreview()
                      }}
                      style={{ letterSpacing: '-1px' }}
                    >
                      プレビュー
                    </Button>
                    <Button
                      type="primary"
                      htmlType="submit"
                      className="text-base mr-5 2xl:mr-10"
                      onClick={handleOk}
                    >
                      <span> 保存 </span>
                    </Button>
                  </Space>
                  <Space style={{ display: isPreview ? '' : 'none' }} size={20} className="flex place-content-end mr-8">
                    <Button
                      htmlType="button"
                      onClick={() => {
                        setIsPreview(false)
                      }}
                      style={{ letterSpacing: '-1px' }}
                    >
                      編集
                    </Button>
                    <Button
                      type="primary"
                      htmlType="submit"
                      className="text-base "
                      onClick={handleOk}
                    >
                      <span> 保存 </span>
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            </div>
          </div>
        </OtherLayout.Main>
      </OtherLayout>
    </div>
  )
}

EditTemplateTaskPage.middleware = ['auth:superadmin']
export default EditTemplateTaskPage
