import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Input from '../common/Input';
import Button from '../common/Button';
import { licenseService } from '../../services/licenseService';
import { eaService } from '../../services/eaService';
import { User, Mail, Calendar } from 'lucide-react';

const CreateLicenseForm = ({ onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [eas, setEas] = useState([]);
  const [formData, setFormData] = useState({
    userEmail: '',
    userName: '',
    eaId: '',
    expiresInDays: 365,
  });

  useEffect(() => {
    fetchEAs();
  }, []);

  const fetchEAs = async () => {
    try {
      const response = await eaService.getAllEAs();
      if (response.success) {
        setEas(response.eas);
      }
    } catch (error) {
      toast.error('Failed to load EAs');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await licenseService.createLicense(formData);
      if (response.success) {
        toast.success('License created successfully!');
        onSuccess(response.license);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create license');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="User Email"
        type="email"
        name="userEmail"
        value={formData.userEmail}
        onChange={handleChange}
        icon={Mail}
        placeholder="user@example.com"
        required
      />

      <Input
        label="User Name"
        type="text"
        name="userName"
        value={formData.userName}
        onChange={handleChange}
        icon={User}
        placeholder="John Doe"
        required
      />

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Expert Advisor
        </label>
        <select
          name="eaId"
          value={formData.eaId}
          onChange={handleChange}
          className="input-field"
          required
        >
          <option value="">Select an EA</option>
          {eas.map((ea) => (
            <option key={ea.id} value={ea.id}>
              {ea.name} - {ea.strategy_name}
            </option>
          ))}
        </select>
      </div>

      <Input
        label="License Duration (Days)"
        type="number"
        name="expiresInDays"
        value={formData.expiresInDays}
        onChange={handleChange}
        icon={Calendar}
        min="1"
        required
      />

      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          variant="primary"
          loading={loading}
          className="flex-1"
        >
          Create License
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default CreateLicenseForm;