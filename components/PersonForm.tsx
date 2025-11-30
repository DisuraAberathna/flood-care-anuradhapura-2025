'use client';

import { useState, FormEvent } from 'react';
import { toast } from 'react-toastify';
import { FaUser, FaCalendarAlt, FaUsers, FaMapMarkerAlt, FaHome, FaSave, FaTimes, FaEdit } from 'react-icons/fa';

interface Person {
  id?: number;
  name: string;
  age: number;
  number_of_members: number;
  address: string;
  house_state: string;
}

interface PersonFormProps {
  person?: Person;
  onSubmit: (person: Omit<Person, 'id'>) => Promise<void>;
  onCancel?: () => void;
}

export default function PersonForm({ person, onSubmit, onCancel }: PersonFormProps) {
  const [formData, setFormData] = useState<Omit<Person, 'id'>>({
    name: person?.name || '',
    age: person?.age || 0,
    number_of_members: person?.number_of_members || 0,
    address: person?.address || '',
    house_state: person?.house_state || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    // Validate name
    if (!formData.name || formData.name.trim().length === 0) {
      toast.error('Name is required');
      return false;
    }
    if (formData.name.trim().length < 2) {
      toast.error('Name must be at least 2 characters');
      return false;
    }
    if (formData.name.trim().length > 100) {
      toast.error('Name must be less than 100 characters');
      return false;
    }

    // Validate age
    if (!formData.age || formData.age < 1) {
      toast.error('Age must be at least 1');
      return false;
    }
    if (formData.age > 150) {
      toast.error('Age must be less than 150');
      return false;
    }

    // Validate number of members
    if (!formData.number_of_members || formData.number_of_members < 1) {
      toast.error('Number of members must be at least 1');
      return false;
    }
    if (formData.number_of_members > 50) {
      toast.error('Number of members cannot exceed 50');
      return false;
    }

    // Validate address
    if (!formData.address || formData.address.trim().length === 0) {
      toast.error('Address is required');
      return false;
    }
    if (formData.address.trim().length < 10) {
      toast.error('Address must be at least 10 characters');
      return false;
    }
    if (formData.address.trim().length > 500) {
      toast.error('Address must be less than 500 characters');
      return false;
    }

    // Validate house state
    if (!formData.house_state || formData.house_state.trim().length === 0) {
      toast.error('House state is required');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      toast.success(person ? 'Person updated successfully!' : 'Person added successfully!');
      if (!person) {
        setFormData({
          name: '',
          age: 0,
          number_of_members: 0,
          address: '',
          house_state: '',
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to save person. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="person-form">
      <div className="form-group">
        <label htmlFor="name">
          <FaUser className="label-icon" /> Name *
        </label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          placeholder="Enter full name"
        />
      </div>

      <div className="form-group">
        <label htmlFor="age">
          <FaCalendarAlt className="label-icon" /> Age *
        </label>
        <input
          type="number"
          id="age"
          value={formData.age || ''}
          onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 0 })}
          required
          min="0"
          placeholder="Enter age"
        />
      </div>

      <div className="form-group">
        <label htmlFor="number_of_members">
          <FaUsers className="label-icon" /> Number of Members *
        </label>
        <input
          type="number"
          id="number_of_members"
          value={formData.number_of_members || ''}
          onChange={(e) => setFormData({ ...formData, number_of_members: parseInt(e.target.value) || 0 })}
          required
          min="1"
          placeholder="Enter number of family members"
        />
      </div>

      <div className="form-group">
        <label htmlFor="address">
          <FaMapMarkerAlt className="label-icon" /> Address *
        </label>
        <textarea
          id="address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          required
          rows={3}
          placeholder="Enter full address"
        />
      </div>

      <div className="form-group">
        <label htmlFor="house_state">
          <FaHome className="label-icon" /> House State *
        </label>
        <select
          id="house_state"
          value={formData.house_state}
          onChange={(e) => setFormData({ ...formData, house_state: e.target.value })}
          required
        >
          <option value="">Select house state</option>
          <option value="Safe">Safe</option>
          <option value="Partially Damaged">Partially Damaged</option>
          <option value="Severely Damaged">Severely Damaged</option>
          <option value="Destroyed">Destroyed</option>
        </select>
      </div>

      <div className="form-actions">
        <button type="submit" disabled={isSubmitting} className="btn btn-primary">
          {isSubmitting ? (
            <>Saving...</>
          ) : person ? (
            <>
              <FaEdit /> Update
            </>
          ) : (
            <>
              <FaSave /> Add Person
            </>
          )}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn btn-secondary">
            <FaTimes /> Cancel
          </button>
        )}
      </div>
    </form>
  );
}

