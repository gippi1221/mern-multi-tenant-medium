import { StoresProvider } from "./contexts"
import { Router } from "./router/Router"

function App() {

  return (
    <StoresProvider>
      <Router />
    </StoresProvider>
  )
}

export default App
