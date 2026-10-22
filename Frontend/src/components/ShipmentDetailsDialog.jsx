import { useForm } from 'react-hook-form';
import { useToast } from 'react-toast-kit-js';
import { useUpdateShipmentLocationMutation } from '../redux/api';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';

export default function ShipmentDetailsDialog({ open, shipment, onOpenChange }) {
  const [updateShipmentLocation] = useUpdateShipmentLocationMutation();
  const { error: showError } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: { lat: '', lng: '' },
  });

  const handleDialogChange = (nextOpen) => {
    onOpenChange(nextOpen);
    if (!nextOpen) reset();
  };

  const handleUpdateLocation = async ({ lat, lng }) => {
    if (!shipment) return;

    if (lat === shipment.currentLocation.lat && lng === shipment.currentLocation.lng) {
      handleDialogChange(false);
      return;
    }

    try {
      await updateShipmentLocation({
        id: shipment._id,
        currentLocation: { lat, lng },
      }).unwrap();
      handleDialogChange(false);
    } catch (requestError) {
      showError(requestError?.data?.message || 'Request failed');
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Shipment details</DialogTitle>
        </DialogHeader>
        {shipment && (
          <div className="space-y-6">
            <dl className="grid grid-cols-[9rem_1fr] gap-x-4 gap-y-3 text-sm">
              <dt className="text-muted-foreground">Container ID</dt>
              <dd className="font-medium">{shipment.containerId}</dd>
              <dt className="text-muted-foreground">Current location</dt>
              <dd className="font-medium">
                {shipment.currentLocation.lat}, {shipment.currentLocation.lng}
              </dd>
              <dt className="text-muted-foreground">Start</dt>
              <dd className="font-medium">
                {shipment.route[0].lat}, {shipment.route[0].lng}
              </dd>
              <dt className="text-muted-foreground">Destination</dt>
              <dd className="font-medium">
                {shipment.route[1].lat}, {shipment.route[1].lng}
              </dd>
              <dt className="text-muted-foreground">ETA</dt>
              <dd className="font-medium">
                {shipment.eta === '0' ? 'Delivered' : new Date(shipment.eta).toLocaleString()}
              </dd>
              <dt className="text-muted-foreground">Status</dt>
              <dd className="font-medium">{shipment.status}</dd>
            </dl>
            <form
              className="space-y-4 border-t pt-5"
              onSubmit={handleSubmit(handleUpdateLocation)}
              noValidate
            >
              <h3 className="text-sm font-semibold">Update location</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="lat">Latitude</Label>
                  <Input
                    id="lat"
                    placeholder="Latitude"
                    type="number"
                    step="any"
                    {...register('lat')}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="lng">Longitude</Label>
                  <Input
                    id="lng"
                    placeholder="Longitude"
                    type="number"
                    step="any"
                    {...register('lng')}
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Updating...' : 'Update location'}
              </Button>
            </form>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
