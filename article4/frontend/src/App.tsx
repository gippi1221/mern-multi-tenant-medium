import { AuthProvider, StoresProvider } from './contexts';
import { Router } from './router/Router';

function App() {
  return (
    <AuthProvider>
      <StoresProvider>
        <Router />
      </StoresProvider>
    </AuthProvider>
  );
}

export default App;
