import React, { useState, useEffect, useMemo } from 'react';
import { Card, Badge, Form, InputGroup, Dropdown } from 'react-bootstrap';
import { format, parseISO } from 'date-fns';
import { FaSearch, FaSort, FaSortUp, FaSortDown, FaDownload } from 'react-icons/fa';
import { CSVLink } from 'react-csv';

const ITEMS_PER_PAGE = 10;

const FeedbackList = ({ feedbacks = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  
  // Memoize filtered feedbacks to prevent unnecessary recalculations
  const filteredFeedbacks = useMemo(() => {
    if (!searchTerm) return feedbacks;
    
    const searchLower = searchTerm.toLowerCase();
    return feedbacks.filter(feedback => {
      return (
        feedback.name?.toLowerCase().includes(searchLower) ||
        feedback.email?.toLowerCase().includes(searchLower) ||
        feedback.message?.toLowerCase().includes(searchLower) ||
        feedback.rating?.toString().includes(searchTerm)
      );
    });
  }, [feedbacks, searchTerm]);

  // Memoize sorted feedbacks
  const sortedFeedbacks = useMemo(() => {
    const sortableItems = [...filteredFeedbacks];
    if (!sortConfig) return sortableItems;

    return sortableItems.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [filteredFeedbacks, sortConfig]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredFeedbacks.length / ITEMS_PER_PAGE);
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const displayedFeedbacks = sortedFeedbacks.slice(indexOfFirstItem, indexOfLastItem);

  // Reset to first page when search term or sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortConfig]);

  // Handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Generate page numbers for pagination
  const paginationItems = useMemo(() => {
    const items = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    return { startPage, endPage };
  }, [currentPage, totalPages]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Prepare data for CSV export
  const csvData = useMemo(() => 
    sortedFeedbacks.map(feedback => ({
      Name: feedback.name,
      Email: feedback.email,
      Message: feedback.message,
      Rating: feedback.rating,
      Date: feedback.createdAt ? format(parseISO(feedback.createdAt), 'yyyy-MM-dd HH:mm') : ''
    })),
    [sortedFeedbacks]
  );

  const SortIcon = ({ column }) => {
    if (sortConfig.key !== column) return <FaSort className="ms-1" />;
    return sortConfig.direction === 'asc' ? 
      <FaSortUp className="ms-1" /> : 
      <FaSortDown className="ms-1" />;
  };
  const getRatingColor = (rating) => {
    if (rating >= 4) return 'success';
    if (rating <= 2) return 'danger';
    return 'warning';
  };

  const getRatingText = (rating) => {
    const ratings = {
      1: 'Poor',
      2: 'Fair',
      3: 'Good',
      4: 'Very Good',
      5: 'Excellent'
    };
    return ratings[rating] || '';
  };

  if (feedbacks.length === 0) {
    return (
      <Card>
        <Card.Body className="text-center py-5">
          <i className="fas fa-comment-slash fa-3x text-muted mb-3"></i>
          <h5>No feedback yet</h5>
          <p className="text-muted">Be the first to share your thoughts!</p>
        </Card.Body>
      </Card>
    );
  }

  // Generate pagination items
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    return (
      <div className="d-flex justify-content-center mt-3">
        <nav aria-label="Feedback pagination">
          <ul className="pagination pagination-sm">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button 
                className="page-link" 
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
            </li>

            {startPage > 1 && (
              <li className="page-item">
                <button className="page-link" onClick={() => paginate(1)}>1</button>
              </li>
            )}
            {startPage > 2 && <li className="page-item disabled"><span className="page-link">...</span></li>}

            {Array.from({ length: endPage - startPage + 1 }, (_, i) => {
              const page = startPage + i;
              return (
                <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                  <button className="page-link" onClick={() => paginate(page)}>
                    {page}
                  </button>
                </li>
              );
            })}

            {endPage < totalPages - 1 && <li className="page-item disabled"><span className="page-link">...</span></li>}
            {endPage < totalPages && (
              <li className="page-item">
                <button className="page-link" onClick={() => paginate(totalPages)}>
                  {totalPages}
                </button>
              </li>
            )}

            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button 
                className="page-link" 
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>
    );
  };

  return (
    <Card className="mb-4">
      <Card.Header className="d-flex flex-column flex-md-row justify-content-between align-items-md-center">
        <div className="d-flex align-items-center">
          <h5 className="mb-2 mb-md-0 me-2">Feedback List</h5>
          <Badge bg="secondary" className="ms-2">
            {filteredFeedbacks.length} {filteredFeedbacks.length === 1 ? 'item' : 'items'}
          </Badge>
        </div>
        <div className="d-flex flex-column flex-md-row gap-2 w-100 w-md-auto mt-2 mt-md-0">
          <InputGroup className="me-md-2 mb-2 mb-md-0" style={{ maxWidth: '300px' }}>
            <InputGroup.Text id="search-addon">
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search feedback..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search feedback"
              aria-describedby="search-addon"
            />
          </InputGroup>
          
          <div className="d-flex gap-2">
            <Dropdown>
              <Dropdown.Toggle variant="outline-secondary" size="sm">
                <FaSort className="me-1" />
                {sortConfig.key === 'createdAt' ? 'Date' : 
                 sortConfig.key === 'rating' ? 'Rating' : 'Name'}
                {sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => requestSort('createdAt')}>
                  Date {sortConfig.key === 'createdAt' && <SortIcon column="createdAt" />}
                </Dropdown.Item>
                <Dropdown.Item onClick={() => requestSort('rating')}>
                  Rating {sortConfig.key === 'rating' && <SortIcon column="rating" />}
                </Dropdown.Item>
                <Dropdown.Item onClick={() => requestSort('name')}>
                  Name {sortConfig.key === 'name' && <SortIcon column="name" />}
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            
            <CSVLink 
              data={csvData} 
              filename="feedback-export.csv" 
              className="btn btn-outline-primary btn-sm d-flex align-items-center"
            >
              <FaDownload className="me-1" /> Export
            </CSVLink>
          </div>
        </div>
      </Card.Header>
      <Card.Body className="p-0">
        <div className="list-group list-group-flush">
          {filteredFeedbacks.length === 0 ? (
            <div className="text-center py-4 text-muted">
              <i className="fas fa-search fa-2x mb-2"></i>
              <p>No feedback found matching your search.</p>
            </div>
          ) : (
            <>
              {displayedFeedbacks.map((feedback) => (
            <div key={feedback._id} className="list-group-item">
              <div className="d-flex justify-content-between mb-2">
                <div>
                  <strong>{feedback.name}</strong>
                  <small className="text-muted ms-2">{feedback.email}</small>
                </div>
                <Badge bg={getRatingColor(feedback.rating)}>
                  {feedback.rating} - {getRatingText(feedback.rating)}
                </Badge>
              </div>
              <p className="mb-2">{feedback.message}</p>
              <small className="text-muted">
                {format(new Date(feedback.createdAt), 'MMM d, yyyy h:mm a')}
              </small>
            </div>
              ))}
              {renderPagination()}
            </>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default FeedbackList;
