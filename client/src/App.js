import './App.css'
import Dropzone from './Components/Dropzone'

function App() {
  const onFileChange = (file) => {
    console.log(file)
  }

  return (
    <div className='App'>
      <div className='big-container'>
        <h2>What did the image say?</h2>
        <Dropzone onFileChange={(file) => onFileChange(file)} />
      </div>
    </div>
  )
}

export default App
