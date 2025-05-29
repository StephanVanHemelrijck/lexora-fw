import { auth } from './firebase.ts';
import { signInWithEmailAndPassword, UserCredential } from 'firebase/auth';

export const authService = {
  login: async (email: string, password: string): Promise<UserCredential> => {
    try {
      const credential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      return credential;
    } catch (error) {
      console.log(error);
      throw error;
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
