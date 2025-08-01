#!/usr/bin/env node

/**
 * AWS Cloudscape Design System MCP Server
 *
 * This MCP server provides knowledge and documentation about the AWS Cloudscape
 * design system for teams building AWS Console applications. It exposes:
 *
 * - Component documentation as resources
 * - Search functionality as a tool
 * - Best practices and patterns
 * - Code examples
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import {
  cloudscapeComponents,
  componentsByCategory,
  cloudscapePatterns,
  ComponentCategory
} from "./data/cloudscape-components.js";

/**
 * Create an MCP server with capabilities for resources (to list/read component docs),
 * tools (to search components by criteria), and prompts (to provide best practices).
 */
const server = new Server(
  {
    name: "aws-cloudscape-mcp-server",
    version: "0.1.0",
  },
  {
    capabilities: {
      resources: {},
      tools: {},
      prompts: {},
    },
  }
);

/**
 * Handler for listing available Cloudscape components as resources.
 * Each component is exposed as a resource with:
 * - A cloudscape:// URI scheme
 * - Plain text MIME type
 * - Human readable name and description
 */
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  console.debug('[Resources] Listing all available Cloudscape components and patterns');

  // Create resources for all components
  const componentResources = Object.values(cloudscapeComponents).map(component => ({
    uri: `cloudscape://component/${component.id}`,
    mimeType: "text/markdown",
    name: component.name,
    description: `${component.description} (${component.category})`
  }));

  // Create resources for all design patterns
  const patternResources = Object.entries(cloudscapePatterns).map(([id, pattern]) => ({
    uri: `cloudscape://pattern/${id}`,
    mimeType: "text/markdown",
    name: pattern.name,
    description: pattern.description
  }));

  // Create category overview resources
  const categoryResources = Object.values(ComponentCategory).map(category => ({
    uri: `cloudscape://category/${category}`,
    mimeType: "text/markdown",
    name: `${category} Components`,
    description: `Overview of all ${category} components in Cloudscape`
  }));

  return {
    resources: [
      ...componentResources,
      ...patternResources,
      ...categoryResources
    ]
  };
});

/**
 * Format a component's details as Markdown
 */
function formatComponentAsMarkdown(component: typeof cloudscapeComponents[keyof typeof cloudscapeComponents]): string {
  const examplesMarkdown = component.examples.map(example => `
### ${example.title}
${example.description}

\`\`\`tsx
${example.code}
\`\`\`
`).join('\n\n');

  const bestPracticesMarkdown = component.bestPractices.map(practice => `- ${practice}`).join('\n');

  return `# ${component.name}

${component.description}

## Usage
${component.usage}

## Examples
${examplesMarkdown}

## Best Practices
${bestPracticesMarkdown}

## Documentation Links
- [Component Documentation](${component.links.documentation})
${component.links.designGuidelines ? `- [Design Guidelines](${component.links.designGuidelines})` : ''}
`;
}

/**
 * Format a category overview as Markdown
 */
function formatCategoryAsMarkdown(category: ComponentCategory): string {
  const categoryComponents = componentsByCategory[category] || [];
  const componentsList = categoryComponents.map(id => {
    const component = cloudscapeComponents[id];
    return `- [${component.name}](${component.links.documentation}): ${component.description}`;
  }).join('\n');

  return `# ${category} Components

${componentsList.length > 0 ? componentsList : 'No components in this category yet.'}
`;
}

/**
 * Format a pattern's details as Markdown
 */
function formatPatternAsMarkdown(id: string, pattern: typeof cloudscapePatterns[keyof typeof cloudscapePatterns]): string {
  return `# ${pattern.name}

${pattern.description}

## Usage
${pattern.usage}
`;
}

/**
 * Handler for reading the contents of a specific component, pattern, or category.
 * Takes a cloudscape:// URI and returns the formatted content as markdown.
 */
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  console.debug(`[Resource] Reading resource: ${request.params.uri}`);

  try {
    const uri = request.params.uri;
    // Format: cloudscape://component/button or cloudscape://pattern/empty-state
    const matches = uri.match(/cloudscape:\/\/([^\/]+)\/(.+)/);

    if (!matches) {
      throw new Error(`Invalid resource URI format: ${uri}`);
    }

    const resourceType = matches[1]; // component, pattern, or category
    const resourceId = matches[2];

    console.debug(`[Resource] Type: ${resourceType}, ID: ${resourceId}`);

    let content = '';

    if (resourceType === 'component') {
      const component = cloudscapeComponents[resourceId];
      if (!component) {
        throw new Error(`Component ${resourceId} not found`);
      }
      content = formatComponentAsMarkdown(component);
    }
    else if (resourceType === 'pattern') {
      const pattern = cloudscapePatterns[resourceId as keyof typeof cloudscapePatterns];
      if (!pattern) {
        throw new Error(`Pattern ${resourceId} not found`);
      }
      content = formatPatternAsMarkdown(resourceId, pattern);
    }
    else if (resourceType === 'category') {
      const category = resourceId as ComponentCategory;
      if (!Object.values(ComponentCategory).includes(category)) {
        throw new Error(`Category ${resourceId} not found`);
      }
      content = formatCategoryAsMarkdown(category);
    }
    else {
      throw new Error(`Unknown resource type: ${resourceType}`);
    }

    return {
      contents: [{
        uri: request.params.uri,
        mimeType: "text/markdown",
        text: content
      }]
    };
  } catch (error) {
    console.error(`[Error] Failed to read resource: ${error}`);
    throw error;
  }
});

/**
 * Handler that lists available tools.
 * Exposes tools for searching components and getting recommendations.
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  console.debug('[Tools] Listing available Cloudscape tools');

  return {
    tools: [
      {
        name: "search_components",
        description: "Search for Cloudscape components by criteria",
        inputSchema: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "Search query to match against component names, descriptions, or usage"
            },
            category: {
              type: "string",
              description: "Filter by component category",
              enum: Object.values(ComponentCategory)
            }
          },
          required: ["query"]
        }
      },
      {
        name: "get_component_recommendation",
        description: "Get a recommendation for which Cloudscape component to use for a specific UI need",
        inputSchema: {
          type: "object",
          properties: {
            use_case: {
              type: "string",
              description: "Description of what you're trying to build or the user need you're addressing"
            }
          },
          required: ["use_case"]
        }
      }
    ]
  };
});

/**
 * Handler for the search_components and get_component_recommendation tools.
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  console.debug(`[Tool] Calling tool: ${request.params.name}`);

  switch (request.params.name) {
    case "search_components": {
      try {
        const query = String(request.params.arguments?.query).toLowerCase();
        const category = request.params.arguments?.category as ComponentCategory | undefined;
        console.debug(`[Tool] Searching components with query: ${query}, category: ${category || 'all'}`);

        // Filter components by query and category
        const filteredComponents = Object.values(cloudscapeComponents).filter(component => {
          const matchesQuery =
            component.name.toLowerCase().includes(query) ||
            component.description.toLowerCase().includes(query) ||
            component.usage.toLowerCase().includes(query);

          const matchesCategory = !category || component.category === category;

          return matchesQuery && matchesCategory;
        });

        if (filteredComponents.length === 0) {
          return {
            content: [{
              type: "text",
              text: `No components found matching "${query}"${category ? ` in category ${category}` : ''}.`
            }]
          };
        }

        const results = filteredComponents.map(component => `
## [${component.name}](${component.links.documentation})
**Category:** ${component.category}

${component.description}

**Usage:** ${component.usage.substring(0, 150)}${component.usage.length > 150 ? '...' : ''}
`).join('\n');

        return {
          content: [{
            type: "text",
            text: `# Search Results for "${query}"\n\nFound ${filteredComponents.length} components:\n${results}`
          }]
        };
      } catch (error) {
        console.error(`[Error] Search components failed: ${error}`);
        throw error;
      }
    }

    case "get_component_recommendation": {
      try {
        const useCase = String(request.params.arguments?.use_case);
        console.debug(`[Tool] Getting component recommendation for use case: ${useCase}`);

        // Very basic recommendation system based on keywords
        const keywords: Record<string, string[]> = {
          "button": ["button", "click", "action", "submit", "cancel"],
          "table": ["table", "data", "grid", "row", "column", "list", "items"],
          "form": ["form", "input", "field", "submit", "validation", "enter data"],
          "header": ["header", "title", "heading", "page title", "section title"],
          "box": ["container", "box", "group", "section", "panel"],
          "alert": ["alert", "message", "notification", "warning", "error", "success", "info"]
        };

        // Find matches based on keywords
        const matches: Record<string, number> = {};
        for (const [componentId, keywordList] of Object.entries(keywords)) {
          for (const keyword of keywordList) {
            if (useCase.toLowerCase().includes(keyword.toLowerCase())) {
              matches[componentId] = (matches[componentId] || 0) + 1;
            }
          }
        }

        // Sort by match count
        const sortedMatches = Object.entries(matches)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([id]) => id);

        if (sortedMatches.length === 0) {
          return {
            content: [{
              type: "text",
              text: `I couldn't find specific component recommendations for "${useCase}". Consider browsing the available components by category to find what you need.`
            }]
          };
        }

        const recommendations = sortedMatches
          .map(id => cloudscapeComponents[id])
          .map(component => `
## [${component.name}](${component.links.documentation})

${component.description}

**Usage:** ${component.usage}

**Example:**
\`\`\`tsx
${component.examples[0]?.code || 'No example available'}
\`\`\`
`).join('\n');

        return {
          content: [{
            type: "text",
            text: `# Recommended Components for "${useCase}"\n\n${recommendations}\n\nFor more details, access the full documentation for these components.`
          }]
        };
      } catch (error) {
        console.error(`[Error] Component recommendation failed: ${error}`);
        throw error;
      }
    }

    default:
      console.error(`[Error] Unknown tool: ${request.params.name}`);
      throw new Error(`Unknown tool: ${request.params.name}`);
  }
});

/**
 * Handler that lists available prompts.
 * Exposes prompts for best practices and common patterns.
 */
server.setRequestHandler(ListPromptsRequestSchema, async () => {
  console.debug('[Prompts] Listing available Cloudscape prompts');

  return {
    prompts: [
      {
        name: "cloudscape_best_practices",
        description: "Get best practices for using AWS Cloudscape Design System",
      },
      {
        name: "aws_console_patterns",
        description: "Get common AWS Console design patterns using Cloudscape",
      }
    ]
  };
});

/**
 * Handler for the cloudscape_best_practices and aws_console_patterns prompts.
 */
server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  console.debug(`[Prompt] Getting prompt: ${request.params.name}`);

  if (request.params.name === "cloudscape_best_practices") {
    // Extract best practices from all components
    const bestPractices = Object.values(cloudscapeComponents).flatMap(component =>
      component.bestPractices.map(practice => `- **${component.name}:** ${practice}`)
    );

    return {
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `I need to use AWS Cloudscape Design System correctly in my application. Can you provide me with best practices?`
          }
        },
        {
          role: "assistant",
          content: {
            type: "text",
            text: `# AWS Cloudscape Design System Best Practices

Here are key best practices for using Cloudscape components effectively:

## Component-Specific Best Practices

${bestPractices.join('\n')}

## General Best Practices

- Maintain consistent spacing using Cloudscape's built-in spacing tokens
- Use the proper density mode based on the amount of information displayed
- Follow AWS's color palette and avoid custom colors when possible
- Use proper hierarchy with headers, containers, and content organization
- Ensure your interfaces are accessible by using proper ARIA attributes and keyboard navigation
- Use Cloudscape's responsive design patterns for different screen sizes
- Keep component usage consistent throughout your application
- Use the same form validation patterns across your application
- Follow AWS's error and notification patterns for consistency
- Utilize the Container and Layout components for proper page structure
- Always test your interfaces for accessibility and usability

Which specific area would you like more guidance on?`
          }
        }
      ]
    };
  }
  else if (request.params.name === "aws_console_patterns") {
    return {
      messages: [
        {
          role: "user",
          content: {
            type: "text",
            text: `What are the common design patterns used in AWS Console applications with Cloudscape?`
          }
        },
        {
          role: "assistant",
          content: {
            type: "text",
            text: `# Common AWS Console Design Patterns with Cloudscape

AWS Console applications follow these common design patterns:

## Navigation Patterns
- **App Layout**: Use the AppLayout component as the foundation for your application
- **Service Navigation**: Left side navigation with collapsible sections
- **Breadcrumbs**: Show location hierarchy and enable navigation to parent pages
- **Tabs**: Use tabs for switching between related views of the same entity

## Table Patterns
- **Resource Tables**: Tables with selection, filtering, and pagination
- **Preferences**: Allow users to customize table columns and views
- **Batch Actions**: Enable actions on multiple selected items
- **Inline Actions**: Provide actions for individual table rows

## Form Patterns
- **Create Forms**: Multi-step forms with validation
- **Form Sections**: Group related fields with expandable sections
- **Validation**: Inline validation with error messages
- **Help Panels**: Contextual help for complex forms

## Detail Pages
- **Header Actions**: Important actions in the page header
- **Split Panel**: Details panel that opens from the right
- **Tabs for Sections**: Organize details into tabbed sections
- **Status Indicators**: Show resource status with badges and icons

## Common Flows
- **Create-Read-Update-Delete (CRUD)**: Standard operations for resources
- **List-Detail**: Master-detail view of resources
- **Wizards**: Step-by-step workflows for complex tasks
- **Dashboard**: Overview with key metrics and actions

## Notification Patterns
- **Flash Messages**: Temporary notifications for user actions
- **Alerts**: Persistent alerts for important information
- **Loading States**: Skeleton screens and loading indicators
- **Empty States**: Helpful guidance when no data is available

Would you like me to elaborate on any specific pattern?`
          }
        }
      ]
    };
  }

  console.error(`[Error] Unknown prompt: ${request.params.name}`);
  throw new Error(`Unknown prompt: ${request.params.name}`);
});

/**
 * Start the server using stdio transport.
 * This allows the server to communicate via standard input/output streams.
 */
async function main() {
  console.debug('[Setup] Starting AWS Cloudscape MCP Server');
  try {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.debug('[Setup] Server started successfully');
  } catch (error) {
    console.error('[Error] Failed to start server:', error);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('[Error] Unhandled error:', error);
  process.exit(1);
});
