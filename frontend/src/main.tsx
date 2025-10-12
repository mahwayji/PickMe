import { createRoot } from 'react-dom/client'
import './index.css'
import { ThemeProvider } from './lib/theme-provider.tsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store/store.ts'
import App from './App.tsx'
import { CookiesProvider } from 'react-cookie'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Provider store = {store}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <CookiesProvider>
          <App />
        </CookiesProvider>
      </ThemeProvider>
    </Provider >
  </BrowserRouter>,
)
