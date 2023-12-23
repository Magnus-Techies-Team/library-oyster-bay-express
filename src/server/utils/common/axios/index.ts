import FirstMicroServiceInstance from "./instances/firstMicroService";
import PerformanceMicroServiceInstance from "./instances/performanceMicroService";
import _CONFIG from "~src/config";

const firstMicroServiceAPI = new FirstMicroServiceInstance({
  withCredentials: true,
  baseURL: "http://localhost:3002",
});
const performanceMicroServiceAPI = new PerformanceMicroServiceInstance({
  withCredentials: true,
  baseURL: _CONFIG.services.performance,
});

export { firstMicroServiceAPI, performanceMicroServiceAPI };
