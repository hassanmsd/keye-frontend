import axios from "axios";

// for locat testing
// const API_URL = "http://localhost:5000";

// for prod
const API_URL = "https://keye-backend-bbns.vercel.app";

const fetchGrowthData = async (): Promise<FetchGrowthDataResponse> => {
  try {
    const response = await axios.get(`${API_URL}/growth`);
    return response.data;
  } catch (error: any) {
    // Handle errors while fetching growth data
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || "Error saving lead data");
    } else {
      throw new Error("Network or unexpected error occurred");
    }
  }
};

export { fetchGrowthData };

interface FetchGrowthDataResponse {
  Values: {
    items: {
      product: string;
      [year: string]: string | number;
    }[];
  };
}
