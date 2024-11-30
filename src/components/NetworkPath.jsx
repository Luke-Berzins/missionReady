// NetworkPath.js
import React, { useState, useEffect, useRef } from 'react';
import CourseDetails from './CourseDetails'; // Adjust the path based on your project structure

const DEFAULT_WIDTH = 1000;
const DEFAULT_HEIGHT = 600;
const NODE_RADIUS = 35;
const HORIZONTAL_OFFSET = 120;
const API_URL = 'http://localhost:3000';

const NetworkPath = ({ branchCode = 'FIRE_CTRL' }) => {
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [dimensions, setDimensions] = useState({
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT
  });
  const [branchData, setBranchData] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/api/branches/${branchCode}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setBranchData(data);
      } catch (error) {
        console.error('Error fetching branch data:', error);
      }
    };

    fetchData();
  }, [branchCode]);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth || DEFAULT_WIDTH,
          height: DEFAULT_HEIGHT
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!branchData) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center bg-gray-900 text-gray-200">
        <p className="text-lg">Loading training path data...</p>
      </div>
    );
  }

  const { coreCourses, specialtyTracks } = branchData;

  const getRankZones = () => {
    const numberOfRanks = 4; // Adjust based on actual ranks
    const rankHeight = dimensions.height / numberOfRanks;

    return specialtyTracks.map((track, index) => ({
      name: track.minimumRank,
      color: track.color,
      startY: index * rankHeight,
      endY: (index + 1) * rankHeight
    }));
  };

  const calculatePositions = () => {
    const { width, height } = dimensions;
    const verticalSpacing = height / (coreCourses.length + 1);
    const horizontalCenter = width / 2;

    // Calculate core path positions
    const corePositions = coreCourses.map((course, index) => ({
      ...course,
      x: horizontalCenter, // Center horizontally
      y: verticalSpacing * (index + 1), // Evenly spaced vertically
      isCore: true
    }));

    // Calculate branch positions
    const branchPositions = coreCourses.flatMap((coreCourse, coreIndex) => {
      const relevantTracks = specialtyTracks.filter(
        (track) => track.minimumRank === coreCourse.rank
      );

      return relevantTracks.flatMap((track, trackIndex) => {
        const startY = verticalSpacing * (coreIndex + 1);
        const direction = trackIndex % 2 === 0 ? 1 : -1; // Alternate left/right for branches

        return track.courses.map((course, seqIndex) => ({
          name: course,
          x: horizontalCenter + (direction * HORIZONTAL_OFFSET * (seqIndex + 1)), // Offset left or right
          y: startY + (verticalSpacing * 0.5 * (seqIndex + 1)), // Slight vertical offset for better spacing
          track: track.code,
          isCore: false,
          branchStartIndex: coreIndex
        }));
      });
    });

    return [...corePositions, ...branchPositions];
  };

  const generatePaths = (nodePositions) => {
    const paths = [];

    // Core paths (connect vertically)
    for (let i = 0; i < coreCourses.length - 1; i++) {
      const start = nodePositions.find((n) => n.courseCode === coreCourses[i].courseCode);
      const end = nodePositions.find((n) => n.courseCode === coreCourses[i + 1].courseCode);
      if (start && end) {
        paths.push({ start, end, isCore: true });
      }
    }

    // Branch paths
    specialtyTracks.forEach((track) => {
      const trackNodes = nodePositions.filter((n) => n.track === track.code);
      trackNodes.forEach((node, index) => {
        if (index > 0) {
          paths.push({ start: trackNodes[index - 1], end: node, track: track.code });
        } else {
          const coreNode = nodePositions.find(
            (n) => n.isCore && n.rank === track.minimumRank
          );
          if (coreNode) {
            paths.push({ start: coreNode, end: node, track: track.code });
          }
        }
      });
    });

    return paths;
  };

  const nodePositions = calculatePositions();
  const paths = generatePaths(nodePositions);
  const rankZones = getRankZones();

  const getTrackColor = (trackCode) => {
    const track = specialtyTracks.find(t => t.code === trackCode);
    return track ? track.color : '#6b7280';
  };

  return (
    <div
      className="w-full h-[600px] bg-gray-900 text-gray-100 font-mono relative"
      ref={containerRef}
    >
      <div className="w-full h-full relative border border-gray-600 rounded-lg p-4">
        {/* Track Selection */}
        <div className="absolute top-4 right-4 flex gap-2">
          {specialtyTracks.map((track) => (
            <button
              key={track.code}
              onClick={() => setSelectedTrack(
                selectedTrack === track.code ? null : track.code
              )}
              className="px-4 py-2 rounded text-sm font-bold transition-colors border border-gray-700"
              style={{
                backgroundColor: selectedTrack === track.code ? track.color : '#4a4a4a',
                color: selectedTrack === track.code ? '#fff' : '#e5e7eb'
              }}
              aria-pressed={selectedTrack === track.code}
            >
              {track.name} Track
            </button>
          ))}
        </div>

        <svg 
          width="100%" 
          height="100%" 
          viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Rank Zones */}
          {rankZones.map((zone, index) => (
            <g key={`zone-${index}`}>
              <rect
                x={0}
                y={zone.startY}
                width={dimensions.width}
                height={zone.endY - zone.startY}
                fill={zone.color}
              />
              <text
                x={dimensions.width - 10}
                y={(zone.startY + zone.endY) / 2}
                textAnchor="end"
                dominantBaseline="middle"
                className="fill-gray-200 text-sm font-bold"
              >
                {zone.name}
              </text>
            </g>
          ))}

          {/* Paths */}
          {paths.map((path, index) => {
            const isHighlighted = selectedTrack && path.track === selectedTrack;
            const pathColor = path.isCore ? "#ef4444" : 
                              (isHighlighted ? getTrackColor(path.track) : "#6b7280");
            
            return (
              <path
                key={`path-${index}`}
                d={`M ${path.start.x} ${path.start.y} 
                    C ${path.start.x + (path.isCore ? 0 : 50)} ${path.start.y}, 
                      ${path.end.x - (path.isCore ? 0 : 50)} ${path.end.y},
                      ${path.end.x} ${path.end.y}`}
                stroke={pathColor}
                strokeWidth={path.isCore ? "4" : "2"}
                fill="none"
                className="transition-all duration-300"
              />
            );
          })}

          {/* Nodes */}
          {nodePositions.map((node, index) => {
            const isHighlighted = selectedTrack && node.track === selectedTrack;
            const nodeColor = node.isCore ? "#1f2937" :
                              (isHighlighted ? getTrackColor(node.track) : "#4a4a4a");
            
            return (
              <g
                key={`node-${index}`}
                transform={`translate(${node.x},${node.y})`}
                onClick={() => setSelectedNode(
                  selectedNode?.name === node.name ? null : node
                )}
                className="cursor-pointer"
              >
                <circle
                  r={NODE_RADIUS}
                  fill={selectedNode?.name === node.name ? nodeColor : '#1f2937'}
                  stroke={node.isCore ? '#ef4444' : getTrackColor(node.track)}
                  strokeWidth={node.isCore ? "3" : "2"}
                  className={`transition-colors duration-300 ${selectedNode?.name === node.name ? 'scale-110' : 'scale-100'}`}
                />
                
                <text
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-xs font-bold fill-gray-200 pointer-events-none"
                >
                  {node.name || node.courseCode}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Info Panel */}
        <CourseDetails selectedNode={selectedNode} specialtyTracks={specialtyTracks} />
      </div>
    </div>
  );
};

export default NetworkPath;
