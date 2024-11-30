// components/NetworkPath.jsx
import React, { useState, useEffect, useRef } from 'react';
import CourseDetails from './CourseDetails'; // Adjust the path as necessary

const DEFAULT_WIDTH = 800;
const DEFAULT_HEIGHT = 600;
const HORIZONTAL_OFFSET = 150; // Renamed from VERTICAL_OFFSET for clarity
const NODE_RADIUS = 10;
const API_URL = 'http://localhost:3000'; // Replace with your actual API URL

const NetworkPath = ({ tradeCode }) => {
  // 1. Declare all Hooks at the top level
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [dimensions, setDimensions] = useState({
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
  });
  const [tradeData, setTradeData] = useState(null);
  const containerRef = useRef(null);

  // 2. Fetch data Hook
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/api/trades/${tradeCode}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Fetched trade data:', data); // Debugging line
        setTradeData(data);
      } catch (error) {
        console.error('Error fetching trade data:', error);
      }
    };

    fetchData();
  }, [tradeCode]);

  // 3. Handle resize Hook
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth || DEFAULT_WIDTH,
          height: DEFAULT_HEIGHT,
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 4. Debugging Hook (ensure it's always called)
  useEffect(() => {
    if (tradeData) {
      const { trade, coreCourses, specialtyTracks } = tradeData;
      console.log('Trade:', trade);
      console.log('Core Courses:', coreCourses);
      console.log('Specialty Tracks:', specialtyTracks);
    }
  }, [tradeData]);

  // 5. Early return based on tradeData
  if (!tradeData) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center">
        <p className="text-lg text-gray-600">Loading training path data...</p>
      </div>
    );
  }

  // 6. Destructure tradeData after ensuring it's not null
  const { trade, coreCourses, specialtyTracks } = tradeData;

  // 7. Calculate node positions for horizontal layout
  const calculatePositions = () => {
    const { width, height } = dimensions;
    const horizontalSpacing = width / (coreCourses.length + 1); // Spread core nodes horizontally
    const verticalCenter = height / 2; // Center core nodes vertically

    // Calculate core path positions
    const corePositions = coreCourses.map((course, index) => ({
      ...course,
      x: horizontalSpacing * (index + 1), // Distribute nodes horizontally
      y: verticalCenter, // Align all core nodes vertically at the center
      isCore: true,
    }));

    // Calculate branch positions
    const branchPositions = coreCourses.flatMap((coreCourse, coreIndex) => {
      const relevantTracks = specialtyTracks.filter(
        (track) => track.minimumRank === coreCourse.rank
      );

      return relevantTracks.flatMap((track, trackIndex) => {
        return track.courses.map((course, seqIndex) => ({
          name: course,
          x: corePositions[coreIndex].x + (trackIndex % 2 === 0 ? -1 : 1) * HORIZONTAL_OFFSET * (seqIndex + 1), // Offset left or right
          y: corePositions[coreIndex].y - (seqIndex + 1) * (height / 10), // Stack nodes vertically upwards
          track: track.code,
          isCore: false,
          branchStartIndex: coreIndex,
        }));
      });
    });

    return [...corePositions, ...branchPositions];
  };

  // 8. Generate paths connecting nodes
  const generatePaths = (nodePositions) => {
    const paths = [];

    // Core paths (connect horizontally)
    for (let i = 0; i < coreCourses.length - 1; i++) {
      const start = nodePositions.find(
        (n) => n.courseCode === coreCourses[i].courseCode
      );
      const end = nodePositions.find(
        (n) => n.courseCode === coreCourses[i + 1].courseCode
      );
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
          // Corrected line: Use coreCourses instead of trade.coreCourses
          const coreNode = nodePositions.find(
            (n) => n.isCore && n.rank === coreCourses[index]?.rank
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

  const getTrackColor = (trackCode) => {
    const track = specialtyTracks.find((t) => t.code === trackCode);
    return track ? track.color : '#e5e7eb';
  };

  return (
    <div className="w-full h-[600px]" ref={containerRef}>
      <div className="w-full h-full p-4 relative bg-white rounded-lg shadow">
        {/* Track Selection */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          {specialtyTracks.map((track) => (
            <button
              key={track.code}
              onClick={() =>
                setSelectedTrack(selectedTrack === track.code ? null : track.code)
              }
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                selectedTrack === track.code ? 'text-white' : 'text-gray-700'
              }`}
              style={{
                backgroundColor: selectedTrack === track.code ? track.color : '#f3f4f6',
              }}
            >
              {track.name}
            </button>
          ))}
        </div>

        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Paths */}
          {paths.map((path, index) => {
            const isHighlighted = selectedTrack && path.track === selectedTrack;
            const pathColor = path.isCore
              ? '#ef4444'
              : isHighlighted
              ? getTrackColor(path.track)
              : '#e5e7eb';

            return (
              <path
                key={`path-${index}`}
                d={`M ${path.start.x} ${path.start.y} 
                    C ${path.start.x} ${path.start.y + 50},
                      ${path.end.x} ${path.end.y - 50},
                      ${path.end.x} ${path.end.y}`}
                stroke={pathColor}
                strokeWidth={path.isCore ? '4' : '2'}
                fill="none"
                className="transition-all duration-300"
              />
            );
          })}

          {/* Nodes */}
          {nodePositions.map((node, index) => {
            const isHighlighted = selectedTrack && node.track === selectedTrack;
            const nodeColor = node.isCore
              ? '#ef4444'
              : isHighlighted
              ? getTrackColor(node.track)
              : '#f3f4f6';

            return (
              <g
                key={`node-${index}`}
                transform={`translate(${node.x},${node.y})`}
                onClick={() =>
                  setSelectedNode(selectedNode?.name === node.name ? null : node)
                }
                className="cursor-pointer"
              >
                <circle
                  r={NODE_RADIUS}
                  fill={selectedNode?.name === node.name ? nodeColor : '#fff'}
                  stroke={nodeColor}
                  strokeWidth={node.isCore ? '3' : '2'}
                  className="transition-colors duration-300"
                />

                <text
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className={`text-xs font-medium ${
                    selectedNode?.name === node.name ? 'fill-white' : 'fill-gray-700'
                  } pointer-events-none`}
                >
                  {node.name || node.courseCode}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Info Panel */}
        {selectedNode && (
          <CourseDetails selectedNode={selectedNode} specialtyTracks={specialtyTracks} />
        )}
      </div>
    </div>
  );
};

export default NetworkPath;
