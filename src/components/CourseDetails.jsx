// CourseDetails.js
import React from 'react';
import PropTypes from 'prop-types';

const CourseDetails = ({ selectedNode, specialtyTracks }) => {
  if (!selectedNode) return null;

  const { name, courseCode, isCore, rank, hours, track } = selectedNode;

  // Find the track name if the course is part of a specialty track
  const trackName = !isCore
    ? specialtyTracks.find((t) => t.code === track)?.name
    : null;

  return (
    <div className="absolute bottom-4 left-4 bg-gray-800 p-4 rounded-lg border border-gray-700 shadow-lg">
      <h3 className="font-bold text-sm text-gray-200">
        {name || courseCode}
      </h3>
      {isCore ? (
        <>
          <p className="text-sm text-gray-400">Rank: {rank}</p>
          <p className="text-sm text-red-400">Required Hours: {hours}</p>
        </>
      ) : (
        <p className="text-sm text-gray-400">
          {trackName} Track
        </p>
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
