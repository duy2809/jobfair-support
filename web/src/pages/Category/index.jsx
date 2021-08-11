/* eslint-disable react/react-in-jsx-scope */
import 'antd/dist/antd.css'
import ListCategory from './components/ListCategory'
import Navbar from '../../components/navbar'
import OtherLayout from '../../layouts/OtherLayout'

function App() {
  return (
    <div>
      <OtherLayout>
        <OtherLayout.Main>
          <div className="listCategory">
            <div>
              <Navbar />
            </div>
            <div>
              <ListCategory />
            </div>
          </div>
        </OtherLayout.Main>
      </OtherLayout>
    </div>
  )
}

export default App
