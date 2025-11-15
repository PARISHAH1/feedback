import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Navbar, Button } from 'react-bootstrap';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import FeedbackForm from './components/FeedbackForm';
import FeedbackList from './components/FeedbackList';
import FeedbackStats from './components/FeedbackStats';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const API_URL = 'http://localhost:5000/api/feedback';

function App() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    averageRating: 0,
    positive: 0,
    negative: 0
  });

  // Fetch all feedbacks
  const fetchFeedbacks = async () => {
    try {
      const { data } = await axios.get(API_URL);
      setFeedbacks(data.data);
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    }
  };

  // Fetch stats
  const fetchStats = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/stats`);
      setStats(data.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // Add new feedback
  const addFeedback = async (newFeedback) => {
    try {
      const { data } = await axios.post(API_URL, newFeedback);
      setFeedbacks([data.data, ...feedbacks]);
      fetchStats(); // Refresh stats
      return { success: true };
    } catch (error) {
      console.error('Error adding feedback:', error);
      return { success: false, error: error.response?.data?.error || 'Failed to add feedback' };
    }
  };

  // Initial data load
  useEffect(() => {
    fetchFeedbacks();
    fetchStats();
  }, []);

  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <div className={`App ${darkMode ? 'dark-mode' : ''}`}>
      <Navbar bg={darkMode ? 'dark' : 'light'} variant={darkMode ? 'dark' : 'light'} className="mb-4">
        <Container>
          <Navbar.Brand href="#" className="d-flex align-items-center">
            <i className="fas fa-comment-alt me-2"></i>
            <span>Feedback Dashboard</span>
          </Navbar.Brand>
          <div className="d-flex align-items-center">
            <Button 
              variant={darkMode ? 'outline-light' : 'outline-secondary'}
              size="sm"
              onClick={toggleDarkMode}
              className="d-flex align-items-center"
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? (
                <><i className="fas fa-sun me-1"></i> Light Mode</>
              ) : (
                <><i className="fas fa-moon me-1"></i> Dark Mode</>
              )}
            </Button>
          </div>
        </Container>
      </Navbar>

      <Container>
        <Row>
          <Col md={4}>
            <FeedbackForm onAdd={addFeedback} />
            <FeedbackStats stats={stats} />
          </Col>
          <Col md={8}>
            <FeedbackList feedbacks={feedbacks} />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

// Wrap the App with ThemeProvider
const AppWithTheme = () => (
  <ThemeProvider>
    <App />
  </ThemeProvider>
);

export default AppWithTheme;
