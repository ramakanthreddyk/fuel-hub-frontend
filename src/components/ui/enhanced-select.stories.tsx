
import type { Meta, StoryObj } from '@storybook/react';
import { EnhancedSelect } from './enhanced-select';

const meta: Meta<typeof EnhancedSelect> = {
  title: 'UI/EnhancedSelect',
  component: EnhancedSelect,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const sampleOptions = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
  { value: 'disabled', label: 'Disabled Option', disabled: true },
];

export const Default: Story = {
  args: {
    label: 'Select Option',
    options: sampleOptions,
    placeholder: 'Choose an option...',
  },
};

export const Required: Story = {
  args: {
    label: 'Required Selection',
    options: sampleOptions,
    required: true,
    helperText: 'This field is required',
  },
};

export const WithError: Story = {
  args: {
    label: 'Selection with Error',
    options: sampleOptions,
    error: 'Please select a valid option',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Select',
    options: sampleOptions,
    disabled: true,
  },
};
