import { AuthProvider, StoresProvider } from './contexts';
import TenantWrapper from './components/TenantWrapper';
import { Router } from './router/Router';

function App() {
  return (
    <TenantWrapper>
      <AuthProvider>
        <StoresProvider>
          <Router />
        </StoresProvider>
      </AuthProvider>
    </TenantWrapper>
  );
}

export default App;
