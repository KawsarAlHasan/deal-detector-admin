import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const API = axios.create({
  baseURL: "https://deal.dsrt321.online",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// get admin dashboard
export const useAdminDashboard = () => {
  const getData = async () => {
    const response = await API.get("/api/auth/user/");
    return response.data;
  };

  const {
    data: adminDashboard = null,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["adminDashboard"],
    queryFn: getData,
  });

  return { adminDashboard, isLoading, isError, error, refetch };
};

// sign out
export const signOutAdmin = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};

// get admin dashboard
export const useDashboardOverview = () => {
  const getData = async () => {
    const response = await API.get("/api/shop/dashboard/");
    return response.data;
  };

  const {
    data: dashboardOverview = null,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["dashboardOverview"],
    queryFn: getData,
  });

  return { dashboardOverview, isLoading, isError, error, refetch };
};

// Users list
export const useAllUser = ({ page = 1, limit = 10 }) => {
  const getData = async () => {
    const response = await API.get(
      `/api/auth/user/list/?page=${page}&limit=${limit}`
    );

    return response.data;
  };

  const {
    data: allUsers = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["allUsers", page, limit],
    queryFn: getData,
  });

  return { allUsers, isLoading, isError, error, refetch };
};

// categories list
export const useAllCategories = ({ page = 1, limit = 10 }) => {
  const getData = async () => {
    const response = await API.get(
      `/api/shop/categories/?page=${page}&limit=${limit}`
    );

    return response.data;
  };

  const {
    data: allCategories = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["allCategories", page, limit],
    queryFn: getData,
  });

  return { allCategories, isLoading, isError, error, refetch };
};

// promo codes list
export const useAllPromoCodes = ({ page = 1, limit = 10 }) => {
  const getData = async () => {
    const response = await API.get(
      `/api/auth/promo-code/?page=${page}&limit=${limit}`
    );

    return response.data;
  };

  const {
    data: allPromoCodes = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["allPromoCodes", page, limit],
    queryFn: getData,
  });

  return { allPromoCodes, isLoading, isError, error, refetch };
};

// promo codes list
export const useAllProducts = ({ page = 1, limit = 10 }) => {
  const getData = async () => {
    const response = await API.get(
      `/api/shop/products/list/?page=${page}&limit=${limit}`
    );

    return response.data;
  };

  const {
    data: allProducts = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["allProducts", page, limit],
    queryFn: getData,
  });

  return { allProducts, isLoading, isError, error, refetch };
};

// promo codes list
export const useAllSupershops = ({ page = 1, limit = 10 }) => {
  const getData = async () => {
    const response = await API.get(
      `/api/shop/supershops/?page=${page}&limit=${limit}`
    );

    return response.data;
  };

  const {
    data: allSupershops = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["allSupershops", page, limit],
    queryFn: getData,
  });

  return { allSupershops, isLoading, isError, error, refetch };
};

// not used
// not used
// not used
// not used
// not used
// not used
// not used
// not used
// not used
// not used
// not used
// not used

// Admin list
export const useAdminList = ({ page = 1, limit = 10 }) => {
  const getData = async () => {
    const response = await API.get(
      `/admin-dashboard/admin_list/?page=${page}&limit=${limit}`
    );

    return response.data;
  };

  const {
    data: adminList = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["adminList", page, limit],
    queryFn: getData,
  });

  return { adminList, isLoading, isError, error, refetch };
};

// payments list
export const usePayouts = ({ page = 1, limit = 10 }) => {
  const getData = async () => {
    const response = await API.get(
      `/admin-dashboard/payment-history/?page=${page}&limit=${limit}`
    );

    return response.data;
  };

  const {
    data: payouts = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["payouts", page, limit],
    queryFn: getData,
  });

  return { payouts, isLoading, isError, error, refetch };
};

// user chat
export const useUserChat = ({ userID }, options = {}) => {
  const getData = async ({ queryKey }) => {
    const [_key, userID] = queryKey;
    const response = await API.get(
      `/admin-dashboard/user-chathistory/${userID}/`
    );
    return response.data;
  };

  const {
    data: chatList = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["chatList", userID],
    queryFn: getData,
    enabled: !!userID && (options.enabled ?? true),
  });

  return { chatList, isLoading, isError, error, refetch };
};

// user scan history
export const useUserScanHistory = ({ userID }, options = {}) => {
  const getData = async ({ queryKey }) => {
    const [_key, userID] = queryKey;
    const response = await API.get(
      `/admin-dashboard/user-scan-history/${userID}/`
    );
    return response.data;
  };

  const {
    data: scanHistory = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["scanHistory", userID],
    queryFn: getData,
    enabled: !!userID && (options.enabled ?? true),
  });

  return { scanHistory, isLoading, isError, error, refetch };
};

// user saved recipes
export const useUserSavedRecipes = ({ userID }, options = {}) => {
  const getData = async ({ queryKey }) => {
    const [_key, userID] = queryKey;
    const response = await API.get(
      `/admin-dashboard/user-saved-recipes/${userID}/`
    );
    return response.data;
  };

  const {
    data: savedRecipes = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["savedRecipes", userID],
    queryFn: getData,
    enabled: !!userID && (options.enabled ?? true),
  });

  return { savedRecipes, isLoading, isError, error, refetch };
};
