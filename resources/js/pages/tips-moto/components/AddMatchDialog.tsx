import { useState } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { DatePicker } from './ui/date-picker';
import { Plus } from 'lucide-react';

interface AddMatchDialogProps {
  onAddMatch: (match: {
    league: string;
    homeTeam: string;
    awayTeam: string;
    date: string;
    time: string;
    status: string;
  }) => void;
}

export function AddMatchDialog({ onAddMatch }: AddMatchDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    league: 'Premier League',
    homeTeam: 'Arsenal',
    awayTeam: 'Manchester U',
    date: '',
    time: '',
    status: 'pending'
  });
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDateChange = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      // Update the form data with the selected date in ISO format for form processing
      const isoDate = date.toISOString().split('T')[0];
      setFormData(prev => ({
        ...prev,
        date: isoDate
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        date: ''
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.league || !formData.homeTeam || !formData.awayTeam || !selectedDate || !formData.time) {
      alert('Please fill in all required fields');
      return;
    }

    // Format the date to match existing format (e.g., "Jul 07 2025")
    const formattedDate = selectedDate.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    });

    // Format the time to match existing format (e.g., "12:00 pm")
    const [hours, minutes] = formData.time.split(':');
    const timeObj = new Date();
    timeObj.setHours(parseInt(hours), parseInt(minutes));
    const formattedTime = timeObj.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    // Add the match
    onAddMatch({
      ...formData,
      date: formattedDate,
      time: formattedTime
    });

    // Reset form and close dialog
    setFormData({
      league: '',
      homeTeam: '',
      awayTeam: '',
      date: '',
      time: '',
      status: 'pending'
    });
    setSelectedDate(undefined);
    setOpen(false);
  };

  const handleCancel = () => {
    // Reset form and close dialog
    setFormData({
      league: '',
      homeTeam: '',
      awayTeam: '',
      date: '',
      time: '',
      status: 'pending'
    });
    setSelectedDate(undefined);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gray-600 hover:bg-gray-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add Match
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Match</DialogTitle>
          <DialogDescription>
            Fill in the details below to add a new match to the system.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {/* League */}
            <div className="space-y-2">
              <Label htmlFor="league">League *</Label>
              <Input
                id="league"
                value={formData.league}
                onChange={(e) => handleInputChange('league', e.target.value)}
                placeholder="e.g., Finland, Kolmonen"
                required
              />
            </div>

            {/* Teams */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="homeTeam">Home Team *</Label>
                <Input
                  id="homeTeam"
                  value={formData.homeTeam}
                  onChange={(e) => handleInputChange('homeTeam', e.target.value)}
                  placeholder="Home team name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="awayTeam">Away Team *</Label>
                <Input
                  id="awayTeam"
                  value={formData.awayTeam}
                  onChange={(e) => handleInputChange('awayTeam', e.target.value)}
                  placeholder="Away team name"
                  required
                />
              </div>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Match Date *</Label>
                <DatePicker
                  date={selectedDate}
                  onDateChange={handleDateChange}
                  placeholder="Select match date"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Match Time *</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => handleInputChange('time', e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scheduled">scheduled</SelectItem>
                  <SelectItem value="live">live</SelectItem>
                  <SelectItem value="finished">finished</SelectItem>
                  <SelectItem value="postponed">postponed</SelectItem>
                  <SelectItem value="canceled">canceled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleCancel} className="border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800">
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
              Add Match
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
