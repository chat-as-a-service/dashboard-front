import axiosInstance from '../axiosInstance';
import {
  ApplicationCreateReq,
  ApplicationCreateRes,
  ApplicationEditReq,
  ApplicationGetMasterApiKeyReq,
  ApplicationGetMasterApiKeyRes,
  ApplicationListRes,
  ApplicationViewRes,
} from '../types/application';
import { AxiosResponse } from 'axios';

export const ApplicationRepository = {
  async listApplications(
    searchKeyword: string = '',
    abortSignal?: AbortSignal,
  ) {
    let trimmedSearchKeyword = searchKeyword.trim();
    return await axiosInstance
      .get<ApplicationListRes[]>(`/applications`, {
        signal: abortSignal,
        params: {
          search_keyword:
            trimmedSearchKeyword === '' ? undefined : trimmedSearchKeyword,
        },
      })
      .then((response) => response.data);
  },

  async viewApplicationByUuid(appUuid: string) {
    return await axiosInstance
      .get<ApplicationViewRes>(`/applications/${appUuid}`, {
        params: {
          id_type: 'uuid',
        },
      })
      .then((response) => response.data);
  },

  async createApplication(dto: ApplicationCreateReq) {
    return await axiosInstance
      .post<ApplicationCreateRes>(`/applications`, dto)
      .then((response) => response.data);
  },

  async editApplication(applicationId: number, dto: ApplicationEditReq) {
    return await axiosInstance
      .put<ApplicationCreateRes>(`/applications/${applicationId}`, dto)
      .then((response) => response.data);
  },

  async deleteApplication(applicationId: number) {
    return await axiosInstance
      .delete(`/applications/${applicationId}`)
      .then((response) => response.data);
  },

  async getApplicationMasterApiKey(
    applicationId: number,
    dto: ApplicationGetMasterApiKeyReq,
  ) {
    return await axiosInstance
      .post<
        ApplicationGetMasterApiKeyReq,
        AxiosResponse<ApplicationGetMasterApiKeyRes>
      >(`/applications/${applicationId}/master-api-key`, dto)
      .then((response) => response.data);
  },
};
