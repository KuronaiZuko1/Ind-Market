import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import Input from '../common/Input';
import Button from '../common/Button';
import { eaService } from '../../services/eaService';
import { TrendingUp, FileText, DollarSign, Hash } from 'lucide-react';

const CreateEAForm = ({ onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    strategyName: '',
    description: '',
    imageUrl: '',
    version: '1.0.0',
    price: '',
    configSchema: '{}',
  });

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
      const response = await eaService.createEA({
        ...formData,
        configSchema: JSON.parse(formData.configSchema),
      });

      if (response.success) {
        toast.success('EA created successfully!');
        onSuccess(response.ea);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create EA');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="EA Name"
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        icon={TrendingUp}
        placeholder="Trend Master Pro"
        required
      />

      <Input
        label="Strategy Name"
        type="text"
        name="strategyName"
        value={formData.strategyName}
        onChange={handleChange}
        icon={TrendingUp}
        placeholder="Moving Average Crossover"
        required
      />

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="input-field"
          rows="4"
          placeholder="Describe your EA strategy..."
          required
        />
      </div>

      <Input
        label="Image URL"
        type="url"
        name="imageUrl"
        value={formData.imageUrl}
        onChange={handleChange}
        placeholder="https://example.com/image.jpg"
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Version"
          type="text"
          name="version"
          value={formData.version}
          onChange={handleChange}
          icon={Hash}
          placeholder="1.0.0"
          required
        />

        <Input
          label="Price (USD)"
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          icon={DollarSign}
          placeholder="99"
          min="0"
          step="0.01"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Configuration Schema (JSON)
        </label>
        <textarea
          name="configSchema"
          value={formData.configSchema}
          onChange={handleChange}
          className="input-field font-mono text-sm"
          rows="6"
          placeholder='{"lotSize": 0.01, "stopLoss": 50}'
        />
        <p className="mt-1 text-xs text-gray-500">
          Default configuration for this EA in JSON format
        </p>
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          variant="primary"
          loading={loading}
          className="flex-1"
        >
          Create EA
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

export default CreateEAForm;