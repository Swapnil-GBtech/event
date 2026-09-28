 

// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:4000/api/v1",
//   withCredentials: true,
// });

// const getAccessToken = () => localStorage.getItem("accessToken");

// api.interceptors.request.use(
//   (config) => {
//     const token = getAccessToken();
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (
//       error.response?.status === 401 &&
//       !originalRequest._retry &&
//       !originalRequest.url.includes("/login") &&
//       !originalRequest.url.includes("/logout") &&
//       !originalRequest.url.includes("/refresh-token")
//     ) {
//       originalRequest._retry = true;

//       try {
//         const res = await axios.get(
//           "http://localhost:4000/api/v1/user/refresh-token",
//           { withCredentials: true }
//         );

//         const newAccessToken = res.data?.data?.accessToken;

//         if (newAccessToken) {
//           localStorage.setItem("accessToken", newAccessToken);
//           originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
//           return api(originalRequest);
//         }

//         throw new Error("No access token returned");
//       } catch (refreshErr) {
//         // ✅ Token refresh failed — log user out
//         console.warn("🔁 Token refresh failed, logging out");

//         localStorage.clear();

//         if (
//           typeof window !== "undefined" &&
//           !window.location.pathname.includes("/login")
//         ) {
//           window.location.href = "/login";
//         }

//         return Promise.reject(refreshErr);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default api;





import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api/v1",
  withCredentials: true,
});

const getAccessToken = () => localStorage.getItem("accessToken");

api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // ✅ If no access token exists, don't try refreshing
    const currentToken = getAccessToken();
    if (!currentToken) {
      return Promise.reject(error);
    }

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/login") &&
      !originalRequest.url.includes("/logout") &&
      !originalRequest.url.includes("/refresh-token")
    ) {
      originalRequest._retry = true;

      try {
        //  Only refresh if user is authenticated
        const res = await axios.get(
          "http://localhost:4000/api/v1/user/refresh-token",
          { withCredentials: true }
        );

        const newAccessToken = res.data?.data?.accessToken;

        if (newAccessToken) {
          localStorage.setItem("accessToken", newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest); // Retry original request
        }

        throw new Error("No access token returned");
      } catch (refreshErr) {
        console.warn("🔁 Token refresh failed, logging out");

        localStorage.clear();
        if (
          typeof window !== "undefined" &&
          !window.location.pathname.includes("/login")
        ) {
          window.location.href = "/login";
        }

        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

