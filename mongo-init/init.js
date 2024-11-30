// Switch to the desired database
db = db.getSiblingDB('artillery_training');

// Drop existing collections to start fresh (optional)
db.trades.drop();
db.courses.drop();
db.specialty_tracks.drop();
db.ranks.drop();
db.course_sessions.drop(); // Add this line to drop course_sessions if re-running the script

// Insert ranks
db.ranks.insertMany([
  // Commissioned Ranks
  { rank: "Officer Cadet", order: 1, description: "Entry-level rank for training and initiation.", commissioned: true },
  { rank: "Second Lieutenant", order: 2, description: "Junior officer rank responsible for basic leadership.", commissioned: true },
  { rank: "Lieutenant", order: 3, description: "Intermediate officer rank with leadership and tactical responsibilities.", commissioned: true },
  { rank: "Captain", order: 4, description: "Senior officer rank managing larger operations and units.", commissioned: true },
  { rank: "Major", order: 5, description: "Field officer rank overseeing major missions and strategic planning.", commissioned: true },
  // Non-Commissioned Ranks
  { rank: "Private Recruit", order: 6, description: "Initial rank for new recruits.", commissioned: false },
  { rank: "Private", order: 7, description: "Basic trained soldier.", commissioned: false },
  { rank: "Corporal", order: 8, description: "Junior NCO with leadership potential.", commissioned: false },
  { rank: "Master Corporal", order: 9, description: "NCO responsible for small unit leadership.", commissioned: false },
  { rank: "Sergeant", order: 10, description: "Senior NCO responsible for unit discipline and training.", commissioned: false },
  { rank: "Warrant Officer", order: 11, description: "Experienced NCO with significant responsibilities.", commissioned: false },
  { rank: "Master Warrant Officer", order: 12, description: "Senior NCO involved in high-level operations.", commissioned: false },
  { rank: "Chief Warrant Officer", order: 13, description: "Highest non-commissioned rank with leadership over NCOs.", commissioned: false }
]);

// Insert trades with the 'commissioned' field
db.trades.insertMany([
  { code: "FIRE_CTRL", name: "Fire Control", description: "Precision targeting and fire control operations", commissioned: true },
  { code: "FIRE_SUP", name: "Fire Support", description: "Coordinating and delivering indirect fire support", commissioned: true },
  { code: "INFANTRY", name: "Infantry", description: "Frontline combat and tactical operations", commissioned: false },
  { code: "LOGISTICS", name: "Logistics", description: "Supply chain management and operational support", commissioned: false }
]);

// Insert core courses
db.courses.insertMany([
  // Fire Control (Commissioned Trade)
  { courseCode: "FIRE_CTRL_SAFE101", name: "Intro to Artillery Safety", type: "core", trade: "FIRE_CTRL", rank: "Officer Cadet", hours: 40, description: "Essential safety practices for artillery operations" },
  { courseCode: "FIRE_CTRL_THEORY201", name: "Ballistics Fundamentals", type: "core", trade: "FIRE_CTRL", rank: "Second Lieutenant", hours: 80, prerequisites: ["FIRE_CTRL_SAFE101"] },
  { courseCode: "FIRE_CTRL_ADV301", name: "Advanced Artillery Systems", type: "core", trade: "FIRE_CTRL", rank: "Captain", hours: 120, prerequisites: ["FIRE_CTRL_THEORY201"] },

  // Fire Support (Commissioned Trade)
  { courseCode: "FIRE_SUP_SAFE101", name: "Operational Doctrine & Targeting", type: "core", trade: "FIRE_SUP", rank: "Officer Cadet", hours: 40, description: "Fundamental fire support targeting and doctrine" },
  { courseCode: "FIRE_SUP_OBS201", name: "Forward Observer Techniques", type: "core", trade: "FIRE_SUP", rank: "Second Lieutenant", hours: 80, prerequisites: ["FIRE_SUP_SAFE101"] },
  { courseCode: "FIRE_SUP_JOINT301", name: "Joint Fire Planning", type: "core", trade: "FIRE_SUP", rank: "Captain", hours: 120, prerequisites: ["FIRE_SUP_OBS201"] },

  // Infantry (Non-Commissioned Trade)
  { courseCode: "INFANTRY_BASIC101", name: "Basic Infantry Training", type: "core", trade: "INFANTRY", rank: "Private Recruit", hours: 60, description: "Fundamental skills and knowledge for infantry operations" },
  { courseCode: "INFANTRY_TACTICS201", name: "Infantry Tactics", type: "core", trade: "INFANTRY", rank: "Corporal", hours: 80, prerequisites: ["INFANTRY_BASIC101"] },
  { courseCode: "INFANTRY_LEAD301", name: "Leadership in Infantry", type: "core", trade: "INFANTRY", rank: "Sergeant", hours: 100, prerequisites: ["INFANTRY_TACTICS201"] },

  // Logistics (Non-Commissioned Trade)
  { courseCode: "LOGISTICS_FOUND101", name: "Foundations of Logistics", type: "core", trade: "LOGISTICS", rank: "Private Recruit", hours: 50, description: "Introduction to logistics principles and supply chain management" },
  { courseCode: "LOGISTICS_MANAGE201", name: "Logistics Management", type: "core", trade: "LOGISTICS", rank: "Corporal", hours: 70, prerequisites: ["LOGISTICS_FOUND101"] },
  { courseCode: "LOGISTICS_STRAT301", name: "Strategic Logistics", type: "core", trade: "LOGISTICS", rank: "Sergeant", hours: 90, prerequisites: ["LOGISTICS_MANAGE201"] }
]);

// Insert specialty tracks
db.specialty_tracks.insertMany([
  // Fire Control (Commissioned)
  { name: "Advanced Fire Control Systems", code: "FIRE_CTRL_ADV", trade: "FIRE_CTRL", description: "Expert-level training in advanced fire control", color: "#ef4444", courses: ["FIRE_CTRL_ADV201", "FIRE_CTRL_ADV202", "FIRE_CTRL_ADV203"], minimumRank: "Captain" },
  { name: "Tactical Gunnery", code: "FIRE_CTRL_GUN", trade: "FIRE_CTRL", description: "Specialized training in gunnery techniques", color: "#10b981", courses: ["FIRE_CTRL_GUN201", "FIRE_CTRL_GUN202", "FIRE_CTRL_GUN203"], minimumRank: "Second Lieutenant" },

  // Fire Support (Commissioned)
  { name: "Target Acquisition", code: "FIRE_SUP_TACQ", trade: "FIRE_SUP", description: "Advanced methods for identifying and prioritizing targets", color: "#3b82f6", courses: ["FIRE_SUP_TACQ201", "FIRE_SUP_TACQ202", "FIRE_SUP_TACQ203"], minimumRank: "Second Lieutenant" },
  { name: "Combined Arms Integration", code: "FIRE_SUP_CA", trade: "FIRE_SUP", description: "Mastering fire support in combined arms operations", color: "#8b5cf6", courses: ["FIRE_SUP_CA201", "FIRE_SUP_CA202", "FIRE_SUP_CA203"], minimumRank: "Captain" },

  // Infantry (Non-Commissioned)
  { name: "Urban Warfare", code: "INFANTRY_UW", trade: "INFANTRY", description: "Specialized training in urban combat and maneuvering", color: "#f59e0b", courses: ["INFANTRY_UW201", "INFANTRY_UW202", "INFANTRY_UW203"], minimumRank: "Corporal" },
  { name: "Reconnaissance", code: "INFANTRY_REC", trade: "INFANTRY", description: "Techniques and strategies for effective reconnaissance missions", color: "#10b981", courses: ["INFANTRY_REC201", "INFANTRY_REC202", "INFANTRY_REC203"], minimumRank: "Corporal" },

  // Logistics (Non-Commissioned)
  { name: "Inventory Management", code: "LOGISTICS_INV", trade: "LOGISTICS", description: "Advanced methods for managing and optimizing inventory", color: "#3b82f6", courses: ["LOGISTICS_INV201", "LOGISTICS_INV202", "LOGISTICS_INV203"], minimumRank: "Corporal" },
  { name: "Procurement Strategies", code: "LOGISTICS_PROC", trade: "LOGISTICS", description: "Strategic procurement and supplier relationship management", color: "#8b5cf6", courses: ["LOGISTICS_PROC201", "LOGISTICS_PROC202", "LOGISTICS_PROC203"], minimumRank: "Sergeant" }
]);

// Insert course sessions
db.course_sessions.insertMany([
  // Fire Control Course Sessions
  {
    courseCode: "FIRE_CTRL_SAFE101",
    startDate: ISODate("2025-04-15"),
    endDate: ISODate("2025-05-15"),
    location: "Fort Cannon",
    school: "RCAS"
  },
  {
    courseCode: "FIRE_CTRL_THEORY201",
    startDate: ISODate("2025-06-01"),
    endDate: ISODate("2025-07-20"),
    location: "Fort Cannon",
    school: "RCAS"
  },
  {
    courseCode: "FIRE_CTRL_ADV301",
    startDate: ISODate("2025-08-05"),
    endDate: ISODate("2025-09-30"),
    location: "Fort Barrage",
    school: "RCAS"
  },
  // Fire Support Course Sessions
  {
    courseCode: "FIRE_SUP_SAFE101",
    startDate: ISODate("2025-04-20"),
    endDate: ISODate("2025-05-20"),
    location: "Fort Arrow",
    school: "RCASr"
  },
  {
    courseCode: "FIRE_SUP_OBS201",
    startDate: ISODate("2025-07-01"),
    endDate: ISODate("2025-08-20"),
    location: "Fort Arrow",
    school: "RCASr"
  },
  {
    courseCode: "FIRE_SUP_JOINT301",
    startDate: ISODate("2025-09-10"),
    endDate: ISODate("2025-11-05"),
    location: "Joint Forces Base",
    school: "RCAS"
  },
  // Infantry Course Sessions
  {
    courseCode: "INFANTRY_BASIC101",
    startDate: ISODate("2025-03-25"),
    endDate: ISODate("2025-04-25"),
    location: "Camp Alpha",
    school: "Infantry Training School"
  },
  {
    courseCode: "INFANTRY_TACTICS201",
    startDate: ISODate("2025-05-10"),
    endDate: ISODate("2025-06-30"),
    location: "Camp Bravo",
    school: "Infantry Tactics Center"
  },
  {
    courseCode: "INFANTRY_LEAD301",
    startDate: ISODate("2025-07-15"),
    endDate: ISODate("2025-09-15"),
    location: "Camp Charlie",
    school: "Infantry Leadership Academy"
  },
  // Logistics Course Sessions
  {
    courseCode: "LOGISTICS_FOUND101",
    startDate: ISODate("2025-04-05"),
    endDate: ISODate("2025-05-05"),
    location: "Supply Base Delta",
    school: "CFLTC"
  },
  {
    courseCode: "LOGISTICS_MANAGE201",
    startDate: ISODate("2025-06-15"),
    endDate: ISODate("2025-08-05"),
    location: "Supply Base Echo",
    school: "CFLTC"
  },
  {
    courseCode: "LOGISTICS_STRAT301",
    startDate: ISODate("2025-09-01"),
    endDate: ISODate("2025-10-31"),
    location: "Supply Base Foxtrot",
    school: "CFLTC"
  }
]);
