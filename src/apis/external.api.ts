import axios from "axios";

const classificationUrl = import.meta.env.VITE_CLASSIFICATION_URL;
console.log(classificationUrl);
export const classifyMessage = async function (message: string) {
  const response = await axios.post(classificationUrl, {
    text: message,
  });

  return response.data.predicted_label;
};
