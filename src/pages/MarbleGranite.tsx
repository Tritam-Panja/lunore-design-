import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function MarbleGranite() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/#marble-experience', { replace: true });
  }, [navigate]);

  return null;
}
