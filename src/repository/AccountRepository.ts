import axiosInstance from '../axiosInstance';
import {
  AccountRes,
  AccountSignInReq,
  AccountSignInRes,
} from '../types/account';
import { AxiosResponse } from 'axios';

export const AccountRepository = {
  async signIn(email: string, password: string) {
    return await axiosInstance
      .post<AccountSignInReq, AxiosResponse<AccountSignInRes>>(
        '/accounts/signin',
        {
          email,
          password,
        },
      )
      .then((response) => response.data);
  },
  async whoAmI() {
    return await axiosInstance
      .get<AccountRes>('/accounts/me')
      .then((response) => response.data);
  },
};
