import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { JobApplication } from '../App';

interface AddJobFormProps {
  onAdd: (job: Omit<JobApplication, 'id'>) => void;
}

export function AddJobForm({ onAdd }: AddJobFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    role: '',
    dateApplied: new Date().toISOString().split('T')[0],
    status: 'applied' as JobApplication['status']
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title && formData.company && formData.role && formData.dateApplied) {
      onAdd(formData);
      setFormData({
        title: '',
        company: '',
        role: '',
        dateApplied: new Date().toISOString().split('T')[0],
        status: 'applied'
      });
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Job Title</Label>
        <Input
          id="title"
          placeholder="e.g. Senior Frontend Developer"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="company">Company</Label>
        <Input
          id="company"
          placeholder="e.g. TechCorp Inc."
          value={formData.company}
          onChange={(e) => handleChange('company', e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Role/Department</Label>
        <Input
          id="role"
          placeholder="e.g. Frontend Development"
          value={formData.role}
          onChange={(e) => handleChange('role', e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="dateApplied">Date Applied</Label>
        <Input
          id="dateApplied"
          type="date"
          value={formData.dateApplied}
          onChange={(e) => handleChange('dateApplied', e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Initial Status</Label>
        <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="applied">Applied</SelectItem>
            <SelectItem value="interview">Interview</SelectItem>
            <SelectItem value="accepted">Accepted</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0"
      >
        Add Job Application
      </Button>
    </form>
  );
}