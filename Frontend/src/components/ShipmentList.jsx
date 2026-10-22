import { useMemo, useState } from 'react';
import { useGetShipmentsQuery } from '../redux/api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import { RiArrowUpDownLine, RiMapPinLine, RiInformationLine } from '@remixicon/react';
import ShipmentDetailsDialog from './ShipmentDetailsDialog';

function compareShipments(a, b, column) {
  if (column === 'currentLocation') {
    const latDiff = (a.currentLocation?.lat ?? 0) - (b.currentLocation?.lat ?? 0);
    if (latDiff !== 0) return latDiff;
    return (a.currentLocation?.lng ?? 0) - (b.currentLocation?.lng ?? 0);
  }
  if (column === 'eta') {
    const aTime = a.eta === '0' ? 0 : Date.parse(a.eta) || 0;
    const bTime = b.eta === '0' ? 0 : Date.parse(b.eta) || 0;
    return aTime - bTime;
  }
  return String(a[column] ?? '').localeCompare(String(b[column] ?? ''), undefined, {
    numeric: true,
  });
}

export default function ShipmentList() {
  const navigate = useNavigate();

  const {
    data: shipments = [],
    isLoading,
    isError,
    error: shipmentsError,
  } = useGetShipmentsQuery(undefined);

  const [sortColumn, setSortColumn] = useState('containerId');
  const [sortDirection, setSortDirection] = useState('asc');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalShipment, setModalShipment] = useState(null);

  const visibleShipments = useMemo(() => {
    return [...shipments].sort((a, b) => {
      const result = compareShipments(a, b, sortColumn);
      return sortDirection === 'asc' ? result : -result;
    });
  }, [shipments, sortColumn, sortDirection]);

  if (isLoading) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center py-16">
        <p className="text-xl font-semibold">Loading shipments...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center py-16">
        <p className="text-destructive text-xl font-semibold">
          {shipmentsError?.data?.message || 'Request failed'}
        </p>
      </div>
    );
  }

  const handleSort = (column) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const handleOpenModal = (shipment) => {
    setModalShipment(shipment);
    setIsModalOpen(true);
  };

  const handleDialogChange = (open) => {
    setIsModalOpen(open);
    if (!open) setModalShipment(null);
  };

  const headClass =
    'bg-background sticky top-0 z-10 h-11 border-b px-4 text-left text-xs font-medium tracking-wide text-muted-foreground uppercase';
  const cellClass = 'px-4 py-3 text-sm text-foreground';

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden">
      <div className="flex shrink-0 items-baseline justify-between gap-3">
        <h2 className="text-lg font-semibold tracking-tight">Shipments</h2>
        <p className="text-muted-foreground text-sm">
          {visibleShipments.length} {visibleShipments.length === 1 ? 'shipment' : 'shipments'}
        </p>
      </div>
      <div className="bg-background flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border shadow-sm">
        <Table
          className="border-separate border-spacing-0"
          containerClassName="min-h-0 flex-1 overflow-auto"
        >
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className={headClass}>
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5"
                  onClick={() => handleSort('containerId')}
                >
                  Container ID
                  <RiArrowUpDownLine className="size-3.5" />
                </button>
              </TableHead>
              <TableHead className={headClass}>
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5"
                  onClick={() => handleSort('currentLocation')}
                >
                  Current location
                  <RiArrowUpDownLine className="size-3.5" />
                </button>
              </TableHead>
              <TableHead className={headClass}>
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5"
                  onClick={() => handleSort('eta')}
                >
                  ETA
                  <RiArrowUpDownLine className="size-3.5" />
                </button>
              </TableHead>
              <TableHead className={headClass}>
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5"
                  onClick={() => handleSort('status')}
                >
                  Status
                  <RiArrowUpDownLine className="size-3.5" />
                </button>
              </TableHead>
              <TableHead className={`${headClass} text-right`}>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleShipments.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-muted-foreground px-4 py-10 text-center text-sm"
                >
                  No shipments yet.
                </TableCell>
              </TableRow>
            )}
            {visibleShipments.map((shipment) => (
              <TableRow key={shipment._id}>
                <TableCell className={`${cellClass} font-medium`}>{shipment.containerId}</TableCell>
                <TableCell
                  className={cellClass}
                >{`${shipment.currentLocation.lat}, ${shipment.currentLocation.lng}`}</TableCell>
                <TableCell className={cellClass}>
                  {shipment.eta === '0' ? 'Delivered' : new Date(shipment.eta).toLocaleString()}
                </TableCell>
                <TableCell className={cellClass}>
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${shipment.status === 'In Transit' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}
                  >
                    {shipment.status}
                  </span>
                </TableCell>
                <TableCell className={`${cellClass} text-right`}>
                  <div className="inline-flex items-center justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(`/map/${shipment._id}`);
                      }}
                    >
                      <RiMapPinLine className="size-4" />
                      Map
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleOpenModal(shipment)}>
                      <RiInformationLine className="size-4" />
                      Details
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ShipmentDetailsDialog
        open={isModalOpen}
        shipment={modalShipment}
        onOpenChange={handleDialogChange}
      />
    </div>
  );
}
