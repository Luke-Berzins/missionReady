// Switch to the desired database
db = db.getSiblingDB('artillery_training');

// trades (formerly branches)
db.trades.insertMany([
  {
    code: "FIRE_CTRL",
    name: "Fire Control",
    description: "Precision targeting and fire control operations"
  },
  {
    code: "FIRE_SUP",
    name: "Fire Support",
    description: "Coordinating and delivering indirect fire support"
  },
  // Add new trades here
  {
    code: "INFANTRY",
    name: "Infantry",
    description: "Frontline combat and tactical operations"
  },
  {
    code: "LOGISTICS",
    name: "Logistics",
    description: "Supply chain management and operational support"
  }
]);

// Core courses - Fire Control
db.courses.insertMany([
  {
    courseCode: "FIRE_CTRL_SAFE101",
    name: "Intro to Artillery Safety",
    type: "core",
    trade: "FIRE_CTRL",
    rank: "Cadet",
    hours: 40,
    description: "Essential safety practices for artillery operations"
  },
  {
    courseCode: "FIRE_CTRL_THEORY201",
    name: "Ballistics Fundamentals",
    type: "core",
    trade: "FIRE_CTRL",
    rank: "Second Lieutenant",
    hours: 80,
    prerequisites: ["FIRE_CTRL_SAFE101"]
  },
  {
    courseCode: "FIRE_CTRL_ADV301",
    name: "Advanced Artillery Systems",
    type: "core",
    trade: "FIRE_CTRL",
    rank: "Captain",
    hours: 120,
    prerequisites: ["FIRE_CTRL_THEORY201"]
  }
]);

// Core courses - Fire Support
db.courses.insertMany([
  {
    courseCode: "FIRE_SUP_SAFE101",
    name: "Operational Doctrine & Targeting",
    type: "core",
    trade: "FIRE_SUP",
    rank: "Cadet",
    hours: 40,
    description: "Fundamental fire support targeting and doctrine"
  },
  {
    courseCode: "FIRE_SUP_OBS201",
    name: "Forward Observer Techniques",
    type: "core",
    trade: "FIRE_SUP",
    rank: "Second Lieutenant",
    hours: 80,
    prerequisites: ["FIRE_SUP_SAFE101"]
  },
  {
    courseCode: "FIRE_SUP_JOINT301",
    name: "Joint Fire Planning",
    type: "core",
    trade: "FIRE_SUP",
    rank: "Captain",
    hours: 120,
    prerequisites: ["FIRE_SUP_OBS201"]
  }
]);

// Specialty tracks - Fire Control
db.specialty_tracks.insertMany([
  {
    name: "Advanced Fire Control Systems",
    code: "FIRE_CTRL_ADV",
    trade: "FIRE_CTRL",
    description: "Expert-level training in advanced fire control",
    color: "#ef4444", // deep red
    courses: ["FIRE_CTRL_ADV201", "FIRE_CTRL_ADV202", "FIRE_CTRL_ADV203"],
    minimumRank: "Captain"
  },
  {
    name: "Tactical Gunnery",
    code: "FIRE_CTRL_GUN",
    trade: "FIRE_CTRL",
    description: "Specialized training in gunnery techniques",
    color: "#10b981", // green
    courses: ["FIRE_CTRL_GUN201", "FIRE_CTRL_GUN202", "FIRE_CTRL_GUN203"],
    minimumRank: "Second Lieutenant"
  }
]);

// Specialty tracks - Fire Support
db.specialty_tracks.insertMany([
  {
    name: "Target Acquisition",
    code: "FIRE_SUP_TACQ",
    trade: "FIRE_SUP",
    description: "Advanced methods for identifying and prioritizing targets",
    color: "#3b82f6", // blue
    courses: ["FIRE_SUP_TACQ201", "FIRE_SUP_TACQ202", "FIRE_SUP_TACQ203"],
    minimumRank: "Second Lieutenant"
  },
  {
    name: "Combined Arms Integration",
    code: "FIRE_SUP_CA",
    trade: "FIRE_SUP",
    description: "Mastering fire support in combined arms operations",
    color: "#8b5cf6", // purple
    courses: ["FIRE_SUP_CA201", "FIRE_SUP_CA202", "FIRE_SUP_CA203"],
    minimumRank: "Captain"
  }
]);

// Insert courses and tracks for new trades (e.g., Infantry, Logistics) similarly
