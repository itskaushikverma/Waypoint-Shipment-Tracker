import { useState } from 'react';
import { useDispatch } from 'react-redux';
import ShipmentList from '../components/ShipmentList.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import AddShipmentForm from '../components/AddShipment.jsx';
import { Button } from '../components/ui/button';
import Logo from '../components/Logo';
import { useLogoutMutation } from '../redux/api';
import { useToast } from 'react-toast-kit-js';
import { setUnauthenticated } from '../redux/authSlice';

export default function Home() {
  const [activeTab, setActiveTab] = useState('table');
  const dispatch = useDispatch();
  const [logoutRequest, { isLoading }] = useLogoutMutation();
  const { success, error } = useToast();

  const handleShipmentAdded = () => {
    setActiveTab('table');
  };

  const handleLogout = async () => {
    try {
      await logoutRequest().unwrap();
      success('Logged out successfully.');
      dispatch(setUnauthenticated());
    } catch (err) {
      error(err?.data?.message);
    }
  };

  return (
    <div className="mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6 flex shrink-0 items-center justify-between gap-4">
        <Logo withWordmark size={40} />
        <Button variant="outline" onClick={handleLogout} disabled={isLoading}>
          {isLoading ? 'Logging out...' : 'Log out'}
        </Button>
      </div>
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden"
      >
        <TabsList className="h-9 shrink-0">
          <TabsTrigger value="table" className="px-3">
            Shipments
          </TabsTrigger>
          <TabsTrigger value="add" className="px-3">
            Add shipment
          </TabsTrigger>
        </TabsList>
        <TabsContent value="table" className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <ShipmentList />
        </TabsContent>
        <TabsContent
          value="add"
          className="flex min-h-0 flex-1 items-center justify-center overflow-auto"
        >
          <AddShipmentForm handleShipmentAdded={handleShipmentAdded} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
