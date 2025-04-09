/* eslint-disable*/
import axios from 'axios';
import { showAlert } from './alert';

// type is either 'data' or 'password'
export const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? '/api/v1/users/updateMyPassword'
        : '/api/v1/users/updateMe';
    const res = await axios({
      method: 'PATCH',
      url,
      data
    });

    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated sucessfully `);
      // window.setTimeout(() => {
      //   location.assign('/me');
      // }, 2000);
      // Return updated user data (including photo filename)
      return res.data.data.user;
    }
  } catch (error) {
    showAlert('error', error.response.data.message);
  }
};
