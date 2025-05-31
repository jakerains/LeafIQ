import React from 'react';
import { cn } from '../../../lib/utils';

interface TerpeneTabsProps {
  activeTab: 'mapping' | 'database';
  onChange: (tab: 'mapping' | 'database') => void;
}

const TerpeneTabs: React.FC<TerpeneTabsProps> = ({ activeTab, onChange }) => {
  return (
    <div className="mb-6">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => onChange('mapping')}
            className={cn(
              'py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap',
              activeTab === 'mapping'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            )}
          >
            Vibe to Terpene Mappings
          </button>
          <button
            onClick={() => onChange('database')}
            className={cn(
              'py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap',
              activeTab === 'database'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            )}
          >
            Terpene Database
          </button>
        </nav>
      </div>
    </div>
  );
};

export default TerpeneTabs;