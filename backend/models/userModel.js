import mongoose, { Mongoose } from "mongoose";
const { Schema, model } = mongoose;

const userSchema = new Schema({
  email: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  role: {
    type: String,
    enum: ["veteran", "volunteer", "staff", "admin"],
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    match: [/^\d{3}-\d{3}-\d{4}$/, "Phone number must be in the format XXX-XXX-XXXX"],
  },
  zipCode: {
    type: Number,
    required: true,
  },
  address: {
    streetAddress1: { type: String },
    streetAddress2: { type: String },
    city: { type: String },
    state: { type: String },
  },
  roleSpecificInfo: {
    serviceInfo: {
      dateServiceEnded: {
        type: Date,
        required: function () {
          return this.role === "veteran";
        },
      },
      branchOfService: {
        type: String,
        enum: [
          "Air Force",
          "Army",
          "Coast Guard",
          "First Responder",
          "Marine Corps",
          "Navy",
          "National Guard",
          "Space Force",
          "",
        ],
        validate: {
          validator: function (value) {
            // if role is veteran, branch of service required (empty string allowed)
            if (this.role === "veteran") {
              return value !== undefined && value !== null;
            }
            // not required if not veteran
            return true;
          },
          message: "Branch of service is required",
        },
      },
      currentMilitaryStatus: {
        type: String,
        enum: [
          "Active Duty",
          "Reservist",
          "Veteran",
          "Veteran Medically Retired",
          "Veteran 20+ Years Retired",
          "First Responder (no military service)",
          "",
        ],
        validate: {
          validator: function (value) {
            // if role is veteran, current military status required (empty string allowed)
            if (this.role === "veteran") {
              return value !== undefined && value !== null;
            }
            // not required if not veteran
            return true;
          },
          message: "Current military status is required",
        },
      },
      gender: {
        type: String,
        enum: ["Female", "Male", "Other", ""],
        validate: {
          validator: function (value) {
            // if role is veteran, gender required (empty string allowed)
            if (this.role === "veteran") {
              return value !== undefined && value !== null;
            }
            // not required if not veteran
            return true;
          },
          message: "Gender is required",
        },
      },
    },
    interests: [
      {
        type: String,
        enum: [
          "Get a battle buddy",
          "Be a battle buddy",
          "Get help filing for VA benefits",
          "Get help with a discharge update",
          "Learn more about becoming a peer support specialist",
          "Wellness events",
          "Social events",
          "Other",
          "",
        ],
      },
    ],
  },
  assignedPrograms: {
    type: [String],
    enum: ["battle buddies", "advocacy", "operation wellness"],
    required: true,
  },
  assignedUsers: [String],
  yearJoined: { type: Number },
  age: { type: Number },
  unreadActivities: {
    type: [String],
  },
});

export const User = model("User", userSchema);
