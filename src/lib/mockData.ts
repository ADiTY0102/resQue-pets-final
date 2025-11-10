export interface Pet {
  id: string;
  name: string;
  type: 'dog' | 'cat' | 'other';
  breed: string;
  age: number;
  description: string;
  imageUrl: string;
  status: 'available' | 'adopted' | 'pending';
}

export interface DonationCampaign {
  id: string;
  title: string;
  description: string;
  target: number;
  raised: number;
  startDate: string;
  endDate: string;
}

export const mockPets: Pet[] = [
  {
    id: '1',
    name: 'Max',
    type: 'dog',
    breed: 'Golden Retriever',
    age: 2,
    description: 'Friendly and energetic Golden Retriever looking for a loving home.',
    imageUrl: 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24',
    status: 'available'
  },
  {
    id: '2',
    name: 'Luna',
    type: 'cat',
    breed: 'Persian',
    age: 1,
    description: 'Beautiful Persian cat that loves to cuddle.',
    imageUrl: 'https://images.unsplash.com/photo-1618826411640-d6df44dd3f7a',
    status: 'available'
  }
];

export const mockDonationCampaigns: DonationCampaign[] = [
  {
    id: '1',
    title: 'Winter Shelter Fund',
    description: 'Help us provide warm shelter for street animals this winter.',
    target: 5000,
    raised: 2500,
    startDate: '2025-11-01',
    endDate: '2025-12-31'
  },
  {
    id: '2',
    title: 'Medical Emergency Fund',
    description: 'Support our emergency medical care for injured strays.',
    target: 10000,
    raised: 4000,
    startDate: '2025-10-15',
    endDate: '2025-12-15'
  }
];

// Mock API functions
export const mockApi = {
  getPets: () => Promise.resolve(mockPets),
  getPetById: (id: string) => Promise.resolve(mockPets.find(pet => pet.id === id)),
  getCampaigns: () => Promise.resolve(mockDonationCampaigns),
  getCampaignById: (id: string) => Promise.resolve(mockDonationCampaigns.find(campaign => campaign.id === id)),
  adoptPet: (petId: string, userId: string) => Promise.resolve({ success: true }),
  donatePet: (petData: Omit<Pet, 'id' | 'status'>) => Promise.resolve({ success: true }),
  donate: (campaignId: string, amount: number) => Promise.resolve({ success: true })
};