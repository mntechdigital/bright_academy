import { cookies } from "next/headers";

export const getAccessToken = async () => {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      }
    );

    const result = await response.json();

    if (result.statusCode === 200) {
      const accessToken = result.data.accessToken;

      cookieStore.set("accessToken", accessToken);
    }

    return result;
  } catch (error) {
    console.error(error);
    throw new Error("An error occurred while refreshing the token");
  }
};
