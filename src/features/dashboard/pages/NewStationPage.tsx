/**
 * @file NewStationPage.tsx
 * @description Admin page to create a new station
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useCreateStation } from '@/hooks/api/useStations';
import { ArrowLeft, Loader2 } from 'lucide-react';

export default function NewStationPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const createStationMutation = useCreateStation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    createStationMutation.mutate({
      name,
      address,
      city: '', // Add default values
      state: '',
      zipCode: ''
    }, {
      onSuccess: () => {
        navigate('/dashboard/stations');
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate('/dashboard/stations')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Stations
        </Button>
        <h1 className="text-2xl font-bold">Create New Station</h1>
      </div>

      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Station Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter station name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter station address"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter station phone number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter station email address"
              />
            </div>

            <Button type="submit" className="w-full" disabled={createStationMutation.isPending}>
              {createStationMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Station...
                </>
              ) : (
                'Create Station'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
