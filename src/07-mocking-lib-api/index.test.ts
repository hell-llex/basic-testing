import axios from 'axios';
import { throttledGetDataFromApi } from './index';

jest.mock('axios');
jest.mock('lodash', () => ({
  throttle: (fn: any) => fn,
}));

describe('throttledGetDataFromApi', () => {
  const mockResponseData = { id: 1, title: 'Test' };
  let axiosCreateMock: any;
  let axiosClientMock: any;

  beforeEach(() => {
    axiosClientMock = {
      get: jest.fn().mockResolvedValue({ data: mockResponseData }),
    };
    axiosCreateMock = (axios.create as jest.Mock).mockReturnValue(
      axiosClientMock,
    );
    jest.clearAllMocks();
  });

  test('should create instance with provided base url', async () => {
    await throttledGetDataFromApi('/posts');
    expect(axiosCreateMock).toHaveBeenCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  });

  test('should perform request to correct provided url', async () => {
    const relativePath = '/posts/1';
    await throttledGetDataFromApi(relativePath);
    expect(axiosClientMock.get).toHaveBeenCalledWith(relativePath);
  });

  test('should return response data', async () => {
    const data = await throttledGetDataFromApi('/posts/1');
    expect(data).toEqual(mockResponseData);
  });
});
