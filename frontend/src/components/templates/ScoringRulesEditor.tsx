import React, { useState } from 'react';
import { ScoringRule, ScoreRange, scoringApi } from '../../api/scoringApi';

interface ScoringRulesEditorProps {
  templateId: string;
  initialRules?: {
    method: string;
    rules: ScoringRule[];
    ranges: ScoreRange[];
    customLogic?: string;
  };
  onSave: () => void;
  onCancel: () => void;
}

const scoringMethods = [
  { value: 'weighted_sum', label: 'Weighted Sum' },
  { value: 'average', label: 'Average' },
  { value: 'custom', label: 'Custom Logic' },
];

const fieldScoringMethods = [
  { value: 'numeric', label: 'Numeric' },
  { value: 'scale', label: 'Scale' },
  { value: 'custom', label: 'Custom Logic' },
];

const ScoringRulesEditor: React.FC<ScoringRulesEditorProps> = ({
  templateId,
  initialRules,
  onSave,
  onCancel,
}) => {
  const [method, setMethod] = useState(initialRules?.method || 'weighted_sum');
  const [rules, setRules] = useState<ScoringRule[]>(initialRules?.rules || []);
  const [ranges, setRanges] = useState<ScoreRange[]>(initialRules?.ranges || []);
  const [customLogic, setCustomLogic] = useState(initialRules?.customLogic || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddRule = () => {
    setRules([
      ...rules,
      {
        fieldId: '',
        weight: 1,
        scoringMethod: 'numeric',
        valueMap: {},
      },
    ]);
  };

  const handleRemoveRule = (index: number) => {
    setRules(rules.filter((_, i) => i !== index));
  };

  const handleRuleChange = (index: number, field: keyof ScoringRule, value: any) => {
    setRules(
      rules.map((rule, i) =>
        i === index ? { ...rule, [field]: value } : rule
      )
    );
  };

  const handleAddRange = () => {
    setRanges([
      ...ranges,
      {
        min: 0,
        max: 100,
        label: 'New Range',
        description: '',
      },
    ]);
  };

  const handleRemoveRange = (index: number) => {
    setRanges(ranges.filter((_, i) => i !== index));
  };

  const handleRangeChange = (index: number, field: keyof ScoreRange, value: any) => {
    setRanges(
      ranges.map((range, i) =>
        i === index ? { ...range, [field]: value } : range
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      await scoringApi.updateScoringRules(templateId, {
        method,
        rules,
        ranges,
        customLogic: method === 'custom' ? customLogic : undefined,
      });
      onSave();
    } catch (err) {
      console.error('Error saving scoring rules:', err);
      setError(err instanceof Error ? err.message : 'Failed to save scoring rules');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          {error}
        </div>
      )}

      {/* Scoring Method */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Scoring Method</label>
        <select
          value={method}
          onChange={e => setMethod(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          {scoringMethods.map(m => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
      </div>

      {/* Custom Logic */}
      {method === 'custom' && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Custom Logic</label>
          <textarea
            value={customLogic}
            onChange={e => setCustomLogic(e.target.value)}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter custom scoring logic..."
          />
        </div>
      )}

      {/* Scoring Rules */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <label className="block text-sm font-medium text-gray-700">Scoring Rules</label>
          <button
            type="button"
            onClick={handleAddRule}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Rule
          </button>
        </div>

        <div className="space-y-4">
          {rules.map((rule, index) => (
            <div key={index} className="flex gap-4 items-start bg-gray-50 p-4 rounded">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">Field ID</label>
                <input
                  type="text"
                  value={rule.fieldId}
                  onChange={e => handleRuleChange(index, 'fieldId', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="w-32">
                <label className="block text-sm font-medium text-gray-700">Weight</label>
                <input
                  type="number"
                  value={rule.weight}
                  onChange={e => handleRuleChange(index, 'weight', parseFloat(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  step="0.1"
                  min="0"
                />
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">Method</label>
                <select
                  value={rule.scoringMethod}
                  onChange={e => handleRuleChange(index, 'scoringMethod', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  {fieldScoringMethods.map(m => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={() => handleRemoveRule(index)}
                className="mt-6 text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Score Ranges */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <label className="block text-sm font-medium text-gray-700">Score Ranges</label>
          <button
            type="button"
            onClick={handleAddRange}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Range
          </button>
        </div>

        <div className="space-y-4">
          {ranges.map((range, index) => (
            <div key={index} className="flex gap-4 items-start bg-gray-50 p-4 rounded">
              <div className="w-24">
                <label className="block text-sm font-medium text-gray-700">Min</label>
                <input
                  type="number"
                  value={range.min}
                  onChange={e => handleRangeChange(index, 'min', parseFloat(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  step="0.1"
                />
              </div>

              <div className="w-24">
                <label className="block text-sm font-medium text-gray-700">Max</label>
                <input
                  type="number"
                  value={range.max}
                  onChange={e => handleRangeChange(index, 'max', parseFloat(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  step="0.1"
                />
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">Label</label>
                <input
                  type="text"
                  value={range.label}
                  onChange={e => handleRangeChange(index, 'label', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <input
                  type="text"
                  value={range.description || ''}
                  onChange={e => handleRangeChange(index, 'description', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <button
                type="button"
                onClick={() => handleRemoveRange(index)}
                className="mt-6 text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Rules'}
        </button>
      </div>
    </form>
  );
};

export default ScoringRulesEditor;