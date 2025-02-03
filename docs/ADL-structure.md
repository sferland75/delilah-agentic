# Activities of Daily Living (ADL) Assessment Structure

## Overview
The ADL section assesses functional independence across four main categories:
1. Basic ADLs (BADLs)
2. Instrumental ADLs (IADLs)
3. Health Management
4. Work Status

## Data Structure
```typescript
adl: {
  basic: {
    [category: string]: {
      [activityId: string]: {
        independence: string;    // From independence levels enum
        painLevel: number;      // 0-10 scale
        lastAssessed: Date;     // Date of last assessment
        notes: string;          // Observations and details
        frequency?: string;     // For applicable activities
        timeTaken?: string;     // For applicable activities
        usesAssistiveDevices?: boolean;
        assistiveDevices?: string;
      }
    }
  },
  iadl: {/* Same structure as basic */},
  health: {/* Same structure as basic */},
  work: {/* Same structure as basic */}
}
```

## Independence Levels
- Independent (7) - Complete independence
- Modified Independent (6) - Uses devices/adaptations
- Supervision (5) - Supervision/setup only
- Minimal Assistance (4) - >75% independent
- Moderate Assistance (3) - 50-75% independent
- Maximal Assistance (2) - 25-49% independent
- Total Assistance (1) - <25% independent
- Not Applicable - Activity not relevant

## Categories and Activities

### Basic ADLs
1. Bathing & Hygiene
   - Bathing/Showering
   - Grooming
   - Oral Care
   - Toileting

2. Dressing
   - Upper Body
   - Lower Body
   - Footwear

3. Feeding
   - Eating
   - Meal Setup
   - Drinking

4. Functional Mobility
   - Bed Transfers
   - Toilet Transfers
   - Shower/Tub Transfers
   - Position Changes

### IADLs
1. Household Management
   - House Cleaning
   - Laundry
   - Meal Preparation
   - Home Maintenance

2. Community Integration
   - Transportation
   - Shopping
   - Financial Management
   - Navigation

3. Communication & Technology
   - Phone Use
   - Computer/Device Use
   - Written Communication

4. Leisure & Social
   - Hobbies
   - Social Participation
   - Physical Recreation

### Health Management
1. Management
   - Medications
   - Appointments
   - Health Monitoring
   - Exercise/Activity

2. Health Routine
   - Sleep Management
   - Stress Management
   - Nutrition Management

### Work Status
1. Current Status
   - Work Situation
   - Accommodations
   - Training Needs
   - Barriers to Return

## Activity Properties
Some activities require additional tracking:
- Frequency (e.g., multiple daily, daily, weekly)
- Time Taken (e.g., under 5min, 5-15min)
- Assistive Devices (with description field)

## Pain Level Assessment
Each activity includes pain level tracking:
- 0-10 scale
- Visual indicators for severity
- Warning levels:
  - 0-4: Low (secondary)
  - 5-7: Moderate (warning)
  - 8-10: Severe (destructive)

## Date Tracking
Each activity tracks:
- Last assessment date
- History of changes (future feature)