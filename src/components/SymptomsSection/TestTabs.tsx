import * as Tabs from '@radix-ui/react-tabs';

const TestTabs = () => {
  return (
    <Tabs.Root defaultValue="tab1">
      <Tabs.List className="flex border-b border-gray-200">
        <Tabs.Trigger 
          value="tab1"
          className="px-4 py-2 border-b-2 border-transparent hover:border-blue-500 data-[state=active]:border-blue-500"
        >
          Tab 1
        </Tabs.Trigger>
        <Tabs.Trigger 
          value="tab2"
          className="px-4 py-2 border-b-2 border-transparent hover:border-blue-500 data-[state=active]:border-blue-500"
        >
          Tab 2
        </Tabs.Trigger>
      </Tabs.List>
      
      <Tabs.Content value="tab1" className="p-4">
        <h2>Content 1</h2>
        <p>This is content for tab 1</p>
      </Tabs.Content>
      
      <Tabs.Content value="tab2" className="p-4">
        <h2>Content 2</h2>
        <p>This is content for tab 2</p>
      </Tabs.Content>
    </Tabs.Root>
  );
};

export default TestTabs;