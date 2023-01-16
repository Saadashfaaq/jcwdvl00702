import { useEffect } from 'react';
import Axios from 'axios';
import { useSelector } from 'react-redux';
import Dashboard from './Admin/Dashboard';
import HomeFunc from './HomeFunc';

export default function Main() {
  const { user } = useSelector((state) => ({
    user: state.auth.user,
  }));
  console.log(user);

  const userCheck = () => {
    Axios.get(`${process.env.REACT_APP_API_BASE_URL}/customer/profile/${user?.customer_uid}`)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    userCheck();
  }, []);

  return (
    <div>
      {user ? user.approle?.role === 'user' && <HomeFunc /> : <HomeFunc />}
      {user ? user.approle?.role === 'superadmin' && <Dashboard /> : null}
      {user ? user.approle?.role === 'admin_wh' && <Dashboard /> : null}
      {user ? user.approle?.role === 'admin_TBA' && <Dashboard /> : null}
    </div>
  );
}
