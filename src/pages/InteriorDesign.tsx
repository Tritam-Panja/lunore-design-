import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function InteriorDesign() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/#interior-experience', { replace: true });
  }, [navigate]);

  return null;
}
