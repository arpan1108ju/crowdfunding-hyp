'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCampaignService } from '@/hooks/use-campaign-service';
import { campaignTypes } from '@/lib/data/dummy-data';



export default function CreateCampaignPage() {
  const router = useRouter();
  const { createCampaign } = useCampaignService();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    campaignType: '',
    customType: '',
    target: '',
    deadline: '',
    image: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (value) => {
    setFormData(prev => ({
      ...prev,
      campaignType: value,
      customType: '' // reset customType when changing campaignType
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const deadlineDate = new Date(formData.deadline);
      const deadlineMs = deadlineDate.getTime();

      const campaignData = {
        title: formData.title,
        description: formData.description,
        campaignType: formData.campaignType === 'Other' ? formData.customType : formData.campaignType,
        target: Number(formData.target),
        deadline: deadlineMs,
        image: formData.image
      };
      console.log(campaignData);
      const response = await createCampaign(campaignData);

      if (!response.success) {
        throw new Error(response.message);
      }

      toast.success('Campaign created successfully');
      router.push('/campaign');
    } catch (error) {
      toast.error('Failed to create campaign', {
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-2xl mx-auto py-8">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Create New Campaign</h1>
          <p className="text-muted-foreground mt-2">
            Fill in the details below to create your campaign
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="title" className="text-base font-semibold">Campaign Title</label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter campaign title"
              required
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-base font-semibold">Description</label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your campaign"
              required
              className="min-h-[150px] text-base"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="campaignType" className="text-base font-semibold">Campaign Type</label>
            <Select value={formData.campaignType} onValueChange={handleSelectChange} required>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select campaign type" />
              </SelectTrigger>
              <SelectContent>
                {campaignTypes.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {formData.campaignType === 'Other' && (
              <Input
                id="customType"
                name="customType"
                value={formData.customType}
                onChange={handleChange}
                placeholder="Specify campaign type"
                required
                className="h-11 mt-2"
              />
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="target" className="text-base font-semibold">Target Amount</label>
            <Input
              id="target"
              name="target"
              type="number"
              value={formData.target}
              onChange={handleChange}
              placeholder="Enter target amount"
              min="0"
              step="0.01"
              required
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="deadline" className="text-base font-semibold">Campaign Deadline</label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Input
                  id="deadline-date"
                  name="deadline-date"
                  type="date"
                  value={formData.deadline.split('T')[0]}
                  onChange={(e) => {
                    const time = formData.deadline.split('T')[1] || '00:00';
                    setFormData(prev => ({
                      ...prev,
                      deadline: `${e.target.value}T${time}`
                    }));
                  }}
                  required
                  className="h-11"
                />
              </div>
              <div>
                <Input
                  id="deadline-time"
                  name="deadline-time"
                  type="time"
                  value={formData.deadline.split('T')[1] || '00:00'}
                  onChange={(e) => {
                    const date = formData.deadline.split('T')[0];
                    setFormData(prev => ({
                      ...prev,
                      deadline: `${date}T${e.target.value}`
                    }));
                  }}
                  required
                  className="h-11"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="image" className="text-base font-semibold">Campaign Image URL</label>
            <Input
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="Enter image URL"
              required
              className="h-11"
            />
          </div>

          <Button
            type="submit"
            className="w-full h-11 text-base"
            disabled={isLoading}
          >
            {isLoading ? 'Creating...' : 'Create Campaign'}
          </Button>
        </form>
      </div>
    </div>
  );
}
