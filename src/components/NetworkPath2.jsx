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
      <div className="w-full h-[600px] flex items-center justify-center bg-gray-900 text-gray-200">
        <p className="text-lg">Loading training path data...</p>
      </div>
    );
  }

  const { coreCourses, specialtyTracks } = branchData;

  const getRankZones = () => [
    {
      name: "Cadet",
      color: "#4a4a4a",
      startX: 0,
      endX: dimensions.width * 0.25
    },
    {
      name: "2Lt",
      color: "#374151",
      startX: dimensions.width * 0.25,
      endX: dimensions.width * 0.5
    },
    {
      name: "1Lt",
      color: "#1f2937",
      startX: dimensions.width * 0.5,
      endX: dimensions.width * 0.75
    },
    {
      name: "Capt",
      color: "#111827",
      startX: dimensions.width * 0.75,
      endX: dimensions.width
    }
  ];

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
                x={zone.startX}
                y={0}
                width={zone.endX - zone.startX}
                height={dimensions.height}
                fill={zone.color}
              />
              <text
                x={(zone.startX + zone.endX) / 2}
                y={40}
                textAnchor="middle"
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
                  className="transition-colors duration-300"
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
        {selectedNode && (
          <div className="absolute bottom-4 left-4 bg-gray-800 p-4 rounded-lg border border-gray-700">
            <h3 className="font-bold text-sm text-gray-200">
              {selectedNode.name || selectedNode.courseCode}
            </h3>
            {selectedNode.isCore ? (
              <>
                <p className="text-sm text-gray-400">Rank: {selectedNode.rank}</p>
                <p className="text-sm text-red-400">Required Hours: {selectedNode.hours}</p>
              </>
            ) : (
              <p className="text-sm text-gray-400">
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