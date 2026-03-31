import { useEffect, useState } from 'react';
import { User } from '@/types/hooks.types';

export function useUser() {
  const [user, setUser] = useState<User>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/me', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user);
        setLoaded(true);
      });
  }, []);

  return { user, loaded };
}
