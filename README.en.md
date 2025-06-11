# Language: English

# Waq3 Natiga - Student Results Search System

## Introduction

Waq3 Natiga is a modern web application that provides a unified search interface for Egyptian student examination results. The system allows students and parents to search for primary and preparatory school examination results from all Egyptian governorates through a single, user-friendly platform.

## Purpose

The application serves as a centralized portal for accessing student examination results from the Egyptian Ministry of Education's Al-Azhar database. It simplifies the process of retrieving results by providing:

- A unified search interface for both primary and preparatory levels
- Support for all Egyptian governorates
- Real-time result retrieval with retry mechanisms
- Responsive design for mobile and desktop access
- Arabic language support with RTL (Right-to-Left) layout

## Tech Stack

### Backend

- **Runtime**: Bun.js - High-performance JavaScript runtime
- **Framework**: Hono - Lightweight web framework for edge computing
- **Language**: TypeScript with JSX support

### Frontend

- **Styling**: Tailwind CSS - Utility-first CSS framework
- **Interactivity**: HTMX - High power tools for HTML
- **Scripting**: Hyperscript - Event-driven scripting language
- **Icons**: Lucide Icons - Beautiful & consistent icon library

### Infrastructure

- **Containerization**: Docker with multi-stage builds
- **Health Monitoring**: Built-in health check endpoints
- **Graceful Shutdown**: Signal handling for clean termination

## Endpoints

### Main Routes

- `GET /` - Home page with welcome interface
- `GET /search` - Unified search form for all educational levels
- `GET /health` - Health check endpoint for monitoring
- `POST /search-results` - Processes search requests and returns results

### Legacy Routes (Redirects)

- `GET /indexprimary` - Redirects to `/search` for backward compatibility
- `GET /indexsecondary` - Redirects to `/search` for backward compatibility

## Key Features

### Search Functionality

- **Multi-level Support**: Search for both primary and preparatory school results
- **Governorate Selection**: Complete coverage of all 27 Egyptian governorates
- **Seat Number Validation**: Input validation with minimum length requirements
- **Real-time Search**: Immediate result retrieval with loading indicators

### User Experience

- **Responsive Design**: Mobile-first approach with responsive layouts
- **Arabic Interface**: Full Arabic language support with RTL layout
- **Loading States**: Dynamic loading messages with rotation
- **Error Handling**: Comprehensive error messages with retry suggestions

### Technical Features

- **Retry Mechanism**: Automatic retry with exponential backoff for failed requests
- **Request Timeout**: 20-second timeout protection against hanging requests
- **SSL Bypass**: Configured for internal network communication
- **Graceful Shutdown**: Proper signal handling for production deployment

### Result Display

- **Structured Results**: Clean table layout for result information
- **Status Indicators**: Visual pass/fail indicators with color coding
- **Official Verification**: Clear indication of official result source
- **Comprehensive Details**: Student name, school, governorate, total marks, and status

## Setup Instructions

### Prerequisites

- Bun.js runtime installed
- Docker (optional, for containerized deployment)

### Local Development

1. **Install Dependencies**

   ```bash
   bun install
   ```

2. **Run Development Server**

   ```bash
   bun run dev
   ```

3. **Access Application**
   Open http://localhost:3000 in your browser

### Docker Deployment

1. **Build Docker Image**

   ```bash
   docker build -t waq3-natiga .
   ```

2. **Run Container**
   ```bash
   docker run -p 3000:3000 waq3-natiga
   ```

### Environment Configuration

The application uses the following environment variables:

- `PORT` - Server port (default: 3000)
- `NODE_TLS_REJECT_UNAUTHORIZED` - SSL verification setting (set to "0" for internal networks)

## Key Design Considerations

### Performance

- **Bun Runtime**: Utilizes Bun's high-performance JavaScript execution
- **Minimal Dependencies**: Lightweight framework stack for fast startup
- **Efficient Bundling**: Optimized build process with multi-stage Docker builds

### Reliability

- **Retry Strategy**: Multiple retry attempts with intelligent backoff
- **Error Recovery**: Comprehensive error handling with user-friendly messages
- **Health Monitoring**: Built-in health endpoints for system monitoring

### Scalability

- **Stateless Design**: No server-side session management
- **Container Ready**: Docker configuration for easy scaling
- **Edge Compatible**: Hono framework designed for edge deployment

### Security

- **Input Validation**: Server-side validation for all user inputs
- **CORS Configuration**: Proper origin handling for external API calls
- **Error Sanitization**: Safe error message display without sensitive information

### Accessibility

- **RTL Support**: Native Arabic right-to-left text direction
- **Semantic HTML**: Proper HTML structure for screen readers
- **Keyboard Navigation**: Full keyboard accessibility support
- **Color Contrast**: High contrast design for visual accessibility

## API Integration

The application integrates with the official Al-Azhar examination results API:

- **Endpoint**: `https://natiga.azhar.eg/WebService1.asmx/GetResult`
- **Method**: POST with JSON payload
- **Authentication**: Uses proper headers and user agent strings
- **Rate Limiting**: Implements respectful retry patterns

## Contributing

This project follows standard TypeScript and React development practices. When contributing:

- Maintain Arabic language support
- Ensure responsive design compatibility
- Add proper error handling for new features
- Follow the existing code style and structure
