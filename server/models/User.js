import mongoose from "mongoose";

// Define the schema for the User model
const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },  // User's name, required field
  
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },  // User's email, required and unique field
  
  password: { 
    type: String, 
    required: true 
  },  // User's password, required field
}, {
  timestamps: true  // Automatically add createdAt and updatedAt fields
});

// Create a model from the schema
const UserModel = mongoose.model("User", userSchema);

// Export the UserModel
export default UserModel;
