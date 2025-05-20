import { auth } from './firebase.ts';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';

// Replace this with your backend API URL
const API_URL = 'http://192.168.0.129:3000';

export const authService = {
  register: async (email: string, password: string) => {
    console.log(`trying to register ${email}`);
    try {
      // Create user with Firebase
      const createdUser = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log('User created:', createdUser);

      // Get the user's UID and send it to the backend
      const uid = createdUser.user.uid;

      // Make API call to your backend to store UID in the database
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid, // Send UID
        }),
      });

      const responseData = await response.json();
      if (response.ok) {
        console.log(
          'User successfully registered in the backend',
          responseData
        );
      } else {
        console.error('Failed to store user in backend', responseData);
      }

      return createdUser;
    } catch (error) {
      console.error('Registration failed:', error);
      return null;
    }
  },
  login: async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.log(error);
    }
  },
  logout: async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.log(error);
    }
  },
};

export default authService;
