import axios from 'axios';

const MOBSF_API_URL = 'http://localhost:8000';
const MOBSF_API_KEY = 'e3e0d83f87b3ac5c517701a3b26207b4c47bc92c83f3c590384ed2ba715e2ad6';

const mobsfApi = axios.create({
  baseURL: MOBSF_API_URL,
  headers: {
    'Authorization': MOBSF_API_KEY,
    'Content-Type': 'application/json',
  },
});

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await mobsfApi.post('/api/v1/upload', formData);
  return response.data;
};

export const scanFile = async (hash) => {
  const response = await mobsfApi.post('/api/v1/scan', { hash });
  return response.data;
};

export const getScorecard = async (hash) => {
  const response = await mobsfApi.post('/api/v1/scorecard', { hash });
  return response.data;
};

export const generatePdfReport = async (hash) => {
  const response = await mobsfApi.post('/api/v1/download_pdf', { hash }, { responseType: 'blob' });
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const a = document.createElement('a');
  a.href = url;
  a.download = 'report.pdf';
  a.click();
};

export const generateJsonReport = async (hash) => {
  try {
    const response = await mobsfApi.post('/api/v1/report_json', { hash });
    return response.data;
  } catch (error) {
    console.error('Error fetching JSON report:', error.response || error.message);
    throw error;
  }
};
