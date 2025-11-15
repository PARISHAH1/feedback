import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';

const StatCard = ({ title, value, icon, variant = 'primary' }) => (
  <Card className="mb-3">
    <Card.Body className="p-3">
      <Row className="align-items-center">
        <Col xs={3} className="text-center">
          <div className={`bg-${variant} bg-opacity-10 p-3 rounded`}>
            <i className={`fas fa-${icon} text-${variant} fs-4`}></i>
          </div>
        </Col>
        <Col xs={9}>
          <h6 className="text-muted mb-0">{title}</h6>
          <h4 className="mb-0">{value}</h4>
        </Col>
      </Row>
    </Card.Body>
  </Card>
);

const FeedbackStats = ({ stats }) => {
  const { total, averageRating, positive, negative } = stats;
  
  return (
    <div className="feedback-stats">
      <StatCard 
        title="Total Feedback" 
        value={total} 
        icon="comment-alt" 
        variant="primary" 
      />
      <StatCard 
        title="Average Rating" 
        value={averageRating ? averageRating.toFixed(1) : '0.0'} 
        icon="star" 
        variant="warning" 
      />
      <StatCard 
        title="Positive" 
        value={positive} 
        icon="thumbs-up" 
        variant="success" 
      />
      <StatCard 
        title="Needs Improvement" 
        value={negative} 
        icon="thumbs-down" 
        variant="danger" 
      />
    </div>
  );
};

export default FeedbackStats;
