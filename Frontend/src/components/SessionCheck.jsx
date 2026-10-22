import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useGetMeQuery } from '../redux/api';
import { setAuthenticated, setUnauthenticated } from '../redux/authSlice';

export default function SessionCheck() {
  const dispatch = useDispatch();
  const token = localStorage.getItem('token');

  const { data, isLoading, isError } = useGetMeQuery(token, { skip: !token });

  useEffect(() => {
    if (!token) {
      dispatch(setUnauthenticated());
      return;
    }

    if (isLoading) return;

    const isAuthenticated = data?.data?.isAuthenticated ?? data?.isAuthenticated;
    if (isError || !isAuthenticated) {
      dispatch(setUnauthenticated());
      return;
    }

    dispatch(setAuthenticated({ isAuthenticated: true, token }));
  }, [token, data, isLoading, isError, dispatch]);

  return null;
}
