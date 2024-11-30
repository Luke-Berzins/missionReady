// src/components/NetworkPath.jsx

import React, { useState, useEffect, useRef } from 'react';
import { Compass } from 'lucide-react';
import './css/NetworkPath.css';

const DEFAULT_WIDTH = 600;
const DEFAULT_HEIGHT = 800;
const VERTICAL_OFFSET = 150;
const NODE_RADIUS = 8;
const API_URL = 'http://localhost:3000';

const NetworkPath = ({ tradeCode, selectedNode, setSelectedNode }) => {
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [dimensions, setDimensions] = useState({
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
  });
  const [tradeData, setTradeData] = useState(null);
  const containerRef = useRef(null);

  // Fetch data Hook
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/api/trades/${tradeCode}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Fetched trade data:', data);
        setTradeData(data);
      } catch (error) {
        console.error('Error fetching trade data:', error);
      }
    };

    fetchData();
  }, [tradeCode]);

  // Handle resize Hook
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth || DEFAULT_WIDTH,
          height: containerRef.current.offsetHeight || DEFAULT_HEIGHT,
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!tradeData) {
    return (
      <div className="w-full h-full bg-olive-50 flex items-center justify-center">
        <p className="font-military text-olive-800 text-lg tracking-wider uppercase">
          Loading training path data...
        </p>
      </div>
    );
  }

  const { trade, coreCourses, specialtyTracks } = tradeData;

  // Calculate node positions for vertical layout
  const calculatePositions = () => {
    const { width, height } = dimensions;
    const verticalSpacing = height / (coreCourses.length + 2);
    const topOffset = verticalSpacing * 0.5; // Reduced top spacing
    const horizontalCenter = width / 2;

    const corePositions = coreCourses.map((course, index) => ({
      ...course,
      x: horizontalCenter,
      y: topOffset + verticalSpacing * index,
      isCore: true,
    }));

    const branchPositions = coreCourses.flatMap((coreCourse, coreIndex) => {
      const relevantTracks = specialtyTracks.filter(
        (track) => track.minimumRank === coreCourse.rank
      );

      return relevantTracks.flatMap((track, trackIndex) => {
        return track.courses.map((course, seqIndex) => ({
          name: course,
          x:
            corePositions[coreIndex].x +
            (seqIndex % 2 === 0 ? -1 : 1) * VERTICAL_OFFSET * (seqIndex + 1),
          y: corePositions[coreIndex].y + (trackIndex + 1) * VERTICAL_OFFSET,
          track: track.code,
          isCore: false,
          branchStartIndex: coreIndex,
          rank: track.minimumRank,
        }));
      });
    });

    return [...corePositions, ...branchPositions];
  };

  const nodePositions = calculatePositions();

  // Generate paths
  const generatePaths = (nodePositions) => {
    const paths = [];

    // Core paths
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

  const paths = generatePaths(nodePositions);

  const getTrackColor = (trackCode) => {
    const track = specialtyTracks.find((t) => t.code === trackCode);
    return track ? track.color : '#4A5F31';
  };

  const gridSize = 20;

  // Calculate rank positions
  const calculateRankPositions = () => {
    const ranks = [...new Set(nodePositions.map((node) => node.rank))];
    ranks.sort((a, b) => a - b); // Assuming ranks are numerical values

    const rankPositions = ranks.map((rank) => {
      // Find nodes with this rank
      const nodesAtRank = nodePositions.filter((node) => node.rank === rank);
      // Calculate the min and max Y positions for this rank
      const minY = Math.min(...nodesAtRank.map((node) => node.y));
      const maxY = Math.max(...nodesAtRank.map((node) => node.y));
      return { rank, minY, maxY };
    });

    return rankPositions;
  };

  const rankPositions = calculateRankPositions();

  return (
    <div className="w-full h-full bg-olive-50 relative" ref={containerRef}>
      {/* Topographical Background */}
      <div className="absolute inset-0 opacity-10">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-full h-full"
            style={{
              background: `radial-gradient(circle at ${Math.random() * 100}% ${
                Math.random() * 100
              }%, #4A5F31 0%, transparent ${20 + Math.random() * 40}%)`,
            }}
          />
        ))}
      </div>

      {/* Compass Rose */}
      <div className="absolute top-2 right-2 bg-olive-100 rounded-full p-2 shadow-lg border-2 border-olive-800">
        <Compass className="w-6 h-6 text-olive-800" />
      </div>

      {/* Track Selection */}
      <div className="track-selection-container">
        {specialtyTracks.map((track) => (
          <button
            key={track.code}
            onClick={() =>
              setSelectedTrack(selectedTrack === track.code ? null : track.code)
            }
            className={`track-button ${
              selectedTrack === track.code ? 'selected' : ''
            }`}
            aria-pressed={selectedTrack === track.code}
            aria-label={`Select ${track.name} Track`}
          >
            {track.name}
            {/* CSS-Only Tooltip */}
            <span className="tooltip-text">{track.name}</span>
          </button>
        ))}
      </div>

      {/* Scrollable Content Area */}
      <div className="scrollable-content">
        <svg
          className="w-full h-full"
          viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
          preserveAspectRatio="xMidYMid meet"
          style={{ background: 'rgba(74, 95, 49, 0.05)' }}
        >
          {/* Grid Pattern */}
          <defs>
            <pattern
              id="grid"
              width={gridSize}
              height={gridSize}
              patternUnits="userSpaceOnUse"
            >
              <path
                d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`}
                fill="none"
                stroke="#4A5F31"
                strokeWidth="0.5"
                strokeOpacity="0.2"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Rank Zones */}
          {rankPositions.map((rankZone, index) => (
            <g key={`rank-zone-${index}`}>
              <rect
                x={0}
                y={rankZone.minY - NODE_RADIUS * 2}
                width={dimensions.width}
                height={rankZone.maxY - rankZone.minY + NODE_RADIUS * 4}
                fill={
                  index % 2 === 0
                    ? 'rgba(113, 131, 85, 0.1)'
                    : 'rgba(113, 131, 85, 0.2)'
                }
              />
              <text
                x={10} // Adjust as needed
                y={rankZone.minY - NODE_RADIUS - 5} // Slightly above the top of the zone
                fill="#4A5F31"
                fontFamily="'Military', monospace"
                fontSize="14"
                fontWeight="bold"
                textAnchor="start"
              >
                Rank {rankZone.rank}
              </text>
            </g>
          ))}

          {/* Paths */}
          {paths.map((path, index) => {
            const isHighlighted = selectedTrack && path.track === selectedTrack;
            const pathColor = path.isCore
              ? '#4A5F31'
              : isHighlighted
              ? getTrackColor(path.track)
              : '#8B4513';

            return (
              <g key={`path-${index}`}>
                <path
                  d={`M ${path.start.x} ${path.start.y} C ${
                    path.start.x + 50
                  } ${path.start.y}, ${path.end.x - 50} ${path.end.y}, ${
                    path.end.x
                  } ${path.end.y}`}
                  stroke={pathColor}
                  strokeWidth={path.isCore ? 4 : 2}
                  strokeDasharray={path.isCore ? '' : '5,5'}
                  fill="none"
                  className="transition-all duration-300"
                />
              </g>
            );
          })}

          {/* Nodes */}
          {nodePositions.map((node, index) => {
            const isHighlighted = selectedTrack && node.track === selectedTrack;
            const nodeColor = node.isCore
              ? '#4A5F31'
              : isHighlighted
              ? getTrackColor(node.track)
              : '#8B4513';
            const isSelected = selectedNode?.name === node.name;

            return (
              <g
                key={`node-${index}`}
                transform={`translate(${node.x},${node.y})`}
                className="cursor-pointer transition-transform hover:scale-110"
                onClick={() => setSelectedNode(isSelected ? null : node)}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setSelectedNode(isSelected ? null : node);
                  }
                }}
                aria-pressed={isSelected}
                aria-label={`Select course ${node.name || node.courseCode}`}
              >
                <circle
                  r={NODE_RADIUS}
                  fill={isSelected ? nodeColor : '#F4F6E9'}
                  stroke={nodeColor}
                  strokeWidth={node.isCore ? 3 : 2}
                  className="transition-all duration-300"
                />
                <text
                  y={20}
                  textAnchor="middle"
                  className={`text-xs font-military ${
                    isSelected ? 'fill-olive-800' : 'fill-olive-700'
                  }`}
                  style={{ textTransform: 'uppercase' }}
                >
                  {node.name || node.courseCode}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default NetworkPath;
