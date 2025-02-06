export type UserProfile = {
  email: string;
  firstName: string;
  lastName: string;
  assignedPrograms: AssignedProgram[];
  yearJoined?: number;
  age?: number;
  gender?: string;
  phoneNumber?: string;
  role: Role;
  assignedUsers?: UserProfile[];
  veteransUnderPointOfContact?: Veteran[];
  assignedVeterans?: Veteran[];
};

export type Veteran = {
  firstName: string;
  lastName: string;
  email: string;
  assignedPrograms: AssignedProgram;
};

export enum AssignedProgram {
  BATTLE_BUDDIES = "battle buddies",
  ADVOCACY = "advocacy",
  OPERATION_WELLNESS = "operation wellness",
}

export enum Role {
  VETERAN = "veteran",
  VOLUNTEER = "volunteer",
  ADMIN = "admin",
  STAFF = "staff",
}

function getUser1(roll: Role): UserProfile {
  return {
    email: "lcfriedman@ucsd.edu",
    firstName: "Leo",
    lastName: "Friedman",
    assignedPrograms: [AssignedProgram.BATTLE_BUDDIES, AssignedProgram.ADVOCACY],
    yearJoined: 2012,
    age: 22,
    gender: "Male",
    phoneNumber: "(012) 345-6789",
    role: roll,
    assignedUsers: exampleUsers,
  };
}

function getUser2(roll: Role): UserProfile {
  return {
    email: "lcfriedman@ucsd.edu",
    firstName: "Leo",
    lastName: "Friedman",
    assignedPrograms: [
      AssignedProgram.BATTLE_BUDDIES,
      AssignedProgram.ADVOCACY,
      AssignedProgram.OPERATION_WELLNESS,
    ],
    yearJoined: 2012,
    age: 22,
    gender: "Male",
    phoneNumber: "(012) 345-6789",
    role: roll,
    assignedUsers: exampleUsers,
  };
}

const exampleUsers = [
  {
    firstName: "Johnny",
    lastName: "Appleseed",
    email: "johnny@appleseed.com",
    role: Role.VETERAN,
    assignedPrograms: [AssignedProgram.ADVOCACY],
  },
  {
    firstName: "Johnny",
    lastName: "Appleseed",
    email: "johnny@appleseed.com",
    role: Role.VETERAN,

    assignedPrograms: [AssignedProgram.ADVOCACY],
  },
  {
    firstName: "Johnny",
    lastName: "Appleseed",
    email: "johnny@appleseed.com",
    role: Role.VETERAN,
    assignedPrograms: [AssignedProgram.OPERATION_WELLNESS],
  },
  {
    firstName: "Johnny",
    lastName: "Appleseed",
    email: "johnny@appleseed.com",
    role: Role.VETERAN,
    assignedPrograms: [AssignedProgram.OPERATION_WELLNESS],
  },
  {
    firstName: "Johnny",
    lastName: "Appleseed",
    email: "johnny@appleseed.com",
    role: Role.VETERAN,
    assignedPrograms: [AssignedProgram.OPERATION_WELLNESS],
  },
];

export function getUserProfile(role: string): UserProfile {
  return getUser1(role as Role);
}
