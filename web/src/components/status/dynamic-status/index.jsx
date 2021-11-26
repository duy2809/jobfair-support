import React, { useState } from "react";
import PropTypes from "prop-types";
import { Modal, Select } from "antd";
import {
  EditOutlined
} from "@ant-design/icons";
import { updateStatusMember } from "../../../api/task-detail";
function Status(props) {
  const listStatus = ["未着手", "進行中", "リビュエー待ち"]
  const [oldStatus, setOldStatus] = useState(props.status)
  var newStatus;
  const handleChange = (value) => {
    newStatus = value;
    console.log(newStatus)
  };
  const handleOk = async () => {
    console.log(newStatus)
    await updateStatusMember(props.user_id, props.task_id,newStatus).then((res)=>{
    　setOldStatus(res.data)
      props.set_task_status("未着手")
    });

  };
  const modalChangeStatus = () => {
    Modal.confirm({
      title: "ステータスを編集",
      width: 400,
      content: (
        <Select
          size="large"
          defaultValue={oldStatus}
          style={{ width: "300px" }}    
          onChange={handleChange}
        >
          {listStatus.map((element) => (
            <Select.Option value={element}>{element}</Select.Option>
          ))}
        </Select>
      ),
      onOk() {
        handleOk();
      },
      onCancel() {},
      centered: true,
      okText: "編集",
      okButtonProps: { size: "large" },
      cancelText: "キャンセル",
      cancelButtonProps: { size: "large" },
    });
  };
  return (
    <>
      {`${oldStatus}` === "未着手" ? (
        <a
          onClick={modalChangeStatus}
          style={{
            background: "#5EB5A6",
            color: "#fff",
          }}
        >
          <EditOutlined />
          {`${oldStatus}`}
        </a>
      ) : null}
      {`${oldStatus}` === "進行中" ? (
        <a
          onClick={modalChangeStatus}
          style={{
            background: "#A1AF2F",
            color: "#fff",
          }}
        >
          <EditOutlined size='small'/>
          {`${oldStatus}`}&nbsp;&nbsp;
        </a>
      ) : null}
      {`${oldStatus}` === "リビュエー待ち" ? (
        <a
          onClick={modalChangeStatus}
          style={{
            background: "#4488C5",
            color: "#fff",
          }}
          className=" stt item__right"
        >
          <EditOutlined size='small'/>
          {`${oldStatus}`}&nbsp;&nbsp;
        </a>
      ) : null}
      {/* {`${oldStatus}` === "中断" ? (
        <a
          onClick={modalChangeStatus}
          style={{
            background: "rgb(185, 86, 86)",
            color: "#fff",
          }}
          className=" stt item__right"
        >
          {`${oldStatus}`}
        </a>
      ) : null}
      {`${oldStatus}` === "未完了" ? (
        <a
          onClick={modalChangeStatus}
          style={{
            background: "rgb(121, 86, 23)",
            color: "#fff",
          }}
          className=" stt item__right"
        >
          {`${oldStatus}`}
        </a>
      ) : null} */}
    </>
  );
}
Status.propTypes = {
  status: PropTypes.string.isRequired,
  user_id: PropTypes.number,
  jobfair_id: PropTypes.number,
  task_id: PropTypes.number,
  set_task_status: PropTypes.func,
};
export default Status;
