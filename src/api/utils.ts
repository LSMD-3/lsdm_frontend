import axios from "axios";
axios.defaults.baseURL = "http://localhost:10000/api";

export const responseErrorCheck = (res: any) => {
  if (res.status > 199 || res.status < 300) {
    return res.data;
  }
  throw new Error(res.status.toString());
};

// Add a request interceptor
axios.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
axios.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },

  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    let errorMessage = "";
    const errorBody = error.response.data;
    if (Array.isArray(errorBody)) {
      errorBody.forEach((error) => {
        if (error.msg) errorMessage += error.msg + " " + error.param;
      });
    } else {
      errorMessage += errorBody.clientMessage ?? errorBody.systemMessage;
    }

    return Promise.reject(errorMessage);
  }
);

export interface SearchParams {
  general?: GeneralFilter;
  equal?: BaseAndOrFilter | BaseFilter;
  like?: BaseAndOrFilter | BaseFilter;
  range?: RangeFilter;
  dateRange?: DateRangeFilter;
  offset?: number;
  limit?: number;
  sort?: SortField[];
  projectFieldsSearch?: string | "all";
  customProject?: string;
}

export interface BaseAndOrFilter {
  or: BaseFilter[];
  and: BaseFilter[];
}

export interface SortField {
  field: string;
  direction: SortDirection;
}

export enum SortDirection {
  ASCENDING = 1,
  DESCENDING = -1,
}

export interface BaseFilter {
  field: string;
  value: string | number;
  caseSensitive: boolean;
}

export interface GeneralFilter {
  fields: string[];
  value: string | number | boolean;
}

export interface RangeFilter {
  field: string;
  start: number;
  stop: number;
}

export interface DateRangeFilter {
  field: string;
  start: number;
  stop: number;
}
