/**
 * @file SimpleReadingPage.tsx
 * @description Simplified reading entry page
 */

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Gauge } from 'lucide-react';
import { QuickReadingModal } from '@/components/readings/QuickReadingModal';

export default function SimpleReadingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [modalOpen, setModalOpen] = useState(true);
  
  // Get preselected values from navigation state
  const preselected = location.state?.preselected;

  const handleModalClose = (open: boolean) => {
    setModalOpen(open);
    if (!open) {
      navigate('/dashboard/readings');
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/dashboard/readings')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Readings</span>
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Record Reading</h1>
            <p className="text-gray-600">Enter nozzle reading quickly and easily</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gauge className="h-5 w-5 text-blue-600" />
              Quick Reading Entry
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="mb-4">
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Gauge className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Ready to Record Reading
                </h3>
                <p className="text-gray-600 mb-6">
                  The reading entry form will open automatically. Fill in the details and submit.
                </p>
              </div>
              
              <Button
                onClick={() => setModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Gauge className="h-4 w-4 mr-2" />
                Open Reading Form
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Reading Modal */}
      <QuickReadingModal
        open={modalOpen}
        onOpenChange={handleModalClose}
        preselected={preselected}
      />
    </div>
  );
}
