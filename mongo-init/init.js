// mongo-init/init.js
db = db.getSiblingDB('career_paths');

// Trades
db.trades.insertMany([
  {
    code: "ELEC",
    name: "Electrical",
    description: "Electrical systems installation and maintenance"
  },
  {
    code: "PLUM",
    name: "Plumbing",
    description: "Plumbing systems installation and maintenance"
  }
]);

// Core Courses - Electrical
db.courses.insertMany([
  {
    courseCode: "ELEC_SAFE101",
    name: "Electrical Safety Basics",
    type: "core",
    trade: "ELEC",
    rank: "Entry Level",
    hours: 40,
    description: "Fundamental electrical safety practices"
  },
  {
    courseCode: "ELEC_THEORY201",
    name: "Electrical Theory",
    type: "core",
    trade: "ELEC",
    rank: "Apprentice",
    hours: 80,
    prerequisites: ["ELEC_SAFE101"]
  },
  {
    courseCode: "ELEC_CODE301",
    name: "Electrical Code & Standards",
    type: "core",
    trade: "ELEC",
    rank: "Apprentice",
    hours: 100,
    prerequisites: ["ELEC_THEORY201"]
  }
]);

// Core Courses - Plumbing
db.courses.insertMany([
  {
    courseCode: "PLUM_SAFE101",
    name: "Plumbing Safety Basics",
    type: "core",
    trade: "PLUM",
    rank: "Entry Level",
    hours: 40,
    description: "Fundamental plumbing safety practices"
  },
  {
    courseCode: "PLUM_PIPE201",
    name: "Pipe Theory & Systems",
    type: "core",
    trade: "PLUM",
    rank: "Apprentice",
    hours: 80,
    prerequisites: ["PLUM_SAFE101"]
  },
  {
    courseCode: "PLUM_CODE301",
    name: "Plumbing Code & Standards",
    type: "core",
    trade: "PLUM",
    rank: "Apprentice",
    hours: 100,
    prerequisites: ["PLUM_PIPE201"]
  }
]);

// Specialty Tracks - Electrical
db.specialty_tracks.insertMany([
  {
    name: "Residential Electrical",
    code: "ELEC_RES",
    trade: "ELEC",
    description: "Residential electrical installations",
    color: "#10b981",
    courses: ["ELEC_RES101", "ELEC_RES102", "ELEC_RES103"],
    minimumRank: "Apprentice"
  },
  {
    name: "Industrial Electrical",
    code: "ELEC_IND",
    trade: "ELEC",
    description: "Industrial electrical systems",
    color: "#3b82f6",
    courses: ["ELEC_IND101", "ELEC_IND102", "ELEC_IND103"],
    minimumRank: "Apprentice"
  }
]);

// Specialty Tracks - Plumbing
db.specialty_tracks.insertMany([
  {
    name: "Residential Plumbing",
    code: "PLUM_RES",
    trade: "PLUM",
    description: "Residential plumbing installations",
    color: "#10b981",
    courses: ["PLUM_RES101", "PLUM_RES102", "PLUM_RES103"],
    minimumRank: "Apprentice"
  },
  {
    name: "Commercial Plumbing",
    code: "PLUM_COM",
    trade: "PLUM",
    description: "Commercial plumbing systems",
    color: "#3b82f6",
    courses: ["PLUM_COM101", "PLUM_COM102", "PLUM_COM103"],
    minimumRank: "Apprentice"
  },
  {
    name: "Industrial Plumbing",
    code: "PLUM_IND",
    trade: "PLUM",
    description: "Industrial plumbing systems",
    color: "#8b5cf6",
    courses: ["PLUM_IND101", "PLUM_IND102", "PLUM_IND103"],
    minimumRank: "Journeyman"
  }
]);