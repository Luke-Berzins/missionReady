// Switch to the desired database
db = db.getSiblingDB('artillery_training');

// Drop existing collections to start fresh (optional)
db.trades.drop();
db.courses.drop();
db.specialty_tracks.drop();

// Insert trades
db.trades.insertMany([
  { code: "FIRE_CTRL", name: "Fire Control", description: "Precision targeting and fire control operations" },
  { code: "FIRE_SUP", name: "Fire Support", description: "Coordinating and delivering indirect fire support" },
  { code: "INFANTRY", name: "Infantry", description: "Frontline combat and tactical operations" },
  { code: "LOGISTICS", name: "Logistics", description: "Supply chain management and operational support" }
]);

// Insert core courses
db.courses.insertMany([
  // Fire Control
  { courseCode: "FIRE_CTRL_SAFE101", name: "Intro to Artillery Safety", type: "core", trade: "FIRE_CTRL", rank: "Cadet", hours: 40, description: "Essential safety practices for artillery operations" },
  { courseCode: "FIRE_CTRL_THEORY201", name: "Ballistics Fundamentals", type: "core", trade: "FIRE_CTRL", rank: "Second Lieutenant", hours: 80, prerequisites: ["FIRE_CTRL_SAFE101"] },
  { courseCode: "FIRE_CTRL_ADV301", name: "Advanced Artillery Systems", type: "core", trade: "FIRE_CTRL", rank: "Captain", hours: 120, prerequisites: ["FIRE_CTRL_THEORY201"] },

  // Fire Support
  { courseCode: "FIRE_SUP_SAFE101", name: "Operational Doctrine & Targeting", type: "core", trade: "FIRE_SUP", rank: "Cadet", hours: 40, description: "Fundamental fire support targeting and doctrine" },
  { courseCode: "FIRE_SUP_OBS201", name: "Forward Observer Techniques", type: "core", trade: "FIRE_SUP", rank: "Second Lieutenant", hours: 80, prerequisites: ["FIRE_SUP_SAFE101"] },
  { courseCode: "FIRE_SUP_JOINT301", name: "Joint Fire Planning", type: "core", trade: "FIRE_SUP", rank: "Captain", hours: 120, prerequisites: ["FIRE_SUP_OBS201"] },

  // Infantry
  { courseCode: "INFANTRY_BASIC101", name: "Basic Infantry Training", type: "core", trade: "INFANTRY", rank: "Cadet", hours: 60, description: "Fundamental skills and knowledge for infantry operations" },
  { courseCode: "INFANTRY_TACTICS201", name: "Infantry Tactics", type: "core", trade: "INFANTRY", rank: "Second Lieutenant", hours: 80, prerequisites: ["INFANTRY_BASIC101"] },
  { courseCode: "INFANTRY_LEAD301", name: "Leadership in Infantry", type: "core", trade: "INFANTRY", rank: "Captain", hours: 100, prerequisites: ["INFANTRY_TACTICS201"] },

  // Logistics
  { courseCode: "LOGISTICS_FOUND101", name: "Foundations of Logistics", type: "core", trade: "LOGISTICS", rank: "Cadet", hours: 50, description: "Introduction to logistics principles and supply chain management" },
  { courseCode: "LOGISTICS_MANAGE201", name: "Logistics Management", type: "core", trade: "LOGISTICS", rank: "Second Lieutenant", hours: 70, prerequisites: ["LOGISTICS_FOUND101"] },
  { courseCode: "LOGISTICS_STRAT301", name: "Strategic Logistics", type: "core", trade: "LOGISTICS", rank: "Captain", hours: 90, prerequisites: ["LOGISTICS_MANAGE201"] }
]);

// Insert specialty tracks
db.specialty_tracks.insertMany([
  // Fire Control
  { name: "Advanced Fire Control Systems", code: "FIRE_CTRL_ADV", trade: "FIRE_CTRL", description: "Expert-level training in advanced fire control", color: "#ef4444", courses: ["FIRE_CTRL_ADV201", "FIRE_CTRL_ADV202", "FIRE_CTRL_ADV203"], minimumRank: "Captain" },
  { name: "Tactical Gunnery", code: "FIRE_CTRL_GUN", trade: "FIRE_CTRL", description: "Specialized training in gunnery techniques", color: "#10b981", courses: ["FIRE_CTRL_GUN201", "FIRE_CTRL_GUN202", "FIRE_CTRL_GUN203"], minimumRank: "Second Lieutenant" },

  // Fire Support
  { name: "Target Acquisition", code: "FIRE_SUP_TACQ", trade: "FIRE_SUP", description: "Advanced methods for identifying and prioritizing targets", color: "#3b82f6", courses: ["FIRE_SUP_TACQ201", "FIRE_SUP_TACQ202", "FIRE_SUP_TACQ203"], minimumRank: "Second Lieutenant" },
  { name: "Combined Arms Integration", code: "FIRE_SUP_CA", trade: "FIRE_SUP", description: "Mastering fire support in combined arms operations", color: "#8b5cf6", courses: ["FIRE_SUP_CA201", "FIRE_SUP_CA202", "FIRE_SUP_CA203"], minimumRank: "Captain" },

  // Infantry
  { name: "Urban Warfare", code: "INFANTRY_UW", trade: "INFANTRY", description: "Specialized training in urban combat and maneuvering", color: "#f59e0b", courses: ["INFANTRY_UW201", "INFANTRY_UW202", "INFANTRY_UW203"], minimumRank: "Second Lieutenant" },
  { name: "Reconnaissance", code: "INFANTRY_REC", trade: "INFANTRY", description: "Techniques and strategies for effective reconnaissance missions", color: "#10b981", courses: ["INFANTRY_REC201", "INFANTRY_REC202", "INFANTRY_REC203"], minimumRank: "Second Lieutenant" },

  // Logistics
  { name: "Inventory Management", code: "LOGISTICS_INV", trade: "LOGISTICS", description: "Advanced methods for managing and optimizing inventory", color: "#3b82f6", courses: ["LOGISTICS_INV201", "LOGISTICS_INV202", "LOGISTICS_INV203"], minimumRank: "Second Lieutenant" },
  { name: "Procurement Strategies", code: "LOGISTICS_PROC", trade: "LOGISTICS", description: "Strategic procurement and supplier relationship management", color: "#8b5cf6", courses: ["LOGISTICS_PROC201", "LOGISTICS_PROC202", "LOGISTICS_PROC203"], minimumRank: "Captain" }
]);
