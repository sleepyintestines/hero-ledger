import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { Provider } from "./auth/provider.jsx"
import App from "./app/App.jsx"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider>
      <App />
    </Provider>
  </StrictMode>,
)
