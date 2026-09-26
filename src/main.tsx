import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import ClickSpark from './components/ClickSpark.jsx';

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('Root element not found');

createRoot(rootEl).render(
  <StrictMode>
    <ClickSpark
      sparkColor="#E74694"
      sparkSize={8}
      sparkRadius={15}
      sparkCount={8}
      duration={400}
    >
      <App />
    </ClickSpark>
  </StrictMode>
);

