import axios from 'axios';

export const fetchCountries = async () => {
  try {
    const response = await axios.get('https://api.sampleapis.com/countries/countries');
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
};
