import { Modal, Button } from 'antd';
import React from 'react'

class CancelEdit extends React.Component {
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
    this.setState({ visible: false });
   
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  render() {
    const { visible, loading } = this.state;
    return (
      <>
            <Button onClick={this.showModal}   >
              キャンセル
            </Button>
            <Modal 
                title="マイルストーン編集" 
                visible={visible} 
                onOk={this.handleOk} 
                onCancel={this.handleCancel}
                
                footer={[
                    <Button key="back" onClick={this.handleCancel} >
                        いいえ
                    </Button>,
                    <Button key="submit" type="primary"  onClick={this.handleOk} href="#" >
                        はい
                    </Button>
                
                ]}
                
            >
              
              <p>変更内容が保存されません。よろしいですか？</p>

             </Modal>
      </>
    );
  }
}

export default CancelEdit