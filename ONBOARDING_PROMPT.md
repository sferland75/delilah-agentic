# Developer Onboarding - Report Generation Integration

## 🎯 Quick Start
1. Clone the repository:
```bash
git clone [repository-url]
cd delilah
```

2. Review these documents in order:
   - `README.md` - Project overview and core features
   - `INTEGRATION_PROGRESS.md` - Current integration status and blockers
   - `INTEGRATION_PROMPT.md` - Form integration task details

## 🔍 Key Areas of Focus
- Report generation integration is currently in progress
- Testing infrastructure needs immediate attention
- Component mocking strategy requires updates

## 🚨 Current Critical Issues
1. Testing environment configuration needs fixing
2. Mock file conflicts need resolution
3. Type mismatches between form and assessment

## 📝 Key Files to Review
```
src/
├── components/ReportGeneration/     # ✅ Report templates complete
│   ├── services/
│   │   └── templates/              # All report sections
│   └── utils/
│       └── formTransformer.ts      # Form data conversion
├── hooks/
│   └── useAssessmentForm.ts        # Form state management
└── types/
    └── assessment.ts               # Required data structure
```

## 🛠️ Development Environment
Required packages:
```bash
npm install \
  react-hook-form \
  @hookform/resolvers \
  zod \
  clsx \
  tailwind-merge \
  lucide-react \
  @radix-ui/react-dialog \
  @radix-ui/react-alert-dialog \
  @radix-ui/react-progress
```

## 🎯 Next Actions
1. Review `INTEGRATION_PROGRESS.md` for current blockers
2. Check failing tests in `src/components/ReportGeneration/__tests__/`
3. Examine type definitions in `src/types/assessment.ts`

## 🤝 Need Help?
- Review GitHub issues for known problems
- Check the test configuration in `jest.config.js`
- Look for mock conflicts in `src/__mocks__/`

## 📊 Testing Status
- 45 passing tests across 12 modules
- Currently dealing with mock conflicts
- Jest configuration needs updates

## 💡 Tips
- Start with fixing the testing infrastructure
- Don't modify report templates without tests
- Keep types in sync between form and assessment schema

## ⚠️ Common Issues
- ESM import conflicts in Jest
- Duplicate mock file errors
- Type mismatches in form data

Need more help? Check the detailed documentation in the docs directory or reach out to the team.