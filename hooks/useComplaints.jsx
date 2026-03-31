import { getComplaints } from '@/services/complaints.service';
import { useEffect, useState } from 'react';


export function useComplaints() {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    getComplaints().then(setComplaints);
  }, []);

  return { complaints };
}