import { Role, AssignedProgram } from "../api/profileApi";


export default function ProfileHeader(params: {
  firstName: string;
  lastName: string;
  role: Role;
  assignedPrograms: AssignedProgram[];
  yearJoined: number;
  age: number;
  phoneNumber: string;
  profilePictureUrl: string;
  gender: String;
  email: String;
}) {
  const {
    firstName,
    lastName,
    role,
    assignedPrograms,
    yearJoined,
    age,
    phoneNumber,
    gender,
    email,
  } = params;
  const fullName = `${firstName} ${lastName}`;
  const joinedText = `Joined: ${yearJoined}`;
  const ageText = `Age: ${age}`;
  const genderText = `Gender: ${gender}`;
  return (
    <header>
      <img></img>
      <div>
        <div>
          <div>{fullName}</div>
        </div>
        <div>{joinedText}</div>
        <div>{ageText}</div>
        <div>{genderText}</div>
        <div>{email}</div>
        <div>{phoneNumber}</div>
      </div>
    </header>
  );
}
