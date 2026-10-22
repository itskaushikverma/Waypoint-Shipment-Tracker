import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { Link, useParams } from 'react-router-dom';
import {
  RiLoader4Line,
  RiErrorWarningLine,
  RiBox3Line,
  RiMapPinLine,
  RiCalendarLine,
} from '@remixicon/react';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import Logo from '../components/Logo';
import { Button } from '../components/ui/button';
import { useGetShipmentQuery } from '../redux/api';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function formatEta(eta) {
  if (eta === '0') return 'Delivered';
  const time = new Date(eta);
  return Number.isNaN(time.getTime()) ? 'Unavailable' : time.toLocaleString();
}

const ShipmentMap = () => {
  const { id } = useParams();
  const {
    data: shipment,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetShipmentQuery(id, {
    skip: !id,
  });

  if (isLoading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <RiLoader4Line className="text-primary h-16 w-16 animate-spin" />
        <p className="mt-4 text-lg font-semibold">Loading shipment data...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <RiErrorWarningLine className="text-destructive h-16 w-16" />
        <p className="text-destructive mt-4 text-lg font-semibold">
          {error?.data?.message || 'Request failed'}
        </p>
        <Button className="mt-4" onClick={() => refetch()}>
          Try Again
        </Button>
      </div>
    );
  }

  if (!shipment) return null;

  const mapCenter = shipment.currentLocation;
  const mapBounds = [shipment.route[0], shipment.route[1]];

  return (
    <div className="flex h-screen flex-col md:flex-row">
      <Card className="bg-background/95 m-4 w-full overflow-y-auto p-4 md:w-1/3">
        <CardHeader className="space-y-3">
          <Logo withWordmark size={36} />
          <CardTitle className="text-2xl font-bold">Shipment details</CardTitle>
          <Button variant="outline" size="sm" asChild>
            <Link to="/">Back to shipments</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center">
              <RiBox3Line className="mr-2" />
              <span className="font-semibold">Container ID: </span> {shipment.containerId}
            </div>
            <div className="flex items-center">
              <RiMapPinLine className="mr-2" />
              <span className="font-semibold">Current Location: </span>{' '}
              {`${shipment.currentLocation.lat}, ${shipment.currentLocation.lng}`}
            </div>
            <div className="flex items-center">
              <RiMapPinLine className="mr-2" />
              <span className="font-semibold">Starting Location: </span>{' '}
              {`${shipment.route[0].lat}, ${shipment.route[0].lng}`}
            </div>
            <div className="flex items-center">
              <RiMapPinLine className="mr-2" />
              <span className="font-semibold">Destination: </span>{' '}
              {`${shipment.route[1].lat}, ${shipment.route[1].lng}`}
            </div>
            <div className="flex items-center">
              <RiCalendarLine className="mr-2" />
              <span className="font-semibold">ETA:</span> {formatEta(shipment.eta)}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="m-4 flex-grow">
        <MapContainer
          center={mapCenter}
          zoom={5}
          style={{
            width: '100%',
            height: '100%',
          }}
          bounds={mapBounds}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          <Marker position={shipment.route[0]}>
            <Popup>Starting Point</Popup>
          </Marker>

          <Marker position={shipment.currentLocation}>
            <Popup>
              <p>Container ID: {shipment.containerId}</p>
              <p>ETA: {formatEta(shipment.eta)}</p>
            </Popup>
          </Marker>

          <Marker position={shipment.route[1]}>
            <Popup>Destination</Popup>
          </Marker>

          <Polyline positions={[shipment.currentLocation, shipment.route[1]]} color="blue" />
        </MapContainer>
      </div>
    </div>
  );
};

export default ShipmentMap;
