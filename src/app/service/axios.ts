import axios, {
  AxiosError,
  AxiosResponse,
  HttpStatusCode,
  InternalAxiosRequestConfig,
} from "axios";

type CustomAxiosError = AxiosError & {
  response: {
    data: {
      error: {
        message: string;
      };
    };
  };
};

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    "Content-Type": `application/json`,
  },
});

export const apiFile = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

const onRequest = async (config: InternalAxiosRequestConfig) => {
  return config;
};

const onResponse = (response: AxiosResponse) => {
  return response.config.responseType === "blob"
    ? response
    : response.data.data;
};

const onError = (error: CustomAxiosError) => {
  if (error.response && error.response.status === HttpStatusCode.NotFound) {
    alert(error.response?.data?.error?.message);
    return;
  }
  if (error.response && error.response.status === HttpStatusCode.BadRequest) {
    alert(error.response?.data?.error?.message);
    return;
  }

  if (error.response && error.response.status === HttpStatusCode.Forbidden) {
    alert("접근 권한이 없습니다.");
    return;
  }
  alert(error.response?.data?.error?.message || error.response.statusText);
  return Promise.reject(
    error.response?.data?.error?.message || error.response.statusText
  );
};

api.interceptors.request.use(onRequest, onError);
api.interceptors.response.use(onResponse, onError);
apiFile.interceptors.request.use(onRequest, onError);
apiFile.interceptors.response.use(onResponse, onError);

export default api;
