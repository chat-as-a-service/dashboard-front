import axiosInstance from '../axiosInstance';
import { AxiosResponse } from 'axios';
import {
  ChannelCreateReq,
  ChannelCreateRes,
  ChannelListRes,
} from '../types/channel';

export const ChannelRepository = {
  async listChannels(
    applicationId: number,
    searchKeyword: string = '',
    abortSignal?: AbortSignal,
  ) {
    let trimmedSearchKeyword = searchKeyword.trim();
    return await axiosInstance
      .get<ChannelListRes[]>(`/channels`, {
        signal: abortSignal,
        params: {
          application_id: applicationId,
          search_keyword:
            trimmedSearchKeyword === '' ? undefined : trimmedSearchKeyword,
        },
      })
      .then((response) => response.data);
  },
  async createChannel(dto: ChannelCreateReq) {
    return await axiosInstance
      .post<ChannelCreateReq, AxiosResponse<ChannelCreateRes>>(`/channels`, dto)
      .then((response) => response.data);
  },
};
