import { useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';

export const UserSync = () => {
  const { user, isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    const syncUser = async () => {
      if (!isLoaded || !isSignedIn || !user) return;

      try {
        // Get full name from Google/Clerk
        const fullName = user.fullName || user.firstName || 'User';
        
        // Send to backend with name
        await axios.post('https://craftconnect-bbdp.onrender.com/user-api/user', {
          clerkId: user.id,
          email: user.primaryEmailAddress?.emailAddress,
          role: 'customer',
          name: fullName  // ← Sends name to backend
        });
      } catch (error) {
        console.error('Error syncing user:', error);
      }
    };

    syncUser();
  }, [user, isSignedIn, isLoaded]);

  return null;
};