import { useEffect, useState } from 'react';
import { getComplaints } from '@/services/complaints.service';

export function useComplaints() {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    getComplaints().then(setComplaints);
  }, []);

  return { complaints };
}