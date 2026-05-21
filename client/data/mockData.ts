export interface Athlete {
  id: string;
  name: string;
  dateOfBirth: string;
  photo: string;
  chronologicalAge: number;
  biologicalAge: number;
  phvStatus: "Pre-PHV" | "In-PHV" | "Post-PHV";
  height: number;
  weight: number;
  wingspan: number;
  sittingHeight: number;
}

export interface Group {
  id: string;
  name: string;
  athleteIds: string[];
  createdAt: string;
}

export interface TestResult {
  athleteId: string;
  testType: string;
  testName: string;
  value: number | string;
  unit: string;
  date: string;
}

export interface TestSession {
  id: string;
  groupId: string;
  date: string;
  results: TestResult[];
}

// 10 Athletes with realistic variation
export const mockAthletes: Athlete[] = [
  {
    id: "a1",
    name: "Ahmed Al-Mazrouei",
    dateOfBirth: "2011-03-15",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed",
    chronologicalAge: 13.2,
    biologicalAge: 13.8,
    phvStatus: "In-PHV",
    height: 165,
    weight: 56,
    wingspan: 168,
    sittingHeight: 85,
  },
  {
    id: "a2",
    name: "Fatima Al-Noor",
    dateOfBirth: "2010-07-22",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fatima",
    chronologicalAge: 13.8,
    biologicalAge: 14.3,
    phvStatus: "In-PHV",
    height: 169,
    weight: 58,
    wingspan: 171,
    sittingHeight: 87,
  },
  {
    id: "a3",
    name: "Mohammed Hassan",
    dateOfBirth: "2012-01-10",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mohammed",
    chronologicalAge: 12.4,
    biologicalAge: 12.1,
    phvStatus: "Pre-PHV",
    height: 152,
    weight: 45,
    wingspan: 154,
    sittingHeight: 79,
  },
  {
    id: "a4",
    name: "Zahra Mahmoud",
    dateOfBirth: "2009-11-05",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Zahra",
    chronologicalAge: 14.5,
    biologicalAge: 15.2,
    phvStatus: "Post-PHV",
    height: 172,
    weight: 62,
    wingspan: 175,
    sittingHeight: 89,
  },
  {
    id: "a5",
    name: "Omar Rashid",
    dateOfBirth: "2010-05-18",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Omar",
    chronologicalAge: 13.9,
    biologicalAge: 14.5,
    phvStatus: "In-PHV",
    height: 168,
    weight: 59,
    wingspan: 170,
    sittingHeight: 86,
  },
  {
    id: "a6",
    name: "Leila Saeed",
    dateOfBirth: "2012-08-30",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Leila",
    chronologicalAge: 11.8,
    biologicalAge: 11.5,
    phvStatus: "Pre-PHV",
    height: 148,
    weight: 42,
    wingspan: 150,
    sittingHeight: 77,
  },
  {
    id: "a7",
    name: "Karim Saif",
    dateOfBirth: "2010-02-28",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Karim",
    chronologicalAge: 14.2,
    biologicalAge: 13.9,
    phvStatus: "In-PHV",
    height: 170,
    weight: 61,
    wingspan: 173,
    sittingHeight: 88,
  },
  {
    id: "a8",
    name: "Noor Faisal",
    dateOfBirth: "2009-09-12",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Noor",
    chronologicalAge: 14.7,
    biologicalAge: 15.1,
    phvStatus: "Post-PHV",
    height: 173,
    weight: 64,
    wingspan: 176,
    sittingHeight: 90,
  },
  {
    id: "a9",
    name: "Dina Khalil",
    dateOfBirth: "2011-06-07",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dina",
    chronologicalAge: 12.9,
    biologicalAge: 13.4,
    phvStatus: "In-PHV",
    height: 160,
    weight: 52,
    wingspan: 162,
    sittingHeight: 83,
  },
  {
    id: "a10",
    name: "Hassan Ahmed",
    dateOfBirth: "2011-10-20",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Hassan",
    chronologicalAge: 12.5,
    biologicalAge: 12.8,
    phvStatus: "Pre-PHV",
    height: 155,
    weight: 48,
    wingspan: 157,
    sittingHeight: 80,
  },
];

// Mock Groups
export const mockGroups: Group[] = [
  {
    id: "g1",
    name: "U14s Zayed",
    athleteIds: ["a1", "a2", "a4", "a5", "a7", "a8", "a9", "a10"],
    createdAt: "2024-01-15",
  },
  {
    id: "g2",
    name: "U12s Academy",
    athleteIds: ["a3", "a6", "a1", "a2", "a5"],
    createdAt: "2024-02-01",
  },
];

// Test Types categorized
export const testCategories = {
  Speed: [
    { name: "10m Sprint", unit: "s" },
    { name: "30m Sprint", unit: "s" },
  ],
  Agility: [
    { name: "5-10-5", unit: "s" },
    { name: "T-Test", unit: "s" },
  ],
  Power: [
    { name: "Vertical Jump", unit: "cm" },
    { name: "Broad Jump", unit: "cm" },
  ],
  Endurance: [
    { name: "Yo-Yo Test", unit: "level" },
    { name: "Beep Test", unit: "level" },
  ],
  Strength: [
    { name: "Grip Left", unit: "kg" },
    { name: "Grip Right", unit: "kg" },
    { name: "Push-Ups", unit: "reps" },
  ],
  Anthropometrics: [
    { name: "Height", unit: "cm" },
    { name: "Weight", unit: "kg" },
    { name: "Wingspan", unit: "cm" },
    { name: "Sitting Height", unit: "cm" },
  ],
};

// Mock Test Sessions for U14s Zayed (3 months apart)
export const mockTestSessions: TestSession[] = [
  {
    id: "ts1",
    groupId: "g1",
    date: "2024-01-20",
    results: [
      // Session 1 - January
      { athleteId: "a1", testType: "Speed", testName: "10m Sprint", value: 1.72, unit: "s", date: "2024-01-20" },
      { athleteId: "a1", testType: "Speed", testName: "30m Sprint", value: 4.15, unit: "s", date: "2024-01-20" },
      { athleteId: "a1", testType: "Power", testName: "Vertical Jump", value: 42, unit: "cm", date: "2024-01-20" },
      { athleteId: "a1", testType: "Strength", testName: "Grip Right", value: 28, unit: "kg", date: "2024-01-20" },
      
      { athleteId: "a2", testType: "Speed", testName: "10m Sprint", value: 1.68, unit: "s", date: "2024-01-20" },
      { athleteId: "a2", testType: "Speed", testName: "30m Sprint", value: 4.08, unit: "s", date: "2024-01-20" },
      { athleteId: "a2", testType: "Power", testName: "Vertical Jump", value: 45, unit: "cm", date: "2024-01-20" },
      { athleteId: "a2", testType: "Strength", testName: "Grip Right", value: 26, unit: "kg", date: "2024-01-20" },

      { athleteId: "a4", testType: "Speed", testName: "10m Sprint", value: 1.62, unit: "s", date: "2024-01-20" },
      { athleteId: "a4", testType: "Speed", testName: "30m Sprint", value: 3.95, unit: "s", date: "2024-01-20" },
      { athleteId: "a4", testType: "Power", testName: "Vertical Jump", value: 48, unit: "cm", date: "2024-01-20" },
      { athleteId: "a4", testType: "Strength", testName: "Grip Right", value: 32, unit: "kg", date: "2024-01-20" },

      { athleteId: "a5", testType: "Speed", testName: "10m Sprint", value: 1.70, unit: "s", date: "2024-01-20" },
      { athleteId: "a5", testType: "Speed", testName: "30m Sprint", value: 4.12, unit: "s", date: "2024-01-20" },
      { athleteId: "a5", testType: "Power", testName: "Vertical Jump", value: 43, unit: "cm", date: "2024-01-20" },
      { athleteId: "a5", testType: "Strength", testName: "Grip Right", value: 29, unit: "kg", date: "2024-01-20" },
    ],
  },
  {
    id: "ts2",
    groupId: "g1",
    date: "2024-04-20",
    results: [
      // Session 2 - April (3 months later)
      { athleteId: "a1", testType: "Speed", testName: "10m Sprint", value: 1.68, unit: "s", date: "2024-04-20" },
      { athleteId: "a1", testType: "Speed", testName: "30m Sprint", value: 4.05, unit: "s", date: "2024-04-20" },
      { athleteId: "a1", testType: "Power", testName: "Vertical Jump", value: 45, unit: "cm", date: "2024-04-20" },
      { athleteId: "a1", testType: "Strength", testName: "Grip Right", value: 30, unit: "kg", date: "2024-04-20" },

      { athleteId: "a2", testType: "Speed", testName: "10m Sprint", value: 1.65, unit: "s", date: "2024-04-20" },
      { athleteId: "a2", testType: "Speed", testName: "30m Sprint", value: 4.02, unit: "s", date: "2024-04-20" },
      { athleteId: "a2", testType: "Power", testName: "Vertical Jump", value: 48, unit: "cm", date: "2024-04-20" },
      { athleteId: "a2", testType: "Strength", testName: "Grip Right", value: 28, unit: "kg", date: "2024-04-20" },

      { athleteId: "a4", testType: "Speed", testName: "10m Sprint", value: 1.60, unit: "s", date: "2024-04-20" },
      { athleteId: "a4", testType: "Speed", testName: "30m Sprint", value: 3.90, unit: "s", date: "2024-04-20" },
      { athleteId: "a4", testType: "Power", testName: "Vertical Jump", value: 51, unit: "cm", date: "2024-04-20" },
      { athleteId: "a4", testType: "Strength", testName: "Grip Right", value: 34, unit: "kg", date: "2024-04-20" },

      { athleteId: "a5", testType: "Speed", testName: "10m Sprint", value: 1.66, unit: "s", date: "2024-04-20" },
      { athleteId: "a5", testType: "Speed", testName: "30m Sprint", value: 4.08, unit: "s", date: "2024-04-20" },
      { athleteId: "a5", testType: "Power", testName: "Vertical Jump", value: 46, unit: "cm", date: "2024-04-20" },
      { athleteId: "a5", testType: "Strength", testName: "Grip Right", value: 31, unit: "kg", date: "2024-04-20" },
    ],
  },
  {
    id: "ts3",
    groupId: "g1",
    date: "2024-07-20",
    results: [
      // Session 3 - July (3 months later)
      { athleteId: "a1", testType: "Speed", testName: "10m Sprint", value: 1.65, unit: "s", date: "2024-07-20" },
      { athleteId: "a1", testType: "Speed", testName: "30m Sprint", value: 3.98, unit: "s", date: "2024-07-20" },
      { athleteId: "a1", testType: "Power", testName: "Vertical Jump", value: 47, unit: "cm", date: "2024-07-20" },
      { athleteId: "a1", testType: "Strength", testName: "Grip Right", value: 31, unit: "kg", date: "2024-07-20" },

      { athleteId: "a2", testType: "Speed", testName: "10m Sprint", value: 1.62, unit: "s", date: "2024-07-20" },
      { athleteId: "a2", testType: "Speed", testName: "30m Sprint", value: 3.98, unit: "s", date: "2024-07-20" },
      { athleteId: "a2", testType: "Power", testName: "Vertical Jump", value: 50, unit: "cm", date: "2024-07-20" },
      { athleteId: "a2", testType: "Strength", testName: "Grip Right", value: 29, unit: "kg", date: "2024-07-20" },

      { athleteId: "a4", testType: "Speed", testName: "10m Sprint", value: 1.58, unit: "s", date: "2024-07-20" },
      { athleteId: "a4", testType: "Speed", testName: "30m Sprint", value: 3.85, unit: "s", date: "2024-07-20" },
      { athleteId: "a4", testType: "Power", testName: "Vertical Jump", value: 52, unit: "cm", date: "2024-07-20" },
      { athleteId: "a4", testType: "Strength", testName: "Grip Right", value: 35, unit: "kg", date: "2024-07-20" },

      { athleteId: "a5", testType: "Speed", testName: "10m Sprint", value: 1.63, unit: "s", date: "2024-07-20" },
      { athleteId: "a5", testType: "Speed", testName: "30m Sprint", value: 4.02, unit: "s", date: "2024-07-20" },
      { athleteId: "a5", testType: "Power", testName: "Vertical Jump", value: 48, unit: "cm", date: "2024-07-20" },
      { athleteId: "a5", testType: "Strength", testName: "Grip Right", value: 32, unit: "kg", date: "2024-07-20" },
    ],
  },
];
