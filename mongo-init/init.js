// Switch to the desired database
db = db.getSiblingDB('artillery_training');

// Drop existing collections to start fresh
db.trades.drop();
db.courses.drop();
db.ranks.drop();
db.course_sessions.drop();
db.specialty_tracks.drop();

// Insert ranks (keeping the same rank structure)
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

// Insert updated trades
db.trades.insertMany([
  { 
    code: "INFTR", 
    mosId: "00010",
    name: "Infanteer", 
    title: "Infantry",
    description: "Frontline combat and tactical operations", 
    commissioned: false 
  },
  { 
    code: "CBT_ENGR", 
    mosId: "00339",
    name: "Combat Engineer", 
    title: "Combat Engineer",
    description: "Military engineering and construction operations", 
    commissioned: false 
  },
  { 
    code: "ARTY_O", 
    mosId: "00179",
    name: "Artillery Officer", 
    title: "Artillery Officer",
    description: "Artillery operations and fire support coordination", 
    commissioned: true 
  },
  { 
    code: "MSE_OP", 
    mosId: "00171",
    name: "Mobile Support Equipment Operator", 
    title: "Mobile Support Equipment Operator",
    description: "Vehicle and equipment operation and maintenance", 
    commissioned: false 
  }
]);

// Insert updated courses with specialty track associations
db.courses.insertMany([
  // Infantry Courses
  // Core Courses
  { courseCode: "INFTR_BASIC101", name: "Basic Infantry Training", type: "core", trade: "INFTR", rank: "Private Recruit", hours: 60, description: "Fundamental infantry skills and tactics" },
  
  // Urban Operations Track
  { courseCode: "INFTR_URBAN201", name: "Urban Operations I", type: "INFTR_URBAN", trade: "INFTR", rank: "Corporal", hours: 90, description: "Basic urban warfare tactics", prerequisites: ["INFTR_BASIC101"] },
  { courseCode: "INFTR_URBAN202", name: "Urban Operations II", type: "INFTR_URBAN", trade: "INFTR", rank: "Sergeant", hours: 100, prerequisites: ["INFTR_URBAN201"] },
  { courseCode: "INFTR_URBAN203", name: "Urban Operations III", type: "INFTR_URBAN", trade: "INFTR", rank: "Warrant Officer", hours: 110, prerequisites: ["INFTR_URBAN202"] },
  
  // Reconnaissance Track
  { courseCode: "INFTR_RECON201", name: "Reconnaissance I", type: "INFTR_RECON", trade: "INFTR", rank: "Corporal", hours: 90, description: "Basic reconnaissance operations", prerequisites: ["INFTR_BASIC101"] },
  { courseCode: "INFTR_RECON202", name: "Reconnaissance II", type: "INFTR_RECON", trade: "INFTR", rank: "Sergeant", hours: 100, prerequisites: ["INFTR_RECON201"] },
  { courseCode: "INFTR_RECON203", name: "Reconnaissance III", type: "INFTR_RECON", trade: "INFTR", rank: "Warrant Officer", hours: 110, prerequisites: ["INFTR_RECON202"] },
  { courseCode: "INFTR_ADV201", name: "Advanced Infantry Operations", type: "core", trade: "INFTR", rank: "Corporal", hours: 80, prerequisites: ["INFTR_BASIC101"] },
  { courseCode: "INFTR_LEAD301", name: "Infantry Leadership", type: "core", trade: "INFTR", rank: "Sergeant", hours: 100, prerequisites: ["INFTR_ADV201"] },

  // Combat Engineer Courses
  // Core Courses
  
    {
      courseCode: "PRes_BMQ_LAND",
      name: "PRes Basic Military Qualification",
      type: "core",
      trade: "CBT_ENGR",
      rank: "Private Recruit",
      prerequisite: "BMQ",
      hours: 12 * 8, // Converting days to hours (assuming 8-hour days)
      description: "Basic Military Qualification for Primary Reserve"
    },
    {
      courseCode: "DP1_CBT_ENGR_SECT_MOD1",
      name: "PRes DP1 Combat Engineer Section Member Mod 1",
      type: "core",
      trade: "CBT_ENGR",
      rank: "Private",
      prerequisite: "PRes_BMQ_LAND",
      hours: 9 * 8,
      description: "Combat Engineer Section Member Module 1 training"
    },
    {
      courseCode: "DP1_CBT_ENGR_SECT_MOD2",
      name: "PRes DP1 Combat Engineer Section Member Mod 2",
      type: "core",
      trade: "CBT_ENGR",
      rank: "Private",
      prerequisite: "DP1_CBT_ENGR_SECT_MOD1",
      hours: 17 * 8,
      description: "Combat Engineer Section Member Module 2 training"
    },
    {
      courseCode: "DP1_CBT_ENGR_SECT_MOD3",
      name: "PRes DP1 Combat Engineer Section Member Mod 3",
      type: "core",
      trade: "CBT_ENGR",
      rank: "Private",
      prerequisite: "DP1_CBT_ENGR_SECT_MOD2",
      hours: 11 * 8,
      description: "Combat Engineer Section Member Module 3 training"
    },
    {
      courseCode: "DP1_CBT_ENGR_SECT_MOD4",
      name: "PRes DP1 Combat Engineer Section Member Mod 4",
      type: "core",
      trade: "CBT_ENGR",
      rank: "Private",
      prerequisite: "DP1_CBT_ENGR_SECT_MOD3",
      hours: 8 * 8,
      description: "Combat Engineer Section Member Module 4 training"
    },
    {
      courseCode: "DP1_CBT_ENGR_SECT_MOD5",
      name: "PRes DP1 Combat Engineer Section Member Mod 5",
      type: "core",
      trade: "CBT_ENGR",
      rank: "Private",
      prerequisite: "DP1_CBT_ENGR_SECT_MOD4",
      hours: 9 * 8,
      description: "Combat Engineer Section Member Module 5 training"
    },
    {
      courseCode: "DP2_CBT_ENGR_SECT_2IC_MOD1",
      name: "PRes DP2 Combat Engineer Section 2IC Mod1",
      type: "core",
      trade: "CBT_ENGR",
      rank: "Private",
      prerequisite: "DP1_CBT_ENGR_SECT_MOD5",
      hours: 7 * 8,
      description: "Combat Engineer Section Second-in-Command Module 1 (Distance Learning)"
    },
    {
      courseCode: "DP2_CBT_ENGR_SECT_2IC_MOD2",
      name: "PRes DP2 Combat Engineer Section 2IC Mod2",
      type: "core",
      trade: "CBT_ENGR",
      rank: "Private",
      prerequisite: "DP2_CBT_ENGR_SECT_2IC_MOD1",
      hours: 22 * 8,
      description: "Combat Engineer Section Second-in-Command Module 2"
    },
    {
      courseCode: "DP2_PLQ_MOD1",
      name: "DP2 Primary Leadership Qualification Mod 1",
      type: "core",
      trade: "CBT_ENGR",
      rank: "Corporal",
      prerequisite: "DP2_CBT_ENGR_SECT_2IC_MOD2",
      hours: 9 * 8,
      description: "Primary Leadership Qualification Module 1 (Distance Learning)"
    },
    {
      courseCode: "DP2_PLQ_MOD2",
      name: "DP2 Primary Leadership Qualification Mod 2",
      type: "core",
      trade: "CBT_ENGR",
      rank: "Corporal",
      prerequisite: "DP2_PLQ_MOD1",
      hours: 11 * 8,
      description: "Primary Leadership Qualification Module 2"
    },
    {
      courseCode: "DP2_PLQ_MOD3",
      name: "DP2 Primary Leadership Qualification Mod 3",
      type: "core",
      trade: "CBT_ENGR",
      rank: "Corporal",
      prerequisite: "DP2_PLQ_MOD2",
      hours: 17 * 8,
      description: "Primary Leadership Qualification Module 3"
    },
    {
      courseCode: "CBT_ENGR_RQ_MCPL",
      name: "Combat Engineer Rank Qualification MCpl",
      type: "core",
      trade: "CBT_ENGR",
      rank: "Corporal",
      prerequisite: "DP2_PLQ_MOD3",
      hours: 12 * 8,
      description: "Master Corporal Rank Qualification for Combat Engineers"
    },
    {
      courseCode: "DP3A_CBT_ENGR_SECT_COMD_MOD1",
      name: "PRes DP3A Combat Engineer Section Commander Mod 1",
      type: "core",
      trade: "CBT_ENGR",
      rank: "Master Corporal",
      prerequisite: "CBT_ENGR_RQ_MCPL",
      hours: 4 * 8,
      description: "Combat Engineer Section Commander Module 1 (Distance Learning)"
    },
    {
      courseCode: "DP3A_CBT_ENGR_SECT_COMD_MOD2",
      name: "PRes DP3A Combat Engineer Section Commander Mod 2",
      type: "core",
      trade: "CBT_ENGR",
      rank: "Master Corporal",
      prerequisite: "DP3A_CBT_ENGR_SECT_COMD_MOD1",
      hours: 40 * 8,
      description: "Combat Engineer Section Commander Module 2"
    },
    {
      courseCode: "DP3B_CBT_ENGR_WO_MOD1",
      name: "PRes DP3A Combat Engineer Troop Warrant Officer Mod 1",
      type: "core",
      trade: "CBT_ENGR",
      rank: "Sergeant",
      prerequisite: "DP3A_CBT_ENGR_SECT_COMD_MOD2",
      hours: 16 * 8,
      description: "Combat Engineer Troop Warrant Officer Module 1 (Distance Learning)"
    },
    {
      courseCode: "DP3B_CBT_ENGR_WO_MOD2",
      name: "PRes DP3A Combat Engineer Troop Warrant Officer Mod 2",
      type: "core",
      trade: "CBT_ENGR",
      rank: "Sergeant",
      prerequisite: "DP3B_CBT_ENGR_WO_MOD1",
      hours: 19 * 8,
      description: "Combat Engineer Troop Warrant Officer Module 2"
    },
    {
      courseCode: "ILP_MOD1",
      name: "Intermediate Leadership Programme Mod1",
      type: "core",
      trade: "CBT_ENGR",
      rank: "Sergeant",
      prerequisite: "DP3B_CBT_ENGR_WO_MOD2",
      hours: 10 * 8,
      description: "Intermediate Leadership Programme Module 1 (Distance Learning)"
    },
    {
      courseCode: "ILP_MOD2",
      name: "Intermediate Leadership Programme Mod2",
      type: "core",
      trade: "CBT_ENGR",
      rank: "Sergeant",
      prerequisite: "ILP_MOD1",
      hours: 14 * 8,
      description: "Intermediate Leadership Programme Module 2"
    },
  
  // EOD Track
  { courseCode: "CBT_ENGR_EOD201", name: "EOD Operations I", type: "CBT_ENGR_EOD", trade: "CBT_ENGR", rank: "Corporal", hours: 90, description: "Basic EOD procedures", prerequisites: ["CBT_ENGR_BASIC101"] },
  { courseCode: "CBT_ENGR_EOD202", name: "EOD Operations II", type: "CBT_ENGR_EOD", trade: "CBT_ENGR", rank: "Sergeant", hours: 100, prerequisites: ["CBT_ENGR_EOD201"] },
  { courseCode: "CBT_ENGR_EOD203", name: "EOD Operations III", type: "CBT_ENGR_EOD", trade: "CBT_ENGR", rank: "Warrant Officer", hours: 110, prerequisites: ["CBT_ENGR_EOD202"] },
  
  // Bridge Construction Track
  { courseCode: "CBT_ENGR_BRIDGE201", name: "Bridge Construction I", type: "CBT_ENGR_BRIDGE", trade: "CBT_ENGR", rank: "Corporal", hours: 90, description: "Basic bridge construction", prerequisites: ["CBT_ENGR_BASIC101"] },
  { courseCode: "CBT_ENGR_BRIDGE202", name: "Bridge Construction II", type: "CBT_ENGR_BRIDGE", trade: "CBT_ENGR", rank: "Sergeant", hours: 100, prerequisites: ["CBT_ENGR_BRIDGE201"] },
  { courseCode: "CBT_ENGR_BRIDGE203", name: "Bridge Construction III", type: "CBT_ENGR_BRIDGE", trade: "CBT_ENGR", rank: "Warrant Officer", hours: 110, prerequisites: ["CBT_ENGR_BRIDGE202"] },
  { courseCode: "CBT_ENGR_CONST201", name: "Military Construction", type: "CBT_ENGR_BRIDGE", trade: "CBT_ENGR", rank: "Corporal", hours: 90, prerequisites: ["CBT_ENGR_BASIC101"] },
  { courseCode: "CBT_ENGR_DEMO301", name: "Advanced Demolitions", type: "CBT_ENGR_BRIDGE", trade: "CBT_ENGR", rank: "Sergeant", hours: 110, prerequisites: ["CBT_ENGR_CONST201"] },

  // Artillery Officer Courses
  // Core Courses
  { courseCode: "ARTY_O_BASIC101", name: "Artillery Officer Basic Course", type: "core", trade: "ARTY_O", rank: "Officer Cadet", hours: 80, description: "Basic artillery officer training" },
  
  { courseCode: "ARTY_O_FIRE201", name: "Fire Support Coordination", type: "core", trade: "ARTY_O", rank: "Second Lieutenant", hours: 100, prerequisites: ["ARTY_O_BASIC101"] },
  { courseCode: "ARTY_O_ADV301", name: "Advanced Artillery Operations", type: "core", trade: "ARTY_O", rank: "Captain", hours: 120, prerequisites: ["ARTY_O_FIRE201"] },

  // MSE Operator Courses
  { courseCode: "MSE_OP_BASIC101", name: "Basic Vehicle Operations", type: "core", trade: "MSE_OP", rank: "Private Recruit", hours: 50, description: "Basic vehicle operation and maintenance" },
  { courseCode: "MSE_OP_MAINT201", name: "Advanced Maintenance", type: "core", trade: "MSE_OP", rank: "Corporal", hours: 70, prerequisites: ["MSE_OP_BASIC101"] },
  { courseCode: "MSE_OP_SPEC301", name: "Specialized Equipment Operations", type: "core", trade: "MSE_OP", rank: "Sergeant", hours: 90, prerequisites: ["MSE_OP_MAINT201"] }
]);

// Insert specialty tracks
db.specialty_tracks.insertMany([
  // Infantry Specialty Tracks
  { 
    name: "Urban Operations", 
    code: "INFTR_URBAN", 
    trade: "INFTR", 
    description: "Specialized training in urban warfare", 
    color: "#ef4444", 
    minimumRank: "Corporal" 
  },
  { 
    name: "Reconnaissance", 
    code: "INFTR_RECON", 
    trade: "INFTR", 
    description: "Advanced reconnaissance and surveillance", 
    color: "#10b981", 
    minimumRank: "Corporal" 
  },

  // Combat Engineer Specialty Tracks
  { 
    name: "Explosive Ordnance Disposal", 
    code: "CBT_ENGR_EOD", 
    trade: "CBT_ENGR", 
    description: "Specialized EOD operations", 
    color: "#3b82f6", 
    minimumRank: "Corporal" 
  },
  { 
    name: "Bridge Construction", 
    code: "CBT_ENGR_BRIDGE", 
    trade: "CBT_ENGR", 
    description: "Advanced bridge building operations", 
    color: "#8b5cf6", 
    minimumRank: "Corporal" 
  },

  // Artillery Officer Specialty Tracks
  { 
    name: "Joint Fires", 
    code: "ARTY_O_JOINT", 
    trade: "ARTY_O", 
    description: "Joint fires coordination and planning", 
    color: "#f59e0b", 
    minimumRank: "Captain" 
  },
  { 
    name: "Target Acquisition", 
    code: "ARTY_O_TACQ", 
    trade: "ARTY_O", 
    description: "Advanced target acquisition systems", 
    color: "#10b981", 
    minimumRank: "Second Lieutenant" 
  },

  // MSE Operator Specialty Tracks
  { 
    name: "Heavy Equipment", 
    code: "MSE_OP_HEAVY", 
    trade: "MSE_OP", 
    description: "Heavy equipment operation", 
    color: "#3b82f6", 
    minimumRank: "Corporal" 
  },
  { 
    name: "Recovery Operations", 
    code: "MSE_OP_RECOVERY", 
    trade: "MSE_OP", 
    description: "Vehicle recovery and maintenance", 
    color: "#8b5cf6", 
    minimumRank: "Corporal" 
  }
]);

// Insert course sessions (updated locations and dates)
db.course_sessions.insertMany([
  // Infantry Course Sessions
  {
    courseCode: "INFTR_BASIC101",
    startDate: ISODate("2025-04-15"),
    endDate: ISODate("2025-05-15"),
    location: "Infantry Training Center",
    school: "Combat Arms School"
  },
  {
    courseCode: "INFTR_ADV201",
    startDate: ISODate("2025-06-01"),
    endDate: ISODate("2025-07-20"),
    location: "Infantry Training Center",
    school: "Combat Arms School"
  },

  // Combat Engineer Course Sessions
  {
    courseCode: "CBT_ENGR_BASIC101",
    startDate: ISODate("2025-04-20"),
    endDate: ISODate("2025-05-20"),
    location: "Engineer Training School",
    school: "Canadian Military Engineers School"
  },
  {
    courseCode: "CBT_ENGR_CONST201",
    startDate: ISODate("2025-07-01"),
    endDate: ISODate("2025-08-20"),
    location: "Engineer Training School",
    school: "Canadian Military Engineers School"
  },

  // Artillery Officer Course Sessions
  {
    courseCode: "ARTY_O_BASIC101",
    startDate: ISODate("2025-05-10"),
    endDate: ISODate("2025-06-10"),
    location: "Artillery School",
    school: "Royal Regiment of Canadian Artillery School"
  },
  {
    courseCode: "ARTY_O_FIRE201",
    startDate: ISODate("2025-08-01"),
    endDate: ISODate("2025-09-20"),
    location: "Artillery School",
    school: "Royal Regiment of Canadian Artillery School"
  },

  // MSE Operator Course Sessions
  {
    courseCode: "MSE_OP_BASIC101",
    startDate: ISODate("2025-04-05"),
    endDate: ISODate("2025-05-05"),
    location: "Transport Training Center",
    school: "Canadian Forces Logistics Training Centre"
  },
  {
    courseCode: "MSE_OP_MAINT201",
    startDate: ISODate("2025-06-15"),
    endDate: ISODate("2025-08-05"),
    location: "Transport Training Center",
    school: "Canadian Forces Logistics Training Centre"
  }
]);