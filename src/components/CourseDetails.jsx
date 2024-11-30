import React from 'react';
import PropTypes from 'prop-types';
import './css/CourseDetails.css';

const CourseDetails = ({ selectedNode, specialtyTracks, nodeSessions }) => {
  if (!selectedNode) return null;

  const { name, courseCode, isCore, rank, hours, type } = selectedNode;

  // Find the track details if the course is part of a specialty track
  const trackDetails = !isCore
    ? specialtyTracks.find((t) => t.code === type)
    : null;
  const trackName = trackDetails?.name;
  const trackColor = trackDetails?.color || '#6b7280'; // Default to gray if no color

  // Helper function to format dates
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div
      className="course-details-panel"
      style={{ borderLeft: `4px solid ${isCore ? '#ef4444' : trackColor}` }} // Accent border
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

      {/* Display Sessions Data in Card Format */}
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

CourseDetails.propTypes = {
  selectedNode: PropTypes.shape({
    name: PropTypes.string,
    courseCode: PropTypes.string,
    isCore: PropTypes.bool.isRequired,
    rank: PropTypes.string,
    hours: PropTypes.number,
    type: PropTypes.string, // Added 'type' to propTypes
  }),
  specialtyTracks: PropTypes.arrayOf(
    PropTypes.shape({
      code: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      color: PropTypes.string,
      minimumRank: PropTypes.string,
      courses: PropTypes.arrayOf(PropTypes.object), // Adjusted to match the new data structure
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
