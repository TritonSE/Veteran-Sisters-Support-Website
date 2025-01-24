export type UserProfile = {
  email: string;
  firstName: string;
  lastName: string;
  profilePictureUrl: string;
  assignedPrograms: AssignedProgram[];
  yearJoined: number;
  age: number;
  gender: string;
  phoneNumber: string;
  role: Role;
  veteransUnderPointOfContact?: Veteran[];
  assignedVeterans?: Veteran[];
};

export type Veteran = {
  firstName: string;
  lastName: string;
  email: string;
  assignedProgram: AssignedProgram;
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

function getStaffProfile(): UserProfile {
  return {
    email: "lcfriedman@ucsd.edu",
    firstName: "Leo",
    lastName: "Friedman",
    profilePictureUrl: "",
    assignedPrograms: [AssignedProgram.BATTLE_BUDDIES, AssignedProgram.ADVOCACY],
    yearJoined: 2012,
    age: 22,
    gender: "Male",
    phoneNumber: "(012) 345-6789",
    role: Role.STAFF,
    veteransUnderPointOfContact: [
      {
        firstName: "Johnny",
        lastName: "Appleseed",
        email: "johnny@appleseed.com",
        assignedProgram: AssignedProgram.ADVOCACY,
      },
      {
        firstName: "Johnny",
        lastName: "Appleseed",
        email: "johnny@appleseed.com",
        assignedProgram: AssignedProgram.ADVOCACY,
      },
      {
        firstName: "Johnny",
        lastName: "Appleseed",
        email: "johnny@appleseed.com",
        assignedProgram: AssignedProgram.BATTLE_BUDDIES,
      },
      {
        firstName: "Johnny",
        lastName: "Appleseed",
        email: "johnny@appleseed.com",
        assignedProgram: AssignedProgram.BATTLE_BUDDIES,
      },
      {
        firstName: "Johnny",
        lastName: "Appleseed",
        email: "johnny@appleseed.com",
        assignedProgram: AssignedProgram.BATTLE_BUDDIES,
      },
      {
        firstName: "Johnny",
        lastName: "Appleseed",
        email: "johnny@appleseed.com",
        assignedProgram: AssignedProgram.BATTLE_BUDDIES,
      },
    ],
  };
}

function getVolunteerProfile(): UserProfile {
  return {
    email: "lcfriedman@ucsd.edu",
    firstName: "Leo",
    lastName: "Friedman",
    profilePictureUrl: "",
    assignedPrograms: [
      AssignedProgram.BATTLE_BUDDIES,
      AssignedProgram.ADVOCACY,
      AssignedProgram.OPERATION_WELLNESS,
    ],
    yearJoined: 2012,
    age: 22,
    gender: "Male",
    phoneNumber: "(012) 345-6789",
    role: Role.VOLUNTEER,
    assignedVeterans: [
      {
        firstName: "Johnny",
        lastName: "Appleseed",
        email: "johnny@appleseed.com",
        assignedProgram: AssignedProgram.ADVOCACY,
      },
      {
        firstName: "Johnny",
        lastName: "Appleseed",
        email: "johnny@appleseed.com",
        assignedProgram: AssignedProgram.ADVOCACY,
      },
      {
        firstName: "Johnny",
        lastName: "Appleseed",
        email: "johnny@appleseed.com",
        assignedProgram: AssignedProgram.OPERATION_WELLNESS,
      },
      {
        firstName: "Johnny",
        lastName: "Appleseed",
        email: "johnny@appleseed.com",
        assignedProgram: AssignedProgram.OPERATION_WELLNESS,
      },
      {
        firstName: "Johnny",
        lastName: "Appleseed",
        email: "johnny@appleseed.com",
        assignedProgram: AssignedProgram.OPERATION_WELLNESS,
      },
      {
        firstName: "Johnny",
        lastName: "Appleseed",
        email: "johnny@appleseed.com",
        assignedProgram: AssignedProgram.BATTLE_BUDDIES,
      },
    ],
  };
}

export function getUserProfile(role: string): UserProfile {
  switch (role) {
    case Role.STAFF:
      return getStaffProfile();
    case Role.VOLUNTEER:
      return getVolunteerProfile();
    default:
      return getStaffProfile();
  }
}
