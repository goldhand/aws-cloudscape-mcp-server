/**
 * AWS Cloudscape Design System Components Data
 * This file contains structured information about key Cloudscape components, their usage, and examples.
 */

export interface CloudscapeComponent {
  id: string;
  name: string;
  description: string;
  usage: string;
  examples: CloudscapeExample[];
  category: ComponentCategory;
  bestPractices: string[];
  links: {
    documentation: string;
    designGuidelines?: string;
  };
}

export interface CloudscapeExample {
  title: string;
  description: string;
  code: string;
}

export enum ComponentCategory {
  CONTAINER = "Container",
  NAVIGATION = "Navigation",
  FORM = "Form",
  TABLE = "Table",
  CHART = "Chart",
  TEXT = "Text",
  NOTIFICATION = "Notification",
  OVERLAY = "Overlay",
  OTHER = "Other"
}

export const cloudscapeComponents: Record<string, CloudscapeComponent> = {
  "button": {
    id: "button",
    name: "Button",
    description: "Buttons represent actions that users can take.",
    usage: "Use buttons to enable users to perform actions such as submitting a form, confirming a decision, or navigating between pages. Cloudscape provides different variations of buttons for different use cases.",
    examples: [
      {
        title: "Primary button",
        description: "Use a primary button for the main action on a page or in a container.",
        code: `import { Button } from '@cloudscape-design/components';

function MyComponent() {
  return <Button variant="primary">Create resource</Button>;
}`
      },
      {
        title: "Normal button",
        description: "Use a normal button for secondary actions.",
        code: `import { Button } from '@cloudscape-design/components';

function MyComponent() {
  return <Button>Cancel</Button>;
}`
      },
      {
        title: "Button with icon",
        description: "Add an icon to a button to help users understand the action.",
        code: `import { Button } from '@cloudscape-design/components';

function MyComponent() {
  return <Button iconName="add-plus">Add item</Button>;
}`
      }
    ],
    category: ComponentCategory.FORM,
    bestPractices: [
      "Use primary buttons sparingly – only one primary button per page or container",
      "Use clear, action-oriented text for button labels",
      "Position primary actions on the right and secondary actions like 'Cancel' on the left",
      "Use link buttons for navigation and regular buttons for actions"
    ],
    links: {
      documentation: "https://cloudscape.design/components/button/",
      designGuidelines: "https://cloudscape.design/design/patterns/buttons/"
    }
  },
  "table": {
    id: "table",
    name: "Table",
    description: "Tables display data in a structured format with rows and columns.",
    usage: "Use tables to present structured data that users need to scan, compare, or analyze. Cloudscape tables offer built-in sorting, filtering, pagination, and selection capabilities.",
    examples: [
      {
        title: "Basic table",
        description: "A simple table with column headers and data.",
        code: `import { Table } from '@cloudscape-design/components';

function MyComponent() {
  const columnDefinitions = [
    { header: "ID", cell: item => item.id },
    { header: "Name", cell: item => item.name },
    { header: "Type", cell: item => item.type }
  ];

  const items = [
    { id: "1", name: "Instance 1", type: "t3.micro" },
    { id: "2", name: "Instance 2", type: "t3.small" }
  ];

  return (
    <Table
      columnDefinitions={columnDefinitions}
      items={items}
      header="Resources"
    />
  );
}`
      },
      {
        title: "Selectable table",
        description: "A table with row selection enabled.",
        code: `import { Table } from '@cloudscape-design/components';
import { useState } from 'react';

function MyComponent() {
  const [selectedItems, setSelectedItems] = useState([]);

  const columnDefinitions = [
    { header: "ID", cell: item => item.id },
    { header: "Name", cell: item => item.name }
  ];

  const items = [
    { id: "1", name: "Instance 1" },
    { id: "2", name: "Instance 2" }
  ];

  return (
    <Table
      columnDefinitions={columnDefinitions}
      items={items}
      selectionType="multi"
      selectedItems={selectedItems}
      onSelectionChange={({ detail }) =>
        setSelectedItems(detail.selectedItems)
      }
      header="Selectable resources"
    />
  );
}`
      }
    ],
    category: ComponentCategory.TABLE,
    bestPractices: [
      "Use meaningful column headers that clearly describe the data",
      "Enable pagination for large data sets",
      "Include a search box when tables contain many rows",
      "Use empty state messaging when there's no data to display"
    ],
    links: {
      documentation: "https://cloudscape.design/components/table/",
      designGuidelines: "https://cloudscape.design/design/patterns/tables/"
    }
  },
  "form": {
    id: "form",
    name: "Form",
    description: "Forms collect input from users.",
    usage: "Use forms to gather information from users in a structured way. Cloudscape provides a form component that handles layout, validation, and error handling.",
    examples: [
      {
        title: "Basic form",
        description: "A simple form with text input fields.",
        code: `import { Form, FormField, Input } from '@cloudscape-design/components';

function MyComponent() {
  return (
    <Form
      header={<h1>Create resource</h1>}
      actions={
        <SpaceBetween direction="horizontal" size="xs">
          <Button variant="link">Cancel</Button>
          <Button variant="primary">Submit</Button>
        </SpaceBetween>
      }
    >
      <FormField
        label="Resource name"
        description="The name of the resource."
      >
        <Input value={name} onChange={({ detail }) => setName(detail.value)} />
      </FormField>
    </Form>
  );
}`
      }
    ],
    category: ComponentCategory.FORM,
    bestPractices: [
      "Group related form fields together",
      "Use clear, concise labels for form fields",
      "Provide helper text to explain complex fields",
      "Show validation errors inline next to the relevant field"
    ],
    links: {
      documentation: "https://cloudscape.design/components/form/",
      designGuidelines: "https://cloudscape.design/design/patterns/forms/"
    }
  },
  "header": {
    id: "header",
    name: "Header",
    description: "Headers appear at the top of pages and containers to provide context and actions.",
    usage: "Use headers to provide information about the content and to offer actions related to that content.",
    examples: [
      {
        title: "Page header",
        description: "A header for a page with actions.",
        code: `import { Header, Button, SpaceBetween } from '@cloudscape-design/components';

function MyComponent() {
  return (
    <Header
      variant="h1"
      actions={
        <SpaceBetween size="xs" direction="horizontal">
          <Button>Edit</Button>
          <Button variant="primary">Create</Button>
        </SpaceBetween>
      }
    >
      Resources
    </Header>
  );
}`
      }
    ],
    category: ComponentCategory.CONTAINER,
    bestPractices: [
      "Use concise, descriptive headings",
      "Place the most important actions in the header",
      "Use consistent heading levels throughout your application",
      "Consider using breadcrumbs with headers for navigation context"
    ],
    links: {
      documentation: "https://cloudscape.design/components/header/"
    }
  },
  "box": {
    id: "box",
    name: "Box",
    description: "Boxes are container components that visually group content.",
    usage: "Use boxes to create visual separation between different sections of content on a page.",
    examples: [
      {
        title: "Basic box",
        description: "A simple box with a header.",
        code: `import { Box } from '@cloudscape-design/components';

function MyComponent() {
  return (
    <Box
      variant="awsui-key-label"
      padding="s"
      fontSize="body-m"
      color="text-body-secondary"
    >
      <h3>Important information</h3>
      <p>This is important content that needs to stand out.</p>
    </Box>
  );
}`
      }
    ],
    category: ComponentCategory.CONTAINER,
    bestPractices: [
      "Use boxes to group related content",
      "Don't nest boxes too deeply",
      "Consider using different variants for different types of content",
      "Use consistent padding within boxes"
    ],
    links: {
      documentation: "https://cloudscape.design/components/box/"
    }
  },
  "alert": {
    id: "alert",
    name: "Alert",
    description: "Alerts display important messages to users.",
    usage: "Use alerts to communicate important information, warnings, or errors to users.",
    examples: [
      {
        title: "Success alert",
        description: "A success alert to confirm an action was completed.",
        code: `import { Alert } from '@cloudscape-design/components';

function MyComponent() {
  return (
    <Alert
      type="success"
      header="Resource created successfully"
    >
      Your new resource is now available.
    </Alert>
  );
}`
      },
      {
        title: "Warning alert",
        description: "A warning alert for potential issues.",
        code: `import { Alert } from '@cloudscape-design/components';

function MyComponent() {
  return (
    <Alert
      type="warning"
      header="Your account is approaching its quota"
    >
      Consider upgrading your plan to avoid service interruptions.
    </Alert>
  );
}`
      }
    ],
    category: ComponentCategory.NOTIFICATION,
    bestPractices: [
      "Use the appropriate alert type (success, warning, info, error)",
      "Provide clear, actionable information in alerts",
      "Use alerts sparingly to avoid alert fatigue",
      "Position alerts where they will be noticed but not disruptive"
    ],
    links: {
      documentation: "https://cloudscape.design/components/alert/",
      designGuidelines: "https://cloudscape.design/design/patterns/status-indicators/"
    }
  }
};

export const componentsByCategory: Record<ComponentCategory, string[]> = {
  [ComponentCategory.CONTAINER]: ["box", "header"],
  [ComponentCategory.NAVIGATION]: [],
  [ComponentCategory.FORM]: ["button", "form"],
  [ComponentCategory.TABLE]: ["table"],
  [ComponentCategory.CHART]: [],
  [ComponentCategory.TEXT]: [],
  [ComponentCategory.NOTIFICATION]: ["alert"],
  [ComponentCategory.OVERLAY]: [],
  [ComponentCategory.OTHER]: []
};

export const cloudscapePatterns = {
  "empty-state": {
    name: "Empty state",
    description: "Design pattern for showing empty states in tables, lists, and dashboards",
    usage: "Use empty states to communicate when there's no data to display and guide users on what to do next."
  },
  "form-validation": {
    name: "Form validation",
    description: "Patterns for validating user input in forms",
    usage: "Use form validation to help users complete forms correctly and efficiently."
  },
  "loading-states": {
    name: "Loading states",
    description: "Patterns for indicating that content is loading",
    usage: "Use loading states to provide feedback to users when content is being loaded."
  }
};
