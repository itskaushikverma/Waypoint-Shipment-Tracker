export default async function calculateETA(route, currentLocation) {
  try {
    if (!route || route.length < 2) {
      throw new Error('Invalid route data');
    }
    const destination = route[0];

    if (destination.lat === currentLocation.lat && destination.lng === currentLocation.lng) {
      return '0';
    }

    const distance = Math.sqrt(
      Math.pow(destination.lat - currentLocation.lat, 2) +
        Math.pow(destination.lng - currentLocation.lng, 2),
    );

    if (isNaN(distance)) {
      throw new Error('Invalid distance calculation');
    }

    const avgSpeed = 50;
    const etaHours = distance / avgSpeed;
    return new Date(Date.now() + etaHours * 3600000).toISOString();
  } catch (error) {
    console.error('Error in calculateETA:', error);
    throw error;
  }
}
