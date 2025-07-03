import { useDispatch, useSelector } from 'react-redux';
import './App.css'
import AppRoutes from './routes';
import { useEffect } from 'react';
import { fetchProfile } from './features/users/userSlice';
import UploadUnloadGuard from './components/UploadUnloadGuard';

function App() {

  const { isAuthenticated } = useSelector(state => state.auth);

  const dispatch = useDispatch();

  // useEffect(() => {
  //   if (isAuthenticated) {
  //     dispatch(refreshToken())
  //       .unwrap()
  //       .catch(() => {
  //         toast.error("Session expired. Please log in again.");
  //         dispatch(logout())
  //       });
  //   }
  // }, [dispatch]);

  // if (isAuthenticated && tokenRefreshing) {
  //   return <div className="flex items-center justify-center h-screen">Refreshing session...</div>;
  // }

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchProfile())
    }
  }, [dispatch, isAuthenticated]);

  return (
    <>
      <AppRoutes isAuthenticated={isAuthenticated} />
      <UploadUnloadGuard />
    </>
  )
}

export default App;