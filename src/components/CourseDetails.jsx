// src/components/CourseDetails.jsx
import React from 'react';
import PropTypes from 'prop-types';
import './css/CourseDetails.css';

const CourseDetails = ({ selectedNode, specialtyTracks }) => {
  if (!selectedNode) return null;

  const { name, courseCode, isCore, rank, hours, track } = selectedNode;

  // Find the track name if the course is part of a specialty track
  const trackDetails = !isCore
    ? specialtyTracks.find((t) => t.code === track)
    : null;
  const trackName = trackDetails?.name;
  const trackColor = trackDetails?.color || '#6b7280'; // Default to gray if no color

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
    track: PropTypes.string,
  }),
  specialtyTracks: PropTypes.arrayOf(
    PropTypes.shape({
      code: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      color: PropTypes.string,
      minimumRank: PropTypes.string,
      courses: PropTypes.arrayOf(PropTypes.string),
    })
  ).isRequired,
};

export default CourseDetails;
