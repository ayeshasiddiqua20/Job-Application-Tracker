import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Filter, Briefcase, Calendar, Building } from 'lucide-react';
import { AddJobForm } from './components/AddJobForm';
import { JobCard } from './components/JobCard';
import { FilterBar } from './components/FilterBar';
import { Button } from './components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './components/ui/dialog';

export interface JobApplication {
  id: string;
  title: string;
  company: string;
  role: string;
  dateApplied: string;
  status: 'applied' | 'interview' | 'accepted' | 'rejected';
}

export type FilterStatus = 'all' | 'applied' | 'interview' | 'accepted' | 'rejected';

export default function App() {
  const [jobs, setJobs] = useState<JobApplication[]>([
    {
      id: '1',
      title: 'Senior Frontend Developer',
      company: 'TechCorp',
      role: 'Frontend Developer',
      dateApplied: '2024-01-15',
      status: 'interview'
    },
    {
      id: '2',
      title: 'Full Stack Engineer',
      company: 'StartupXYZ',
      role: 'Full Stack Developer',
      dateApplied: '2024-01-10',
      status: 'applied'
    },
    {
      id: '3',
      title: 'React Developer',
      company: 'WebSolutions',
      role: 'React Developer',
      dateApplied: '2024-01-05',
      status: 'accepted'
    }
  ]);
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const addJob = (newJob: Omit<JobApplication, 'id'>) => {
    const job: JobApplication = {
      ...newJob,
      id: Date.now().toString()
    };
    setJobs(prev => [job, ...prev]);
    setIsAddDialogOpen(false);
  };

  const updateJobStatus = (id: string, status: JobApplication['status']) => {
    setJobs(prev => prev.map(job => 
      job.id === id ? { ...job, status } : job
    ));
  };

  const deleteJob = (id: string) => {
    setJobs(prev => prev.filter(job => job.id !== id));
  };

  const sortedJobs = useMemo(() => {
    const filtered = filter === 'all' ? jobs : jobs.filter(job => job.status === filter);
    
    // Sort so rejected jobs appear at the bottom
    return filtered.sort((a, b) => {
      if (a.status === 'rejected' && b.status !== 'rejected') return 1;
      if (a.status !== 'rejected' && b.status === 'rejected') return -1;
      return new Date(b.dateApplied).getTime() - new Date(a.dateApplied).getTime();
    });
  }, [jobs, filter]);

  const getStatusCounts = () => {
    return {
      all: jobs.length,
      applied: jobs.filter(job => job.status === 'applied').length,
      interview: jobs.filter(job => job.status === 'interview').length,
      accepted: jobs.filter(job => job.status === 'accepted').length,
      rejected: jobs.filter(job => job.status === 'rejected').length,
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Job Application Tracker
            </h1>
          </div>
          <p className="text-muted-foreground">
            Keep track of your job applications and their progress
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8"
        >
          {Object.entries(getStatusCounts()).map(([status, count]) => (
            <div key={status} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="text-2xl font-bold text-center">{count}</div>
              <div className="text-sm text-muted-foreground text-center capitalize">
                {status === 'all' ? 'Total' : status}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Controls */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 mb-8"
        >
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0">
                <Plus className="w-4 h-4 mr-2" />
                Add Job Application
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Job Application</DialogTitle>
              </DialogHeader>
              <AddJobForm onAdd={addJob} />
            </DialogContent>
          </Dialog>

          <FilterBar currentFilter={filter} onFilterChange={setFilter} />
        </motion.div>

        {/* Job List */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {sortedJobs.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                No job applications found
              </h3>
              <p className="text-muted-foreground">
                {filter === 'all' 
                  ? 'Start by adding your first job application!' 
                  : `No applications with "${filter}" status.`
                }
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence>
                {sortedJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onStatusChange={updateJobStatus}
                    onDelete={deleteJob}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}