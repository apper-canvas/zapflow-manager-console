import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Sidebar from '@/components/organisms/Sidebar';
import Header from '@/components/organisms/Header';
import Dashboard from '@/components/pages/Dashboard';
import Workflows from '@/components/pages/Workflows';
import WorkflowEditor from '@/components/pages/WorkflowEditor';
import Errors from '@/components/pages/Errors';
import Performance from '@/components/pages/Performance';
import Settings from '@/components/pages/Settings';
function App() {
  return (
    <Router>
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-auto">
<Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/workflows" element={<Workflows />} />
              <Route path="/workflows/editor" element={<WorkflowEditor />} />
              <Route path="/workflows/editor/:id" element={<WorkflowEditor />} />
              <Route path="/errors" element={<Errors />} />
              <Route path="/performance" element={<Performance />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
        </div>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          className="z-50"
        />
      </div>
    </Router>
  );
}

export default App;