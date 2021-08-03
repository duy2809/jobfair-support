/* eslint-disable react/react-in-jsx-scope */
import 'antd/dist/antd.css'
import ListCategory from './components/ListCategory'
import Navbar from '../../components/navbar'

function App() {
  return (
    <div>
      <div>
        <Navbar />
      </div>
      {/* <div className="flex relative">
                <p className="pt-8 pl-16 font-bold text-4xl">カテゴリー覧</p>
                <div className="absolute right-12 top-10">
                    <SearchCategory />
                </div>
            </div> */}
      <div>
        <ListCategory />
      </div>
    </div>
  )
}

export default App
