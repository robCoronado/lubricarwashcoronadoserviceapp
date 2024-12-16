import React from 'react';
import { User } from 'lucide-react';
import type { Customer } from '../../../types/customer';

interface CustomerAvatarProps {
  customer: Customer;
  size?: 'sm' | 'md' | 'lg';
}

export function CustomerAvatar({ customer, size = 'md' }: CustomerAvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    <div className="flex-shrink-0">
      {customer.profileImage ? (
        <img
          src={customer.profileImage}
          alt={`${customer.firstName} ${customer.lastName}`}
          className={`${sizeClasses[size]} rounded-full object-cover`}
        />
      ) : (
        <div className={`${sizeClasses[size]} rounded-full bg-gray-100 flex items-center justify-center`}>
          <User className={`${iconSizes[size]} text-gray-400`} />
        </div>
      )}
    </div>
  );
}