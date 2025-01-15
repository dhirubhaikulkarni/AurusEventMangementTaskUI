import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser,SetUser } from '../../components/Store/userSlice';

const useAuth = () => {
  const dispatch = useDispatch();
  const user = useSelector(getUser);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      dispatch(SetUser(JSON.parse(storedUser)));
    } else {
      navigate('/login');
    }
  }, [dispatch, navigate]);

//   useEffect(() => {
//     // When user state changes, update localStorage
//     localStorage.setItem('user', JSON.stringify(user));
//   }, [user]);

  return user || null;
};

export default useAuth;
