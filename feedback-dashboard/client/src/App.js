import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Navbar, Button } from 'react-bootstrap';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import FeedbackForm from './components/FeedbackForm';
import FeedbackList from './components/FeedbackList';
import FeedbackStats from './components/FeedbackStats';
import { FaMoon, FaSun, FaCommentAlt } from 'react-icons/fa';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const API_URL = 'https://feedbackproject12.netlify.app/';

// Move the AppContent component inside the ThemeProvider
const AppContent = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    averageRating: 0,
    positive: 0,
    negative: 0
  });
  const { darkMode, toggleTheme } = useTheme();

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

  return (
    <div className={`App ${darkMode ? 'dark-mode' : ''}`}>
      <Navbar bg={darkMode ? 'dark' : 'light'} variant={darkMode ? 'dark' : 'light'} className="mb-4">
        <Container>
          <Navbar.Brand href="#" className="d-flex align-items-center">
            <FaCommentAlt className="me-2" />
            <span>Feedback Dashboard</span>
          </Navbar.Brand>
          <div className="d-flex align-items-center">
            <Button 
              variant={darkMode ? 'outline-light' : 'outline-secondary'}
              size="sm"
              onClick={toggleTheme}
              className="d-flex align-items-center"
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? (
                <><FaSun className="me-1" /> Light Mode</>
              ) : (
                <><FaMoon className="me-1" /> Dark Mode</>
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
};

// Main App component that wraps everything with ThemeProvider
const App = () => (
  <ThemeProvider>
    <AppContent />
  </ThemeProvider>
);

export default App;