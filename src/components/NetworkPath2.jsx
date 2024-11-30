import React, { useState, useEffect, useRef } from 'react';

const DEFAULT_WIDTH = 1000;
const DEFAULT_HEIGHT = 600;
const NODE_RADIUS = 35;
const VERTICAL_OFFSET = 120;

// Define the core sequential path
const coreSequence = [
    {
      name: "Intro to Artillery Safety",
      hours: 40,
      rank: "Cadet",
      branchTracks: ["fireControl"]
    },
    {
      name: "Ballistics Fundamentals",
      hours: 80,
      rank: "Second Lieutenant",
      branchTracks: ["fireSupport"]
    },
    {
      name: "Operational Doctrine & Targeting",
      hours: 100,
      rank: "First Lieutenant",
      branchTracks: ["maintenance"]
    },
    {
      name: "Advanced Artillery Systems",
      hours: 120,
      rank: "Captain",
      branchTracks: []
    }
  ];
  
  // define specialty tracks that branch off
  const specialtyTracks = {
    fireControl: {
      name: "Fire Control",
      color: "#10b981", // green
      sequence: ["Gunnery Calculations", "Tactical Fire Control", "Command Systems Integration"]
    },
    fireSupport: {
      name: "Fire Support",
      color: "#3b82f6", // blue
      sequence: ["Forward Observer Techniques", "Target Acquisition", "Joint Fire Planning"]
    },
    maintenance: {
      name: "Maintenance & Logistics",
      color: "#8b5cf6", // purple
      sequence: ["Diagnostics & Repairs", "Supply Chain for Artillery Units", "Preventive Maintenance"]
    }
  };
  const NetworkPath2 = () => {
    const [selectedNode, setSelectedNode] = useState(null);
    const [selectedTrack, setSelectedTrack] = useState(null);
    const [dimensions, setDimensions] = useState({
      width: DEFAULT_WIDTH,
      height: DEFAULT_HEIGHT
    });
    const containerRef = useRef(null);
  
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
  
    const calculatePositions = () => {
      const { width, height } = dimensions;
      const horizontalSpacing = width / (coreSequence.length + 1);
  
      const corePositions = coreSequence.map((node, index) => ({
        ...node,
        x: horizontalSpacing * (index + 1),
        y: height / 2,
        isCore: true
      }));
  
      const branchPositions = coreSequence.flatMap((coreNode, coreIndex) => {
        return coreNode.branchTracks.flatMap(trackName => {
          const track = specialtyTracks[trackName];
          const startX = horizontalSpacing * (coreIndex + 1);
          const direction = coreIndex % 2 === 0 ? 1 : -1;
  
          return track.sequence.map((name, seqIndex) => ({
            name,
            x: startX + horizontalSpacing * 0.8 * (seqIndex + 1),
            y: height / 2 + direction * VERTICAL_OFFSET * (seqIndex + 1),
            track: trackName,
            isCore: false,
            branchStartIndex: coreIndex
          }));
        });
      });
  
      return [...corePositions, ...branchPositions];
    };
  
    const generatePaths = (nodePositions) => {
      const paths = [];
  
      for (let i = 0; i < coreSequence.length - 1; i++) {
        const start = nodePositions.find(n => n.name === coreSequence[i].name);
        const end = nodePositions.find(n => n.name === coreSequence[i + 1].name);
        paths.push({
          start,
          end,
          isCore: true
        });
      }
  
      nodePositions.forEach(node => {
        if (!node.isCore && node.track) {
          const branchStart = nodePositions.find(n => 
            n.isCore && coreSequence[node.branchStartIndex].name === n.name
          );
  
          if (specialtyTracks[node.track].sequence[0] === node.name) {
            paths.push({
              start: branchStart,
              end: node,
              track: node.track
            });
          }
  
          const trackSeq = specialtyTracks[node.track].sequence;
          const nodeIndex = trackSeq.indexOf(node.name);
          if (nodeIndex < trackSeq.length - 1) {
            const nextNode = nodePositions.find(n => 
              n.name === trackSeq[nodeIndex + 1] && n.track === node.track
            );
            paths.push({
              start: node,
              end: nextNode,
              track: node.track
            });
          }
        }
      });
  
      return paths;
    };
  
    const getRankZones = () => [
      {
        name: "2 Lt",
        color: "#4a4a4a",
        startX: 0,
        endX: dimensions.width * 0.25
      },
      {
        name: "Lt",
        color: "#374151",
        startX: dimensions.width * 0.25,
        endX: dimensions.width * 0.5
      },
      {
        name: "Capt",
        color: "#1f2937",
        startX: dimensions.width * 0.5,
        endX: dimensions.width * 0.75
      },
      {
        name: "Maj",
        color: "#111827",
        startX: dimensions.width * 0.75,
        endX: dimensions.width
      }
    ];
  
    const nodePositions = calculatePositions();
    const paths = generatePaths(nodePositions);
    const rankZones = getRankZones();
  
    return (
      <div
        style={{
          width: '100%',
          height: '600px',
          backgroundColor: '#2c2c2c',
          color: '#f9fafb',
          fontFamily: "'OCR A Std', monospace",
          position: 'relative'
        }}
        ref={containerRef}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            position: 'relative',
            border: '1px solid #4b5563',
            borderRadius: '8px',
            padding: '16px'
          }}
        >
          <div style={{ position: 'absolute', top: '16px', right: '16px', display: 'flex', gap: '8px' }}>
            {Object.entries(specialtyTracks).map(([trackName, track]) => (
              <button
                key={trackName}
                onClick={() => setSelectedTrack(selectedTrack === trackName ? null : trackName)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  backgroundColor: selectedTrack === trackName ? track.color : '#4a4a4a',
                  color: selectedTrack === trackName ? '#fff' : '#e5e7eb',
                  border: '1px solid #374151'
                }}
              >
                {track.name} Track
              </button>
            ))}
          </div>
  
          <svg width="100%" height="100%" viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}>
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
                  style={{ fill: '#e5e7eb', fontSize: '14px', fontWeight: 'bold' }}
                >
                  {zone.name}
                </text>
              </g>
            ))}
  
            {paths.map((path, index) => (
              <path
                key={`path-${index}`}
                d={`M ${path.start.x} ${path.start.y}
                    C ${path.start.x + 50} ${path.start.y},
                      ${path.end.x - 50} ${path.end.y},
                      ${path.end.x} ${path.end.y}`}
                stroke={
                  selectedTrack && path.track === selectedTrack
                    ? specialtyTracks[path.track].color
                    : path.isCore
                    ? '#ef4444'
                    : '#6b7280'
                }
                strokeWidth={path.isCore ? '4' : '2'}
                fill="none"
              />
            ))}
  
            {nodePositions.map((node, index) => (
              <g
                key={`node-${index}`}
                transform={`translate(${node.x},${node.y})`}
                onClick={() => setSelectedNode(selectedNode?.name === node.name ? null : node)}
                style={{ cursor: 'pointer' }}
              >
                <circle
                  r={NODE_RADIUS}
                  fill={
                    selectedNode?.name === node.name
                      ? specialtyTracks[node.track]?.color || '#374151'
                      : selectedTrack === node.track
                      ? specialtyTracks[node.track]?.color || '#4a4a4a'
                      : '#1f2937'
                  }
                  stroke={node.isCore ? '#ef4444' : specialtyTracks[node.track]?.color || '#6b7280'}
                  strokeWidth="3"
                />
                <text
                  textAnchor="middle"
                  dominantBaseline="middle"
                  style={{ fill: '#e5e7eb', fontSize: '10px', fontWeight: 'bold', pointerEvents: 'none' }}
                >
                  {node.name}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>
    );
  };
  
  

export default NetworkPath2;