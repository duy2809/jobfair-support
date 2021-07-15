import { Modal, Button } from 'antd';
import React from 'react';

class CancelEditMilestone extends React.Component {
  state = {
    loading: false,
    visible: false,
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = () => {
    this.setState({ loading: true });

  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  render() {
    const { visible, loading } = this.state;
    return (
      <>
        <Button type="primary" onClick={this.showModal}>
            キャンセル
        </Button>
        <Modal
          visible={visible}
          title="Title"
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={[
            <Button key="back" onClick={this.handleCancel}>
              いいえ
            </Button>,
            <Button key="submit" type="primary" loading={loading} onClick={this.handleOk}>
              はい
            </Button>,
            
          ]}
        >
          <p>変更内容が保存されません。よろしいですか？</p>
          
        </Modal>
      </>
    );
  }
}
export default CancelEditMilestone
