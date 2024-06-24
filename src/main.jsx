import { createRoot } from 'react-dom/client'
import './styles.css'
import App from "/src/App.jsx"

console.log("reloaded")

/*
let isMobileYes = window.innerWidth < 768


if(isMobileYes){
    console.log("mobile refresh")
}

if(!isMobileYes){
    console.log("dosktop refresh")
}
    */

createRoot(document.getElementById('root')).render(<App />)