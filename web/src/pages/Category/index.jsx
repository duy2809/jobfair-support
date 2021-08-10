/* eslint-disable react/react-in-jsx-scope */
import 'antd/dist/antd.css'
import ListCategory from './components/ListCategory'
import Navbar from '../../components/navbar'

function App() {
  return (
    <div className="listCategory">
      <div>
        <Navbar />
      </div>
      <div>
        <ListCategory />
      </div>
    </div>
  )
}

export default App
