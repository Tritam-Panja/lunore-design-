import { useNavigate } from 'react-router-dom';
import { MarbleStackModal } from '@/components/MarbleStackModal';

export function MarbleStack() {
  const navigate = useNavigate();

  const handleClose = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return <MarbleStackModal onClose={handleClose} />;
}
