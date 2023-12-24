import FirstMicroServiceInstance from "./instances/firstMicroService";

const firstMicroServiceAPI = new FirstMicroServiceInstance({
  withCredentials: true,
  baseURL: "http://localhost:3002",
});

export { firstMicroServiceAPI };
