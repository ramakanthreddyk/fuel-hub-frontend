
import type { Meta, StoryObj } from '@storybook/react';
import { EnhancedInput } from './enhanced-input';
import { User, Mail, Lock } from 'lucide-react';

const meta: Meta<typeof EnhancedInput> = {
  title: 'UI/EnhancedInput',
  component: EnhancedInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url', 'search'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Default Input',
    placeholder: 'Enter text...',
  },
};

export const WithIcon: Story = {
  args: {
    label: 'Username',
    placeholder: 'Enter username',
    leftIcon: <User className="h-4 w-4" />,
  },
};

export const Email: Story = {
  args: {
    label: 'Email Address',
    type: 'email',
    placeholder: 'john@example.com',
    leftIcon: <Mail className="h-4 w-4" />,
    required: true,
  },
};

export const Password: Story = {
  args: {
    label: 'Password',
    type: 'password',
    placeholder: 'Enter password',
    leftIcon: <Lock className="h-4 w-4" />,
    required: true,
    helperText: 'Must be at least 8 characters',
  },
};

export const WithError: Story = {
  args: {
    label: 'Email',
    type: 'email',
    placeholder: 'Enter email',
    error: 'Please enter a valid email address',
    value: 'invalid-email',
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Input',
    placeholder: 'Cannot edit',
    disabled: true,
    value: 'Read only value',
  },
};
