import { useEffect, useState } from 'react';
import { subscribeLandmarkerStatus, type LandmarkerStatus } from '@/utils/face';

export function useLandmarkerStatus(): LandmarkerStatus {
  const [status, setStatus] = useState<LandmarkerStatus>('idle');

  useEffect(() => {
    return subscribeLandmarkerStatus(setStatus);
  }, []);

  return status;
}
