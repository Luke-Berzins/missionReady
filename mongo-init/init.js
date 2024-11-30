// Switch to the desired database
db = db.getSiblingDB('artillery_training');

// Drop existing collections to start fresh (optional)
db.trades.drop();
db.courses.drop();
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

// Insert courses (core and track courses)
db.courses.insertMany([
  // Core Courses for Fire Control
  { courseCode: "FIRE_CTRL_SAFE101", name: "Intro to Artillery Safety", type: "core", trade: "FIRE_CTRL", rank: "Officer Cadet", hours: 40, description: "Essential safety practices for artillery operations" },
  { courseCode: "FIRE_CTRL_THEORY201", name: "Ballistics Fundamentals", type: "core", trade: "FIRE_CTRL", rank: "Second Lieutenant", hours: 80, prerequisites: ["FIRE_CTRL_SAFE101"] },
  { courseCode: "FIRE_CTRL_ADV301", name: "Advanced Artillery Systems", type: "core", trade: "FIRE_CTRL", rank: "Captain", hours: 120, prerequisites: ["FIRE_CTRL_THEORY201"] },

  // Track Courses for Fire Control - Advanced Fire Control Systems
  { courseCode: "FIRE_CTRL_ADV201", name: "Advanced Fire Control Systems I", type: "FIRE_CTRL_ADV", trade: "FIRE_CTRL", rank: "Captain", hours: 100, description: "Expert-level training in advanced fire control", color: "#ef4444", prerequisites: ["FIRE_CTRL_ADV301"] },
  { courseCode: "FIRE_CTRL_ADV202", name: "Advanced Fire Control Systems II", type: "FIRE_CTRL_ADV", trade: "FIRE_CTRL", rank: "Major", hours: 110, prerequisites: ["FIRE_CTRL_ADV201"] },
  { courseCode: "FIRE_CTRL_ADV203", name: "Advanced Fire Control Systems III", type: "FIRE_CTRL_ADV", trade: "FIRE_CTRL", rank: "Major", hours: 120, prerequisites: ["FIRE_CTRL_ADV202"] },

  // Track Courses for Fire Control - Tactical Gunnery
  { courseCode: "FIRE_CTRL_GUN201", name: "Tactical Gunnery I", type: "FIRE_CTRL_GUN", trade: "FIRE_CTRL", rank: "Second Lieutenant", hours: 90, description: "Specialized training in gunnery techniques", color: "#10b981", prerequisites: ["FIRE_CTRL_THEORY201"] },
  { courseCode: "FIRE_CTRL_GUN202", name: "Tactical Gunnery II", type: "FIRE_CTRL_GUN", trade: "FIRE_CTRL", rank: "Captain", hours: 100, prerequisites: ["FIRE_CTRL_GUN201"] },
  { courseCode: "FIRE_CTRL_GUN203", name: "Tactical Gunnery III", type: "FIRE_CTRL_GUN", trade: "FIRE_CTRL", rank: "Major", hours: 110, prerequisites: ["FIRE_CTRL_GUN202"] },

  // Core Courses for Fire Support
  { courseCode: "FIRE_SUP_SAFE101", name: "Operational Doctrine & Targeting", type: "core", trade: "FIRE_SUP", rank: "Officer Cadet", hours: 40, description: "Fundamental fire support targeting and doctrine" },
  { courseCode: "FIRE_SUP_OBS201", name: "Forward Observer Techniques", type: "core", trade: "FIRE_SUP", rank: "Second Lieutenant", hours: 80, prerequisites: ["FIRE_SUP_SAFE101"] },
  { courseCode: "FIRE_SUP_JOINT301", name: "Joint Fire Planning", type: "core", trade: "FIRE_SUP", rank: "Captain", hours: 120, prerequisites: ["FIRE_SUP_OBS201"] },

  // Track Courses for Fire Support - Target Acquisition
  { courseCode: "FIRE_SUP_TACQ201", name: "Target Acquisition I", type: "FIRE_SUP_TACQ", trade: "FIRE_SUP", rank: "Second Lieutenant", hours: 90, description: "Advanced methods for identifying and prioritizing targets", color: "#3b82f6", prerequisites: ["FIRE_SUP_OBS201"] },
  { courseCode: "FIRE_SUP_TACQ202", name: "Target Acquisition II", type: "FIRE_SUP_TACQ", trade: "FIRE_SUP", rank: "Captain", hours: 100, prerequisites: ["FIRE_SUP_TACQ201"] },
  { courseCode: "FIRE_SUP_TACQ203", name: "Target Acquisition III", type: "FIRE_SUP_TACQ", trade: "FIRE_SUP", rank: "Major", hours: 110, prerequisites: ["FIRE_SUP_TACQ202"] },

  // Track Courses for Fire Support - Combined Arms Integration
  { courseCode: "FIRE_SUP_CA201", name: "Combined Arms Integration I", type: "FIRE_SUP_CA", trade: "FIRE_SUP", rank: "Captain", hours: 100, description: "Mastering fire support in combined arms operations", color: "#8b5cf6", prerequisites: ["FIRE_SUP_JOINT301"] },
  { courseCode: "FIRE_SUP_CA202", name: "Combined Arms Integration II", type: "FIRE_SUP_CA", trade: "FIRE_SUP", rank: "Major", hours: 110, prerequisites: ["FIRE_SUP_CA201"] },
  { courseCode: "FIRE_SUP_CA203", name: "Combined Arms Integration III", type: "FIRE_SUP_CA", trade: "FIRE_SUP", rank: "Major", hours: 120, prerequisites: ["FIRE_SUP_CA202"] },

  // Core Courses for Infantry
  { courseCode: "INFANTRY_BASIC101", name: "Basic Infantry Training", type: "core", trade: "INFANTRY", rank: "Private Recruit", hours: 60, description: "Fundamental skills and knowledge for infantry operations" },
  { courseCode: "INFANTRY_TACTICS201", name: "Infantry Tactics", type: "core", trade: "INFANTRY", rank: "Corporal", hours: 80, prerequisites: ["INFANTRY_BASIC101"] },
  { courseCode: "INFANTRY_LEAD301", name: "Leadership in Infantry", type: "core", trade: "INFANTRY", rank: "Sergeant", hours: 100, prerequisites: ["INFANTRY_TACTICS201"] },

  // Track Courses for Infantry - Urban Warfare
  { courseCode: "INFANTRY_UW201", name: "Urban Warfare I", type: "INFANTRY_UW", trade: "INFANTRY", rank: "Corporal", hours: 90, description: "Specialized training in urban combat and maneuvering", color: "#f59e0b", prerequisites: ["INFANTRY_TACTICS201"] },
  { courseCode: "INFANTRY_UW202", name: "Urban Warfare II", type: "INFANTRY_UW", trade: "INFANTRY", rank: "Sergeant", hours: 100, prerequisites: ["INFANTRY_UW201"] },
  { courseCode: "INFANTRY_UW203", name: "Urban Warfare III", type: "INFANTRY_UW", trade: "INFANTRY", rank: "Warrant Officer", hours: 110, prerequisites: ["INFANTRY_UW202"] },

  // Track Courses for Infantry - Reconnaissance
  { courseCode: "INFANTRY_REC201", name: "Reconnaissance I", type: "INFANTRY_REC", trade: "INFANTRY", rank: "Corporal", hours: 90, description: "Techniques and strategies for effective reconnaissance missions", color: "#10b981", prerequisites: ["INFANTRY_TACTICS201"] },
  { courseCode: "INFANTRY_REC202", name: "Reconnaissance II", type: "INFANTRY_REC", trade: "INFANTRY", rank: "Sergeant", hours: 100, prerequisites: ["INFANTRY_REC201"] },
  { courseCode: "INFANTRY_REC203", name: "Reconnaissance III", type: "INFANTRY_REC", trade: "INFANTRY", rank: "Warrant Officer", hours: 110, prerequisites: ["INFANTRY_REC202"] },

  // Core Courses for Logistics
  { courseCode: "LOGISTICS_FOUND101", name: "Foundations of Logistics", type: "core", trade: "LOGISTICS", rank: "Private Recruit", hours: 50, description: "Introduction to logistics principles and supply chain management" },
  { courseCode: "LOGISTICS_MANAGE201", name: "Logistics Management", type: "core", trade: "LOGISTICS", rank: "Corporal", hours: 70, prerequisites: ["LOGISTICS_FOUND101"] },
  { courseCode: "LOGISTICS_STRAT301", name: "Strategic Logistics", type: "core", trade: "LOGISTICS", rank: "Sergeant", hours: 90, prerequisites: ["LOGISTICS_MANAGE201"] },

  // Track Courses for Logistics - Inventory Management
  { courseCode: "LOGISTICS_INV201", name: "Inventory Management I", type: "LOGISTICS_INV", trade: "LOGISTICS", rank: "Corporal", hours: 80, description: "Advanced methods for managing and optimizing inventory", color: "#3b82f6", prerequisites: ["LOGISTICS_MANAGE201"] },
  { courseCode: "LOGISTICS_INV202", name: "Inventory Management II", type: "LOGISTICS_INV", trade: "LOGISTICS", rank: "Sergeant", hours: 90, prerequisites: ["LOGISTICS_INV201"] },
  { courseCode: "LOGISTICS_INV203", name: "Inventory Management III", type: "LOGISTICS_INV", trade: "LOGISTICS", rank: "Warrant Officer", hours: 100, prerequisites: ["LOGISTICS_INV202"] },

  // Track Courses for Logistics - Procurement Strategies
  { courseCode: "LOGISTICS_PROC201", name: "Procurement Strategies I", type: "LOGISTICS_PROC", trade: "LOGISTICS", rank: "Sergeant", hours: 90, description: "Strategic procurement and supplier relationship management", color: "#8b5cf6", prerequisites: ["LOGISTICS_STRAT301"] },
  { courseCode: "LOGISTICS_PROC202", name: "Procurement Strategies II", type: "LOGISTICS_PROC", trade: "LOGISTICS", rank: "Warrant Officer", hours: 100, prerequisites: ["LOGISTICS_PROC201"] },
  { courseCode: "LOGISTICS_PROC203", name: "Procurement Strategies III", type: "LOGISTICS_PROC", trade: "LOGISTICS", rank: "Master Warrant Officer", hours: 110, prerequisites: ["LOGISTICS_PROC202"] }
]);

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
  },
  
  {
    courseCode: "FIRE_CTRL_SAFE101",
    startDate: ISODate("2025-04-15"),
    endDate: ISODate("2025-05-15"),
    location: "Fort Cannon",
    school: "RCAS"
  },
  // ... (existing sessions)
  
  // Additional Fire Control Course Sessions
  {
    courseCode: "FIRE_CTRL_SAFE101",
    startDate: ISODate("2025-10-10"),
    endDate: ISODate("2025-11-10"),
    location: "Fort Shield",
    school: "RCAS"
  },
  {
    courseCode: "FIRE_CTRL_SAFE101",
    startDate: ISODate("2026-01-20"),
    endDate: ISODate("2026-02-20"),
    location: "Fort Cannon",
    school: "RCAS"
  },
  {
    courseCode: "FIRE_CTRL_THEORY201",
    startDate: ISODate("2025-12-05"),
    endDate: ISODate("2026-01-25"),
    location: "Fort Barrage",
    school: "RCAS"
  },
  {
    courseCode: "FIRE_CTRL_ADV301",
    startDate: ISODate("2026-03-15"),
    endDate: ISODate("2026-05-10"),
    location: "Fort Shield",
    school: "RCAS"
  },
  // Additional Fire Support Course Sessions
  {
    courseCode: "FIRE_SUP_SAFE101",
    startDate: ISODate("2025-11-20"),
    endDate: ISODate("2025-12-20"),
    location: "Fort Arrow",
    school: "RCASr"
  },
  {
    courseCode: "FIRE_SUP_OBS201",
    startDate: ISODate("2026-02-01"),
    endDate: ISODate("2026-03-20"),
    location: "Fort Arrow",
    school: "RCASr"
  },
  {
    courseCode: "FIRE_SUP_JOINT301",
    startDate: ISODate("2026-04-10"),
    endDate: ISODate("2026-06-05"),
    location: "Joint Forces Base",
    school: "RCAS"
  },
  // Additional Infantry Course Sessions
  {
    courseCode: "INFANTRY_BASIC101",
    startDate: ISODate("2025-09-25"),
    endDate: ISODate("2025-10-25"),
    location: "Camp Alpha",
    school: "Infantry Training School"
  },
  {
    courseCode: "INFANTRY_TACTICS201",
    startDate: ISODate("2025-11-10"),
    endDate: ISODate("2025-12-30"),
    location: "Camp Bravo",
    school: "Infantry Tactics Center"
  },
  {
    courseCode: "INFANTRY_LEAD301",
    startDate: ISODate("2026-01-15"),
    endDate: ISODate("2026-03-15"),
    location: "Camp Charlie",
    school: "Infantry Leadership Academy"
  },
  // Additional Logistics Course Sessions
  {
    courseCode: "LOGISTICS_FOUND101",
    startDate: ISODate("2025-10-05"),
    endDate: ISODate("2025-11-05"),
    location: "Supply Base Delta",
    school: "CFLTC"
  },
  {
    courseCode: "LOGISTICS_MANAGE201",
    startDate: ISODate("2025-12-15"),
    endDate: ISODate("2026-02-05"),
    location: "Supply Base Echo",
    school: "CFLTC"
  },
  {
    courseCode: "LOGISTICS_STRAT301",
    startDate: ISODate("2026-03-01"),
    endDate: ISODate("2026-04-30"),
    location: "Supply Base Foxtrot",
    school: "CFLTC"
  },
  // Additional Sessions for Other Courses
  {
    courseCode: "MEDIC_BASIC101",
    startDate: ISODate("2025-08-01"),
    endDate: ISODate("2025-09-15"),
    location: "Medical Camp Alpha",
    school: "Medical Training Center"
  },
  {
    courseCode: "MEDIC_ADV201",
    startDate: ISODate("2025-11-01"),
    endDate: ISODate("2025-12-15"),
    location: "Medical Camp Beta",
    school: "Medical Training Center"
  },
  {
    courseCode: "ENG_BASIC101",
    startDate: ISODate("2025-07-05"),
    endDate: ISODate("2025-08-20"),
    location: "Engineer Base Gamma",
    school: "Engineering Corps School"
  },
  {
    courseCode: "ENG_ADV201",
    startDate: ISODate("2025-10-10"),
    endDate: ISODate("2025-11-25"),
    location: "Engineer Base Delta",
    school: "Engineering Corps School"
  },
  {
    courseCode: "COMMS_BASIC101",
    startDate: ISODate("2025-09-01"),
    endDate: ISODate("2025-10-10"),
    location: "Communication Hub Epsilon",
    school: "Signal Training School"
  },
  {
    courseCode: "COMMS_ADV201",
    startDate: ISODate("2025-12-01"),
    endDate: ISODate("2026-01-10"),
    location: "Communication Hub Zeta",
    school: "Signal Training School"
  }
]);