# AWS Cloudscape Design System MCP Server

An MCP server that provides knowledge and documentation about AWS Cloudscape design system for building AWS Console applications.

## Overview

This MCP server provides access to:
- Component documentation, examples, and best practices
- Design patterns and usage guidelines
- Component recommendations based on use cases
- Component search functionality

## Installation

```bash
# Install dependencies
npm install

# Build the server
npm run build
```

## Usage

To use this MCP server in Claude:

1. Register the MCP server in your settings.json:

```json
{
  "mcpServers": {
    "aws-cloudscape-mcp-server": {
      "command": "node",
      "args": ["path/to/build/index.js"],
      "disabled": false
    }
  }
}
```

2. Access in Claude using the MCP tools:

```
use_mcp_tool(aws-cloudscape-mcp-server, search_components, {"query": "button"})
```

## Available Resources

The server provides the following resources:

- **Component Documentation**: Access detailed documentation for each Cloudscape component, including usage guidelines, examples, and best practices.
  - URI format: `cloudscape://component/{componentId}`
  - Example: `cloudscape://component/button`

- **Design Patterns**: Information about common design patterns using Cloudscape components.
  - URI format: `cloudscape://pattern/{patternId}`
  - Example: `cloudscape://pattern/empty-state`

- **Component Categories**: Overview of components by category (Container, Form, Table, etc.)
  - URI format: `cloudscape://category/{categoryName}`
  - Example: `cloudscape://category/Form`

## Available Tools

### search_components

Search for Cloudscape components by criteria:

```
use_mcp_tool(aws-cloudscape-mcp-server, search_components, {
  "query": "input text",
  "category": "Form" // optional
})
```

### get_component_recommendation

Get recommendations for which Cloudscape components to use based on a specific UI need:

```
use_mcp_tool(aws-cloudscape-mcp-server, get_component_recommendation, {
  "use_case": "I need a way to show tabular data with sorting and filtering"
})
```

## Available Prompts

### cloudscape_best_practices

Get best practices for using the AWS Cloudscape Design System:

```
access_mcp_resource(aws-cloudscape-mcp-server, cloudscape_best_practices)
```

### aws_console_patterns

Get common AWS Console design patterns using Cloudscape:

```
access_mcp_resource(aws-cloudscape-mcp-server, aws_console_patterns)
```

## Development

Use the MCP inspector to test and debug the server:

```bash
npm run inspector
```

Then open the inspector UI in your browser and test the server's resources and tools.

## Components Included

- Button
- Table
- Form
- Header
- Box
- Alert

More components can be added by extending the data in `src/data/cloudscape-components.ts`.
