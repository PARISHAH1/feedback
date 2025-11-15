import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, Row, Col, Card } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { FaStar, FaPaperPlane } from 'react-icons/fa';

const FeedbackForm = ({ onFeedbackSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    rating: 0
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);

  useEffect(() => {
    // Add animation class when component mounts
    document.querySelector('.feedback-form').classList.add('fade-in');
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleRating = (rating) => {
    setFormData(prev => ({
      ...prev,
      rating
    }));
    
    if (errors.rating) {
      setErrors(prev => ({
        ...prev,
        rating: null
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    if (formData.rating === 0) newErrors.rating = 'Please select a rating';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      try {
        await onFeedbackSubmit(formData);
        setFormData({ name: '', email: '', message: '', rating: 0 });
        toast.success('🎉 Feedback submitted successfully!');
      } catch (error) {
        toast.error('❌ Failed to submit feedback. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Scroll to first error
      const firstError = Object.keys(errors)[0];
      if (firstError) {
        document.querySelector(`[name="${firstError}"]`).scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }
  };

  return (
    <Card className="feedback-form mb-4 border-0">
      <Card.Header className="bg-primary text-white">
        <h5 className="mb-0">Share Your Feedback</h5>
      </Card.Header>
      <Card.Body className="p-4">
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label className="fw-medium">Your Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  isInvalid={!!errors.name}
                  placeholder="John Doe"
                  className="py-2 px-3"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.name}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6} className="mb-3">
              <Form.Group>
                <Form.Label className="fw-medium">Email Address</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  isInvalid={!!errors.email}
                  placeholder="your.email@example.com"
                  className="py-2 px-3"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-4">
            <Form.Label className="fw-medium">Your Feedback</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              name="message"
              value={formData.message}
              onChange={handleChange}
              isInvalid={!!errors.message}
              placeholder="Share your thoughts with us..."
              className="py-2 px-3"
              style={{ resize: 'none' }}
            />
            <Form.Control.Feedback type="invalid">
              {errors.message}
            </Form.Control.Feedback>
          </Form.Group>

          <div className="mb-4">
            <Form.Label className="fw-medium d-block">
              How would you rate your experience?
              {formData.rating > 0 && (
                <span className="ms-2 text-primary">
                  {formData.rating} {formData.rating === 1 ? 'star' : 'stars'}
                </span>
              )}
            </Form.Label>
            <div className="d-flex align-items-center">
              <div className="rating-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`star ${star <= (hoveredRating || formData.rating) ? 'filled' : ''}`}
                    onClick={() => handleRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    style={{
                      cursor: 'pointer',
                      fontSize: '2rem',
                      marginRight: '0.5rem',
                      transition: 'transform 0.2s, color 0.2s',
                      color: star <= (hoveredRating || formData.rating) ? '#ffc107' : '#e4e5e9',
                    }}
                  >
                    <FaStar />
                  </span>
                ))}
              </div>
              {errors.rating && (
                <div className="invalid-feedback d-block mt-2">
                  {errors.rating}
                </div>
              )}
            </div>
          </div>

          <Button 
            variant="primary" 
            type="submit" 
            className="px-4 py-2 fw-medium w-100"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Submitting...
              </>
            ) : (
              <>
                <FaPaperPlane className="me-2" />
                Submit Feedback
              </>
            )}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default FeedbackForm;
