import React from 'react';
import { Container } from 'react-bootstrap';
import useAuth from '../../Auth/useAuth';

const Profile = () => {
  const user = useAuth();
  if (!user) {
    return null;
  }

  return (
    <Container className="py-4 h-100">
      <div className='px-4 pt-3 pb-4 rounded-4 shadow'>
        <div className='w-100 d-flex justify-content-center'>
          <img className='rounded-pill' width={100} height={100} src='https://th.bing.com/th/id/OIP.0h8fo76BwSZTehnXfYhcNQHaHc?w=193&h=194&c=7&r=0&o=5&dpr=1.3&pid=1.7' />
        </div>

        <div className='w-100 d-flex justify-content-center'>
          <div className='fs-3 fw-semibold'>
            {user.firstName} {user.lastName}
          </div>
        </div>
        
        <div className="row mt-5">

          <div className="row">
            <strong className="col-3 col-lg-2 text-nowrap">Email:</strong>
            <div className="col-9 col-lg-10 text-nowrap">{user.email}</div>
          </div>

          <div className="row">
            <strong className="col-3 col-lg-2 text-nowrap">Role:</strong>
            <div className="col-9 col-lg-10 text-nowrap">{user.role}</div>
          </div>
        </div>

      </div>

    </Container>
  );
};

export default Profile;