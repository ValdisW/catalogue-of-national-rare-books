import axios from "axios";

// 创建一个 Axios 实例
const apiClient = axios.create({
  baseURL: "https://your-backend-api.com",
  timeout: 1000,
  headers: { "X-Custom-Header": "foobar" },
});

// 全字段检索
export function serachAll(query: string) {
  return axios.post("/data/search-all", { query });
}

// 指定字段检索
export function searchForBooks(values: Array<{ value: string; attr: string }>) {
  return axios.post("/data/search-for-books", { values });
}

export function preloadIntroductionData() {
  return axios.get("/data/introduction-preload");
}

export function loadExplorationData() {
  return axios.get("/data/exploration-load");
}

export function loadRelationshipData() {
  return axios.get("/data/relationship-load");
}

export function loadIntroductionData() {
  return axios.get("/data/introduction-load");
}

export function getBookDetailData(id: string) {
  return axios.get(`/data/book-detail/${id}`);
}

export function getPersonDetailData(id: string) {
  return axios.get(`/data/person-detail/${id}`);
}

export function getRelByBookName(text: string) {
  return axios.get(`/data/person?text=${text}`);
}

export default apiClient;
