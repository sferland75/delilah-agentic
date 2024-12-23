import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import AssessmentDetail from './components/AssessmentDetail';

const App: React.FC = () => {
  return (
    <Router>
      <div>
        <nav className="bg-gray-800 text-white p-4">
          <div className="container mx-auto">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-bold">Delilah Agentic</h1>
              <div>
                <Link to="/" className="px-4 py-2 hover:text-gray-300">Dashboard</Link>
              </div>
            </div>
          </div>
        </nav>

        <main className="container mx-auto mt-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/assessment/:id" element={<AssessmentDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;