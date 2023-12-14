import axiosInstance from '../axiosInstance';
import {
  OrganizationCreateReq,
  OrganizationCreateRes,
  OrganizationViewRes,
} from '../types/organization';
import { AxiosResponse } from 'axios';

export const OrganizationRepository = {
  async getOrganization(orgId: number): Promise<OrganizationViewRes> {
    return await axiosInstance
      .get(`/organizations/${orgId}`)
      .then((response) => response.data);
  },
  async createOrganization(orgName: string): Promise<OrganizationCreateRes> {
    return await axiosInstance
      .post<OrganizationCreateReq, AxiosResponse<OrganizationCreateRes>>(
        `/organizations`,
        {
          name: orgName,
        },
      )
      .then((response) => response.data);
  },
};
