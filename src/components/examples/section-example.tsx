import React from 'react';
import { SectionContainer } from '@/components/ui/section-container';
import { 
  Clipboard, 
  UserCircle, 
  Home,
  Activity 
} from 'lucide-react';

export function SectionExamples() {
  return (
    <div className="space-y-6 p-6">
      {/* Default Section */}
      <SectionContainer
        title="Personal Information"
        description="Basic details and contact information"
        icon={<UserCircle />}
        status="complete"
      >
        <div className="p-4">
          Content goes here...
        </div>
      </SectionContainer>

      {/* Primary Variant */}
      <SectionContainer
        title="Medical History"
        description="Pre-existing conditions and medications"
        variant="primary"
        icon={<Activity />}
        status="in-progress"
        collapsible
      >
        <div className="p-4">
          Content goes here...
        </div>
      </SectionContainer>

      {/* Secondary Variant */}
      <SectionContainer
        title="Environmental Assessment"
        description="Home environment evaluation"
        variant="secondary"
        icon={<Home />}
        status="incomplete"
      >
        <div className="p-4">
          Content goes here...
        </div>
      </SectionContainer>
    </div>
  );
}