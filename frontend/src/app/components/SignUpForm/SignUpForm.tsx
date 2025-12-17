"use client";

import { FirebaseError } from "firebase/app";
import { User, createUserWithEmailAndPassword, deleteUser, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import React, { MouseEvent, useState } from "react";

import { auth } from "../../../firebase/firebase";
import { useAuth } from "../../contexts/AuthContext";
import ErrorMessage from "../ErrorMessage";

import Loading from "./Loading";
import OnboardingInterests from "./OnboardingInterests";
import RoleSelection from "./RoleSelection";
import ServiceDetails from "./ServiceDetails";
import UserDetails from "./UserDetails";

import createUserImported, { CreateUserRequest } from "@/app/api/userApi";

export default function SignUpForm() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);
  const [showDropdown, setShowDropdown] = useState(true);
  const [activeButton, setActiveButton] = useState("");
  const [isVeteran, setIsVeteran] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [streetAddressLine2, setStreetAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [serviceDate, setServiceDate] = useState("");
  const [branch, setBranch] = useState("");
  const [militaryStatus, setMilitaryStatus] = useState("");
  const [gender, setGender] = useState("");
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [formErrors, setFormErrors] = useState<{
    signUpOption?: string; // Choosing veteran vs volunteer
    email?: string; // Invalid email string
    phone?: string; // Invalid phone number
    alreadyExists?: string; // An account with this email already exists
    password?: string; // Password must be 6 characters
    confirmPassword?: string; // Confirm password and password inputs must match
    zip?: string; // Zip is required (special error message since it is hidden in dropdown)
    zipValid?: string; // Zip must be a 5 digit string
    requiredFields?: string; // On page 1, some text fields are required
    service?: string; // On service page, all fields are required
    onboarding?: string; // At least one interest must be chosen on last page
  }>({});
  const { setIsSigningUp, isSigningUp } = useAuth();
  const [errorMessage, setErrorMessage] = useState("");

  const handleNext = () => {
    setCurrentPage((prev) => {
      // If on page 1 (user details) and user is not a veteran, skip service details.
      if (prev === 1 && !isVeteran) {
        return prev + 2;
      }
      return prev + 1;
    });
  };

  const handlePrevious = () => {
    setCurrentPage((prev) => {
      if (prev === 3 && !isVeteran) {
        return 1;
      }
      return prev - 1;
    });
  };

  // Helper function to clean up Firebase user when MongoDB creation fails
  const cleanupFirebaseUser = async (firebaseUser: User) => {
    try {
      await deleteUser(firebaseUser);
      console.log("Firebase user deleted due to MongoDB creation failure");
    } catch (deleteError) {
      console.error("Failed to delete Firebase user:", deleteError);
      try {
        await signOut(auth);
      } catch (signOutError) {
        console.error("Failed to sign out:", signOutError);
      }
    }
  };

  const handleSignup = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setFormErrors({});

    if (selectedOptions.length === 0) {
      setFormErrors((prev) => ({
        ...prev,
        onboarding: "Please select at least one option.",
      }));
      return;
    } else {
      setFormErrors((prev) => ({
        ...prev,
        onboarding: "",
      }));
    }

    try {
      setIsSigningUp(true);

      // Create Firebase user first
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // If successful, create user data in MongoDB
      try {
        const [month, day, year] = serviceDate.split("-").map(Number);
        const dateObject = new Date(year, month - 1, day);
        const newUser: CreateUserRequest = {
          email,
          firstName,
          lastName,
          role: isVeteran ? "veteran" : "volunteer",
          phoneNumber: phone,
          zipCode: parseInt(zip),
          address: {
            streetAddress1: streetAddress,
            streetAddress2: streetAddressLine2,
            city,
            state,
          },
          roleSpecificInfo: {
            serviceInfo: {
              dateServiceEnded: dateObject,
              branchOfService: branch,
              currentMilitaryStatus: militaryStatus,
              gender,
            },
            interests: selectedOptions,
            assignedPrograms: [],
          },
          assignedVeterans: [],
        };

        const result = await createUserImported(newUser);
        if (!result.success) {
          // MongoDB user creation failed - delete the Firebase user and sign out
          console.error("MongoDB user creation failed:", result.error);
          await cleanupFirebaseUser(firebaseUser);
          setIsSigningUp(false);
          setErrorMessage(`Failed to create user: ${result.error}. Please try again.`);
          return;
        }

        // Both Firebase and MongoDB user creation succeeded
        setIsSigningUp(false);
        router.push("/");
      } catch (error: unknown) {
        // MongoDB user creation failed with an exception - delete Firebase user
        console.error("MongoDB user creation failed:", error);
        await cleanupFirebaseUser(firebaseUser);
        setIsSigningUp(false);
        setErrorMessage("Something went wrong. Please try again.");
        return;
      }
    } catch (error: unknown) {
      // Firebase user creation failed (or other unexpected errors)
      if (error instanceof FirebaseError) {
        if (error.code === "auth/email-already-in-use") {
          setErrorMessage("An account with this email already exists.");
        } else {
          setErrorMessage(`Error creating user: ${error.code}`);
        }
      } else {
        setErrorMessage(`Error creating user: ${String(error)}`);
      }
      setIsSigningUp(false);
      return;
    }
  };

  const handleButton = (e: MouseEvent<HTMLButtonElement>, buttonType: string) => {
    e.preventDefault();
    setActiveButton(buttonType);
    setIsVeteran(buttonType === "button1");
  };

  const toggleDropdown = (id: string) => {
    setActiveDropdown((prev) => (prev === id ? "" : id));
  };

  const renderStage = () => {
    switch (currentPage) {
      case 0:
        return (
          <RoleSelection
            activeButton={activeButton}
            handleButton={handleButton}
            formErrors={formErrors}
            setFormErrors={setFormErrors}
            onNext={handleNext}
          />
        );
      case 1:
        return (
          <UserDetails
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            phone={phone}
            setPhone={setPhone}
            firstName={firstName}
            setFirstName={setFirstName}
            lastName={lastName}
            setLastName={setLastName}
            streetAddress={streetAddress}
            setStreetAddress={setStreetAddress}
            streetAddressLine2={streetAddressLine2}
            setStreetAddressLine2={setStreetAddressLine2}
            city={city}
            setCity={setCity}
            stateVal={state}
            setStateVal={setState}
            zip={zip}
            setZip={setZip}
            showDropdown={showDropdown}
            setShowDropdown={setShowDropdown}
            activeDropdown={activeDropdown}
            toggleDropdown={toggleDropdown}
            formErrors={formErrors}
            setFormErrors={setFormErrors}
            onNext={handleNext}
            onPrevious={handlePrevious}
            isVeteran={isVeteran}
          />
        );
      case 2:
        return (
          <ServiceDetails
            serviceDate={serviceDate}
            setServiceDate={setServiceDate}
            branch={branch}
            setBranch={setBranch}
            militaryStatus={militaryStatus}
            setMilitaryStatus={setMilitaryStatus}
            gender={gender}
            setGender={setGender}
            activeDropdown={activeDropdown}
            toggleDropdown={toggleDropdown}
            formErrors={formErrors}
            setFormErrors={setFormErrors}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 3:
        return (
          <OnboardingInterests
            selectedOptions={selectedOptions}
            setSelectedOptions={setSelectedOptions}
            formErrors={formErrors}
            setFormErrors={setFormErrors}
            onSubmit={(e) => void handleSignup(e)}
            onPrevious={handlePrevious}
            isVeteran={isVeteran}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      {isSigningUp ? <Loading /> : renderStage()}
      <ErrorMessage message={errorMessage} />
    </>
  );
}
