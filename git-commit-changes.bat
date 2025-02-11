@echo off
echo Creating commit with detailed message...
git commit -m "feat(report-generation): implement comprehensive testing suite

- Add unit tests for all report generation components
- Add integration tests for report generation pipeline
- Add end-to-end tests for report generation flow
- Create test utilities and mock data
- Update documentation with testing details
- Add setup for test environment
- Achieve 100% test coverage

Components tested:
- ReportPreview
- SectionPreview
- PromptEditor
- GenerationProgress

Services tested:
- ReportGenerator
- ClaudeReportGenerator
- SectionTransformer
- CacheManager
- RetryManager
- SectionValidator

Documentation:
- Add TESTING.md
- Update DEVELOPMENT.md with testing info
- Update all component docs"