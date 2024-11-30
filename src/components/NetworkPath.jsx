import React, { useState, useEffect, useRef } from 'react';

const DEFAULT_WIDTH = 1000;
const DEFAULT_HEIGHT = 600;
const NODE_RADIUS = 35;
const VERTICAL_OFFSET = 120;
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
      <div className="w-full h-[600px] flex items-center justify-center">
        <p className="text-lg text-gray-600">Loading training path data...</p>
      </div>
    );
  }

  const { coreCourses, specialtyTracks } = branchData;

  const calculatePositions = () => {
    const { width, height } = dimensions;
    const horizontalSpacing = width / (coreCourses.length + 1);
    
    const corePositions = coreCourses.map((course, index) => ({
      ...course,
      x: horizontalSpacing * (index + 1),
      y: height / 2,
      isCore: true
    }));

    const branchPositions = coreCourses.flatMap((coreCourse, coreIndex) => {
      const relevantTracks = specialtyTracks.filter(track => 
        track.minimumRank === coreCourse.rank
      );

      return relevantTracks.flatMap((track, trackIndex) => {
        const startX = horizontalSpacing * (coreIndex + 1);
        const direction = trackIndex % 2 === 0 ? 1 : -1;

        return track.courses.map((course, seqIndex) => ({
          name: course,
          x: startX + (horizontalSpacing * 0.8 * (seqIndex + 1)),
          y: height/2 + (direction * VERTICAL_OFFSET * (seqIndex + 1)),
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
    
    // Core paths
    for (let i = 0; i < coreCourses.length - 1; i++) {
      const start = nodePositions.find(n => n.courseCode === coreCourses[i].courseCode);
      const end = nodePositions.find(n => n.courseCode === coreCourses[i + 1].courseCode);
      if (start && end) {
        paths.push({
          start,
          end,
          isCore: true
        });
      }
    }

    // Branch paths
    specialtyTracks.forEach(track => {
      const trackNodes = nodePositions.filter(n => n.track === track.code);
      trackNodes.forEach((node, index) => {
        if (index > 0) {
          paths.push({
            start: trackNodes[index - 1],
            end: node,
            track: track.code
          });
        } else {
          const coreNode = nodePositions.find(n => 
            n.isCore && n.rank === track.minimumRank
          );
          if (coreNode) {
            paths.push({
              start: coreNode,
              end: node,
              track: track.code
            });
          }
        }
      });
    });

    return paths;
  };

  const nodePositions = calculatePositions();
  const paths = generatePaths(nodePositions);

  const getTrackColor = (trackCode) => {
    const track = specialtyTracks.find(t => t.code === trackCode);
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
              onClick={() => setSelectedTrack(
                selectedTrack === track.code ? null : track.code
              )}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                selectedTrack === track.code ? 'text-white' : 'text-gray-700'
              }`}
              style={{
                backgroundColor: selectedTrack === track.code ? track.color : '#f3f4f6'
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
            const pathColor = path.isCore ? "#ef4444" : 
                            (isHighlighted ? getTrackColor(path.track) : "#e5e7eb");
            
            return (
              <path
                key={`path-${index}`}
                d={`M ${path.start.x} ${path.start.y} 
                    C ${path.start.x + 50} ${path.start.y},
                      ${path.end.x - 50} ${path.end.y},
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
            const nodeColor = node.isCore ? "#ef4444" : 
                            (isHighlighted ? getTrackColor(node.track) : "#f3f4f6");
            
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
                  fill={selectedNode?.name === node.name ? nodeColor : '#fff'}
                  stroke={nodeColor}
                  strokeWidth={node.isCore ? "3" : "2"}
                  className="transition-colors duration-300"
                />
                
                <text
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className={`text-xs font-medium ${
                    selectedNode?.name === node.name ? "fill-white" : "fill-gray-700"
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
          <div className="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg border border-gray-200">
            <h3 className="font-bold text-sm">{selectedNode.name || selectedNode.courseCode}</h3>
            {selectedNode.isCore ? (
              <>
                <p className="text-sm text-gray-600">Rank: {selectedNode.rank}</p>
                <p className="text-sm text-red-600">Required Hours: {selectedNode.hours}</p>
              </>
            ) : (
              <p className="text-sm text-gray-600">
                {specialtyTracks.find(t => t.code === selectedNode.track)?.name} Track
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NetworkPath;