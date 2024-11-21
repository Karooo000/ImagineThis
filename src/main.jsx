import { createRoot } from 'react-dom/client'
import './styles.css'
import App from "/src/App.jsx"
import Config from './Config'


createRoot(document.getElementById('root')).render(<App />)
createRoot(document.getElementById('configg')).render(<Config />)