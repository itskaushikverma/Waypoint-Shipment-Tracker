import axios from 'axios';

const URL = process.env.CHECK_DISPOSABLE_EMAIL_URL;

export const isDisposableEmail = async (email) => {
  if (!URL) return false;
  try {
    const { data } = await axios.get(`${URL}?email=${encodeURIComponent(email)}`);
    return data.disposable === 'true';
  } catch {
    return false;
  }
};
