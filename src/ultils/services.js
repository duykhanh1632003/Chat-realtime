export const baseUrl = "http://localhost:5000/api";

export const postRequest = async (url, body) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // Sửa lỗi chính tả thành "application"
    },
    body: JSON.stringify(body), // Chuyển đổi body thành chuỗi JSON
  });

  const data = await response.json();

  if (response.errCode === 1) {
    let message;
    message = response.errMessage;
    return { error: true, message };
  }
  return data;
};
