import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://quantum-uc-38.onrender.com' : 'http://localhost:8000');

export const optimizationApi = {
  checkHealth: async () => {
    try {
      const response = await axios.get(`${API_URL}/api/health`, { timeout: 3000 });
      return { online: true, data: response.data };
    } catch {
      return { online: false };
    }
  },

  getOrders: async () => {
    try {
      const response = await axios.get(`${API_URL}/api/orders`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      throw new Error(error.response?.data?.detail || "Backend unavailable. Could not fetch orders.");
    }
  },

  createOrder: async (order) => {
    try {
      const response = await axios.post(`${API_URL}/api/orders`, order);
      return response.data;
    } catch (error) {
      console.error("Failed to create order:", error);
      throw new Error(error.response?.data?.detail || "Could not create order on backend.");
    }
  },

  deleteOrder: async (orderId) => {
    try {
      const response = await axios.delete(`${API_URL}/api/orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error("Failed to delete order:", error);
      throw new Error(error.response?.data?.detail || "Could not delete order.");
    }
  },

  seedOrders: async () => {
    try {
      const response = await axios.post(`${API_URL}/api/orders/seed`);
      return response.data;
    } catch (error) {
      console.error("Failed to reset orders:", error);
      throw new Error("Could not reset orders.");
    }
  },

  optimize: async (config) => {
    try {
      const response = await axios.post(`${API_URL}/api/optimize`, config);
      return response.data;
    } catch (error) {
      console.error("Optimization failed:", error);
      throw new Error(error.response?.data?.detail || "Backend unavailable. Please ensure optimization server is running.");
    }
  },

  getLatestOptimization: async () => {
    try {
      const response = await axios.get(`${API_URL}/api/optimize/latest`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch latest optimization:", error);
      return { status: "none" };
    }
  },

  getBenchmarkReference: async () => {
    try {
      const response = await axios.get(`${API_URL}/api/dataset/benchmark`);
      return response.data;
    } catch {
      return {
        dataset: "A-n32-k5.vrp",
        type: "CVRP Validation Benchmark",
        locations: 32,
        vehicles: 5,
        capacity: 100,
        known_benchmark_optimum: 784,
        description: "Standard Augerat CVRP validation dataset used exclusively for algorithmic benchmarking."
      };
    }
  }
};
