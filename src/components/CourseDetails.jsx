import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Mail, X, AlertCircle, Clock } from 'lucide-react';
import './css/CourseDetails.css';

const RequestedCourses = () => {
  // Hardcoded requested courses data
  const requestedCourses = [
    {
      courseCode: "CORE101",
      name: "Basic Leadership",
      school: "Command School",
      startDate: "2024-12-01",
      endDate: "2024-12-15",
      status: "enrolled",
      location: "Fort Baker"
    },
    {
      courseCode: "ADV202",
      name: "Advanced Tactics",
      school: "Tactical School",
      startDate: "2025-01-10",
      endDate: "2025-01-24",
      status: "pending",
      location: "Fort Mason"
    }
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="course-details-panel">
      <h3 className="course-details-title">Requested Courses</h3>
      <div className="sessions-grid">
        {requestedCourses.map((course, index) => (
          <div 
            className="session-card" 
            key={index}
            style={{ 
              borderLeft: `4px solid ${course.status === 'enrolled' ? '#22c55e' : '#f59e0b'}`
            }}
          >
            <div className="session-card-header">
              <h5>{course.name}</h5>
              <span className={`status-badge ${course.status}`}>
                {course.status === 'enrolled' ? 'Enrolled' : 'Pending'}
              </span>
            </div>
            <div className="session-card-body">
              <p><strong>Course Code:</strong> {course.courseCode}</p>
              <p><strong>School:</strong> {course.school}</p>
              <p>
                <strong>Date:</strong> {formatDate(course.startDate)} - {formatDate(course.endDate)}
              </p>
              <p><strong>Location:</strong> {course.location}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const EnrollmentConfirmation = ({ session, course, onBack, onSubmit }) => {
  const [additionalEmails, setAdditionalEmails] = useState('');

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="enrollment-confirmation">
      <div className="confirmation-header">
        <button className="back-button" onClick={onBack}>
          <X size={16} />
        </button>
        <h4>Confirm Course Request</h4>
      </div>

      <div className="confirmation-notice">
        <AlertCircle size={20} />
        <p>A request will be sent to your designated unit training inbox. Add any additional recipients below.</p>
      </div>

      <div className="confirmation-details">
        <h5>Course Details</h5>
        <div className="details-grid">
          <div>
            <label>Course:</label>
            <p>{course.name || course.courseCode}</p>
          </div>
          <div>
            <label>School:</label>
            <p>{session.school}</p>
          </div>
          <div>
            <label>Location:</label>
            <p>{session.location}</p>
          </div>
          <div>
            <label>Dates:</label>
            <p>{formatDate(session.startDate)} - {formatDate(session.endDate)}</p>
          </div>
        </div>
      </div>

      <form onSubmit={(e) => {
        e.preventDefault();
        onSubmit({
          session,
          additionalEmails: additionalEmails.split(',').map(email => email.trim()).filter(Boolean)
        });
      }}>
        <div className="additional-emails">
          <label htmlFor="cc-emails">
            <Mail size={16} />
            CC Additional Recipients:
          </label>
          <input
            type="text"
            id="cc-emails"
            value={additionalEmails}
            onChange={(e) => setAdditionalEmails(e.target.value)}
            placeholder="Enter email addresses, separated by commas"
          />
          <small>Separate multiple email addresses with commas</small>
        </div>

        <button type="submit" className="confirm-btn">
          Send Course Request
        </button>
      </form>
    </div>
  );
};

const MainCourseDetails = ({ selectedNode, specialtyTracks, nodeSessions, onEnrollmentSubmit }) => {
  const [enrollingSession, setEnrollingSession] = useState(null);

  if (!selectedNode) return null;

  const { name, courseCode, isCore, rank, hours, type } = selectedNode;

  const trackDetails = !isCore
    ? specialtyTracks.find((t) => t.code === type)
    : null;
  const trackName = trackDetails?.name;
  const trackColor = trackDetails?.color || '#6b7280';

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (enrollingSession) {
    return (
      <div className="course-details-panel">
        <EnrollmentConfirmation
          session={enrollingSession}
          course={selectedNode}
          onBack={() => setEnrollingSession(null)}
          onSubmit={(formData) => {
            onEnrollmentSubmit(formData);
            setEnrollingSession(null);
          }}
        />
      </div>
    );
  }

  return (
    <div
      className="course-details-panel"
      style={{ borderLeft: `4px solid ${isCore ? '#ef4444' : trackColor}` }}
    >
      <h3 className="course-details-title">
        {name || courseCode}
      </h3>
      <p className="course-details-subtitle">
        {isCore ? 'Core Course' : `${trackName} Track`}
      </p>

      <div className="course-details-info">
        <span className="info-label">Course Code:</span>
        <span className="info-value">{courseCode}</span>
      </div>

      {isCore ? (
        <>
          <div className="course-details-info">
            <span className="info-label">Rank:</span>
            <span className="info-value">{rank}</span>
          </div>
          <div className="course-details-info">
            <span className="info-label">Required Hours:</span>
            <span className="info-value">{hours}</span>
          </div>
        </>
      ) : (
        <div className="course-details-info">
          <span className="info-label">Track:</span>
          <span
            className="info-value track-name"
            style={{ color: trackColor }}
          >
            {trackName}
          </span>
        </div>
      )}

      {nodeSessions && nodeSessions.length > 0 ? (
        <div className="course-sessions">
          <h4>Upcoming Sessions:</h4>
          <div className="sessions-grid">
            {nodeSessions.map((session, index) => (
              <div className="session-card" key={index}>
                <div className="session-card-header">
                  <h5>{session.school}</h5>
                </div>
                <div className="session-card-body">
                  <p>
                    <strong>Date:</strong> {formatDate(session.startDate)} - {formatDate(session.endDate)}
                  </p>
                  <p>
                    <strong>Location:</strong> {session.location}
                  </p>
                  <button 
                    className="session-enroll-btn"
                    onClick={() => setEnrollingSession(session)}
                  >
                    Request
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>No upcoming sessions available for this course.</p>
      )}
    </div>
  );
};

const CourseDetails = ({ selectedNode, specialtyTracks, nodeSessions }) => {
  const [showingRequested, setShowingRequested] = useState(false);

  return (
    <div className="course-details-container">
      <div className="view-toggle-wrapper">
        <button 
          className="view-toggle-btn"
          onClick={() => setShowingRequested(!showingRequested)}
        >
          <Clock size={16} />
          {showingRequested ? 'View Course Details' : 'View Requested Courses'}
        </button>
      </div>

      {showingRequested ? (
        <RequestedCourses />
      ) : (
        <MainCourseDetails
          selectedNode={selectedNode}
          specialtyTracks={specialtyTracks}
          nodeSessions={nodeSessions}
          onEnrollmentSubmit={(formData) => {
            console.log('Enrollment request:', formData);
            setShowingRequested(true);
          }}
        />
      )}
    </div>
  );
};

MainCourseDetails.propTypes = {
  selectedNode: PropTypes.shape({
    name: PropTypes.string,
    courseCode: PropTypes.string,
    isCore: PropTypes.bool.isRequired,
    rank: PropTypes.string,
    hours: PropTypes.number,
    type: PropTypes.string,
  }),
  specialtyTracks: PropTypes.arrayOf(
    PropTypes.shape({
      code: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      color: PropTypes.string,
      minimumRank: PropTypes.string,
      courses: PropTypes.arrayOf(PropTypes.object),
    })
  ).isRequired,
  nodeSessions: PropTypes.arrayOf(
    PropTypes.shape({
      startDate: PropTypes.string.isRequired,
      endDate: PropTypes.string.isRequired,
      location: PropTypes.string.isRequired,
      school: PropTypes.string.isRequired,
    })
  ),
  onEnrollmentSubmit: PropTypes.func.isRequired,
};

EnrollmentConfirmation.propTypes = {
  session: PropTypes.shape({
    school: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    startDate: PropTypes.string.isRequired,
    endDate: PropTypes.string.isRequired,
  }).isRequired,
  course: PropTypes.shape({
    name: PropTypes.string,
    courseCode: PropTypes.string,
  }).isRequired,
  onBack: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

CourseDetails.propTypes = {
  selectedNode: PropTypes.shape({
    name: PropTypes.string,
    courseCode: PropTypes.string,
    isCore: PropTypes.bool.isRequired,
    rank: PropTypes.string,
    hours: PropTypes.number,
    type: PropTypes.string,
  }),
  specialtyTracks: PropTypes.arrayOf(
    PropTypes.shape({
      code: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      color: PropTypes.string,
      minimumRank: PropTypes.string,
      courses: PropTypes.arrayOf(PropTypes.object),
    })
  ).isRequired,
  nodeSessions: PropTypes.arrayOf(
    PropTypes.shape({
      startDate: PropTypes.string.isRequired,
      endDate: PropTypes.string.isRequired,
      location: PropTypes.string.isRequired,
      school: PropTypes.string.isRequired,
    })
  ),
};

export default CourseDetails;