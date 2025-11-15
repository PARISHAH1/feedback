import React, { useState } from 'react';
import { Card, Form, Button, Alert } from 'react-bootstrap';
import { toast } from 'react-toastify';

const FeedbackForm = ({ onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    rating: 0
  });
  const [hover, setHover] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { name, email, message, rating } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!name || !email || !message || rating === 0) {
      setError('Please fill in all fields');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      setLoading(true);
      const result = await onAdd(formData);
      
      if (result.success) {
        // Reset form
        setFormData({
          name: '',
          email: '',
          message: '',
          rating: 0
        });
        setHover(0);
        toast.success('Feedback submitted successfully!');
      } else {
        setError(result.error || 'Failed to submit feedback');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mb-4">
      <Card.Body>
        <Card.Title>Add Your Feedback</Card.Title>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={name}
              onChange={handleChange}
              placeholder="Your name"
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
              placeholder="Your email"
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Your Feedback</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="message"
              value={message}
              onChange={handleChange}
              placeholder="Share your thoughts..."
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Rating</Form.Label>
            <div className="rating">
              {[...Array(5)].map((star, index) => {
                index += 1;
                return (
                  <button
                    type="button"
                    key={index}
                    className={index <= (hover || rating) ? 'star-btn on' : 'star-btn off'}
                    onClick={() => setFormData({ ...formData, rating: index })}
                    onMouseEnter={() => setHover(index)}
                    onMouseLeave={() => setHover(rating)}
                  >
                    <span className="star">&#9733;</span>
                  </button>
                );
              })}
            </div>
          </Form.Group>
          
          <Button 
            variant="primary" 
            type="submit" 
            disabled={loading}
            className="w-100"
          >
            {loading ? 'Submitting...' : 'Submit Feedback'}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default FeedbackForm;
