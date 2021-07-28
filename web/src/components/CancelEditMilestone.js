import { Modal, Button } from 'antd'
import React from 'react'

class CancelEditMilestone extends React.Component {
  state = {
    visible: false,
  };

  showModal = () => {
    this.setState({
      visible: true,
    })
  };

  handleOk = () => {
    location.href="/milestones"
    this.setState({ visible: false })
  };

  handleCancel = () => {
    this.setState({ visible: false })
  };

  render() {
    const { visible } = this.state
    return (
      <>
        <Button type="primary" onClick={this.showModal} className="text-base px-8 mr-10">
          キャンセル
        </Button>
        <Modal
          visible={visible}
          title="マイルストーン編集"
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={[
            <Button key="back" onClick={this.handleCancel}>
              いいえ
            </Button>,
            <Button key="submit" type="primary" onClick={this.handleOk}>
              はい
            </Button>,

          ]}
        >
          <p>変更内容が保存されません。よろしいですか？</p>

        </Modal>
      </>
    )
  }
}
export default CancelEditMilestone
