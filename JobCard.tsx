import React from 'react';
import { motion } from 'motion/react';
import { Building, Calendar, Trash2, CheckCircle, Clock, XCircle, Users } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { JobApplication } from '../App';

interface JobCardProps {
  job: JobApplication;
  onStatusChange: (id: string, status: JobApplication['status']) => void;
  onDelete: (id: string) => void;
}

const statusConfig = {
  applied: {
    icon: Clock,
    color: 'bg-blue-500',
    gradient: 'from-blue-500/20 to-purple-500/20',
    borderGradient: 'from-blue-200 to-purple-200',
    label: 'Applied',
    badgeVariant: 'secondary' as const
  },
  interview: {
    icon: Users,
    color: 'bg-orange-500',
    gradient: 'from-orange-500/20 to-red-500/20',
    borderGradient: 'from-orange-200 to-red-200',
    label: 'Interview',
    badgeVariant: 'default' as const
  },
  accepted: {
    icon: CheckCircle,
    color: 'bg-green-500',
    gradient: 'from-green-500/20 to-emerald-500/20',
    borderGradient: 'from-green-200 to-emerald-200',
    label: 'Accepted',
    badgeVariant: 'default' as const
  },
  rejected: {
    icon: XCircle,
    color: 'bg-red-500',
    gradient: 'from-red-500/20 to-pink-500/20',
    borderGradient: 'from-red-200 to-pink-200',
    label: 'Rejected',
    badgeVariant: 'destructive' as const
  }
};

export function JobCard({ job, onStatusChange, onDelete }: JobCardProps) {
  const config = statusConfig[job.status];
  const StatusIcon = config.icon;
  const isRejected = job.status === 'rejected';

  const handleStatusToggle = (status: JobApplication['status'], checked: boolean) => {
    if (checked) {
      onStatusChange(job.id, status);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ 
        opacity: isRejected ? 0.7 : 1, 
        scale: 1, 
        y: 0 
      }}
      exit={{ opacity: 0, scale: 0.9, y: -20 }}
      whileHover={{ y: -2 }}
      transition={{ 
        layout: { duration: 0.3 },
        default: { duration: 0.2 }
      }}
      className="group"
    >
      <Card className={`
        relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300
        bg-gradient-to-br ${config.gradient} backdrop-blur-sm
        ${isRejected ? 'opacity-75' : ''}
      `}>
        {/* Gradient border */}
        <div className={`absolute inset-0 bg-gradient-to-r ${config.borderGradient} p-[1px] rounded-lg`}>
          <div className="bg-white dark:bg-slate-800 rounded-[calc(0.625rem-1px)] w-full h-full" />
        </div>
        
        <div className="relative z-10">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className={`font-semibold mb-1 ${isRejected ? 'line-through text-muted-foreground' : ''}`}>
                  {job.title}
                </h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Building className="w-4 h-4" />
                  <span className={isRejected ? 'line-through' : ''}>{job.company}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(job.dateApplied)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={config.badgeVariant} className="flex items-center gap-1">
                  <StatusIcon className="w-3 h-3" />
                  {config.label}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => onDelete(job.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="py-3">
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">Role:</span> {job.role}
            </div>
          </CardContent>

          <CardFooter className="pt-3 border-t border-border/50">
            <div className="w-full">
              <div className="text-xs text-muted-foreground mb-3">Update Status:</div>
              <div className="grid grid-cols-2 gap-3">
                {(['applied', 'interview', 'accepted', 'rejected'] as const).map((status) => {
                  const statusConf = statusConfig[status];
                  const StatusIconSmall = statusConf.icon;
                  return (
                    <div key={status} className="flex items-center space-x-2">
                      <Checkbox
                        id={`${job.id}-${status}`}
                        checked={job.status === status}
                        onCheckedChange={(checked) => handleStatusToggle(status, !!checked)}
                        className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-500 data-[state=checked]:to-purple-600 data-[state=checked]:border-0"
                      />
                      <label 
                        htmlFor={`${job.id}-${status}`}
                        className="text-xs font-medium capitalize cursor-pointer flex items-center gap-1 hover:text-foreground transition-colors"
                      >
                        <StatusIconSmall className="w-3 h-3" />
                        {status}
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardFooter>
        </div>
      </Card>
    </motion.div>
  );
}