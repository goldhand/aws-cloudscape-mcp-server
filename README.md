# AWS Cloudscape MCP Server

A Model Context Protocol (MCP) server that provides knowledge and documentation about the AWS Cloudscape design system for teams building AWS Console applications.

## Features

- **Component Documentation**: Access documentation for Cloudscape components via resources
- **Search Functionality**: Search for components by name, description, or use case
- **Recommendations**: Get component recommendations based on UI requirements
- **Best Practices**: Access Cloudscape design best practices
- **Design Patterns**: Learn about common AWS Console design patterns

## Installation

### Option 1: Install from npm (Recommended)

```bash
# Install globally
npm install -g aws-cloudscape-mcp-server

# Add to your Cline MCP settings
npx mcp-config add aws-cloudscape-mcp-server
```

### Option 2: Manual Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/aws-cloudscape-mcp-server.git
cd aws-cloudscape-mcp-server
```

2. Install dependencies and build:
```bash
npm install
npm run build
```

3. Add to your Cline MCP settings manually by editing:
`~/Library/Application Support/Code/User/globalStorage/asbx.amzn-cline/settings/cline_mcp_settings.json`

```json
"aws-cloudscape-mcp-server": {
  "command": "node",
  "args": ["/path/to/aws-cloudscape-mcp-server/build/index.js"],
  "env": {
    "FASTMCP_LOG_LEVEL": "ERROR"
  },
  "disabled": false,
  "autoApprove": []
}
```

## Usage

Once installed and added to your Cline MCP settings, you can use the server through the Cline interface:

### Available Resources

- Component documentation: `cloudscape://component/button`
- Design pattern documentation: `cloudscape://pattern/empty-state`
- Category overviews: `cloudscape://category/Form`

### Available Tools

- `search_components`: Search for components by query and category
- `get_component_recommendation`: Get component recommendations for specific UI needs

### Available Prompts

- `cloudscape_best_practices`: Best practices for using AWS Cloudscape Design System
- `aws_console_patterns`: Common AWS Console design patterns

## Development

```bash
# Install dependencies
npm install

# Build the server
npm run build

# Run in watch mode during development
npm run watch

# Test with the MCP inspector
npm run inspector
```

## Publishing

To publish this package to npm:

1. Update version in package.json
2. Build the package: `npm run build`
3. Publish: `npm publish`

## License

MIT
