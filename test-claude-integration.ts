import testClaudeIntegration from './src/components/ReportGeneration/utils/test-claude';

console.log('Starting Claude integration test...');

testClaudeIntegration()
  .then(success => {
    if (success) {
      console.log('✅ Integration test passed successfully!');
    } else {
      console.error('❌ Integration test failed');
    }
  })
  .catch(error => {
    console.error('❌ Test error:', error);
  });