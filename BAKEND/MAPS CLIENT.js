const fetch = require('node-fetch');

async function findProfessionals(city) {
  try {
    if (!process.env.GOOGLE_MAPS_KEY) {
      return [];
    }

    const query = `profissionais de saúde em ${city}`;
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
      query
    )}&key=${process.env.GOOGLE_MAPS_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data.results) return [];

    return data.results.slice(0, 3).map((place) => ({
      name: place.name,
      address: place.formatted_address,
      rating: place.rating || 'N/A',
    }));
  } catch (error) {
    console.error(error);
    return [];
  }
}

module.exports = { findProfessionals };
