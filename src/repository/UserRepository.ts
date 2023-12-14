import axiosInstance from '../axiosInstance';
import {
  UserCreateReq,
  UserCreateRes,
  UserCreateSessionTokenReq,
  UserCreateSessionTokenRes,
  UserDeleteReq,
  UserListRes,
  UserViewRes,
} from '../types/user';
import { AxiosResponse } from 'axios';

export const UserRepository = {
  async listUsers(
    applicationId: number,
    searchKeyword: string = '',
    abortSignal?: AbortSignal,
  ) {
    let trimmedSearchKeyword = searchKeyword.trim();
    return await axiosInstance
      .get<UserListRes[]>(`/users`, {
        signal: abortSignal,
        params: {
          application_id: applicationId,
          search_keyword:
            trimmedSearchKeyword === '' ? undefined : trimmedSearchKeyword,
        },
      })
      .then((response) => response.data);
  },

  async viewUser(applicationId: number, username: string) {
    return await axiosInstance
      .get<UserViewRes>(`/users/${username}`, {
        params: {
          application_id: applicationId,
        },
      })
      .then((response) => response.data);
  },

  async createUser(dto: UserCreateReq) {
    return await axiosInstance
      .post<UserCreateRes>(`/users`, dto)
      .then((response) => response.data);
  },

  async getUserSessionToken(dto: UserCreateSessionTokenReq) {
    return await axiosInstance
      .post<
        UserCreateSessionTokenReq,
        AxiosResponse<UserCreateSessionTokenRes>
      >(`/users/session-token`, dto)
      .then((response) => response.data);
  },

  async deleteUsers(dto: UserDeleteReq) {
    return await axiosInstance
      .delete<UserDeleteReq, AxiosResponse<UserCreateRes>>(`/users`, {
        data: dto,
      })
      .then((response) => response.data);
  },
};
