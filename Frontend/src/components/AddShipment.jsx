import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Input } from './ui/input';
import { Button } from './ui/button';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Label } from './ui/label';
import { useToast } from 'react-toast-kit-js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { useAddShipmentMutation } from '../redux/api';

export default function AddShipmentForm({ handleShipmentAdded }) {
  const [addShipment] = useAddShipmentMutation();
  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      containerId: '',
      startLat: '',
      startLng: '',
      endLat: '',
      endLng: '',
      status: 'Pending',
    },
  });
  const { error: showError } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await addShipment({
        containerId: data.containerId,
        startLocation: {
          lat: data.startLat,
          lng: data.startLng,
        },
        endLocation: {
          lat: data.endLat,
          lng: data.endLng,
        },
        status: data.status,
      }).unwrap();
      reset();
      handleShipmentAdded();
    } catch (error) {
      showError(error?.data?.message || 'Request failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="bg-background mx-auto w-full max-w-lg border shadow-sm">
      <CardHeader className="space-y-1 px-6 pt-6">
        <CardTitle className="text-lg font-semibold tracking-tight">Add shipment</CardTitle>
        <CardDescription>Enter a numeric container ID, the route, and the status.</CardDescription>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="containerId">Container ID</Label>
            <Input
              id="containerId"
              inputMode="numeric"
              autoComplete="off"
              placeholder="1234"
              {...register('containerId', {
                required: 'Container ID is required',
                pattern: { value: /^\d+$/, message: 'Container ID must be a number' },
              })}
              onChange={(event) => {
                setValue('containerId', event.target.value.replace(/\D/g, ''), {
                  shouldValidate: true,
                });
              }}
            />
            {errors.containerId && (
              <p className="text-destructive text-sm">{errors.containerId.message}</p>
            )}
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium">Starting location</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="startLat">Latitude</Label>
                <Input
                  id="startLat"
                  type="number"
                  step="any"
                  placeholder="Latitude"
                  {...register('startLat')}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="startLng">Longitude</Label>
                <Input
                  id="startLng"
                  type="number"
                  step="any"
                  placeholder="Longitude"
                  {...register('startLng')}
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium">Ending location</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="endLat">Latitude</Label>
                <Input
                  id="endLat"
                  type="number"
                  step="any"
                  placeholder="Latitude"
                  {...register('endLat')}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="endLng">Longitude</Label>
                <Input
                  id="endLng"
                  type="number"
                  step="any"
                  placeholder="Longitude"
                  {...register('endLng')}
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Status</Label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="In Transit">In Transit</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Adding shipment...' : 'Add shipment'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
