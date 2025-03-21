import React, { useEffect, useState } from 'react';
const REACT_BASE_URL =  process.env.REACT_APP_BASE_URL;
const Users = () => {
  const [users, setUsers] = useState([]);

  const handleUser = async () => {
    try {
      const response = await fetch(`${REACT_BASE_URL}/admin/users`, {
        method: 'GET',
      });
      const data = await response.json();
      if (response.ok) {
        setUsers(data.data);
      } else {
        setUsers([])
      }
    } catch (error) {
      console.log("Error : ", error);
    }
  }
  useEffect(() => {
    handleUser();
  }, []);
  return (
    <>
      <div className='container'>
        <h1 className='text-center'>All users</h1>
        <table class="table text-center table-striped">
          <thead>
            <tr>
              <th scope="col">S. No.</th>
              <th scope="col">Username</th>
              <th scope='col'>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {
              users.map((data, index) => {
                return (
                  <>
                    <tr key={data._id}>
                      <td>{index + 1}</td>
                      <td>{data.username}</td>
                      <td>{data.email}</td>
                      <td>
                        <button className='btn btn-sm btn-danger'>Delete</button>
                      </td>
                    </tr>
                  </>
                )
              })

            }
          </tbody>
        </table>
      </div>
    </>
  )
}

export default Users;