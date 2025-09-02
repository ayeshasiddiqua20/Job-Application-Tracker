import React from 'react';
import { motion } from 'motion/react';
import { Filter, Clock, Users, CheckCircle, XCircle, LayoutGrid } from 'lucide-react';
import { Button } from './ui/button';
import { FilterStatus } from '../App';

interface FilterBarProps {
  currentFilter: FilterStatus;
  onFilterChange: (filter: FilterStatus) => void;
}

const filterConfig = {
  all: {
    icon: LayoutGrid,
    label: 'All',
    color: 'text-foreground',
    activeColor: 'bg-gradient-to-r from-slate-500 to-slate-600'
  },
  applied: {
    icon: Clock,
    label: 'Applied',
    color: 'text-blue-600',
    activeColor: 'bg-gradient-to-r from-blue-500 to-blue-600'
  },
  interview: {
    icon: Users,
    label: 'Interview',
    color: 'text-orange-600',
    activeColor: 'bg-gradient-to-r from-orange-500 to-orange-600'
  },
  accepted: {
    icon: CheckCircle,
    label: 'Accepted',
    color: 'text-green-600',
    activeColor: 'bg-gradient-to-r from-green-500 to-green-600'
  },
  rejected: {
    icon: XCircle,
    label: 'Rejected',
    color: 'text-red-600',
    activeColor: 'bg-gradient-to-r from-red-500 to-red-600'
  }
};

export function FilterBar({ currentFilter, onFilterChange }: FilterBarProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Filter className="w-4 h-4" />
        <span>Filter:</span>
      </div>
      
      <div className="flex gap-2 flex-wrap">
        {(Object.keys(filterConfig) as FilterStatus[]).map((filter) => {
          const config = filterConfig[filter];
          const Icon = config.icon;
          const isActive = currentFilter === filter;
          
          return (
            <motion.div key={filter} whileTap={{ scale: 0.95 }}>
              <Button
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => onFilterChange(filter)}
                className={`
                  flex items-center gap-2 transition-all duration-200
                  ${isActive 
                    ? `${config.activeColor} text-white border-0 shadow-md` 
                    : `hover:${config.color} hover:border-current`
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span className="capitalize">{config.label}</span>
              </Button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}