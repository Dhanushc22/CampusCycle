# CampusCycle: Sustainable Student Marketplace

## Overview

CampusCycle is a full-stack web application designed to create a sustainable student marketplace where students can buy, sell, exchange, and donate items and services within their campus community. The platform promotes circular economy principles by encouraging resource reuse, features an EcoPoints reward system for sustainable actions, and includes real-time messaging for seamless communication between users.

The application targets university students exclusively, requiring verification through college email addresses to ensure a trusted, student-only environment. It combines marketplace functionality with social features like user ratings, reviews, and a comprehensive dashboard to track sustainability impact.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client is built as a single-page application using React 18 with TypeScript. The UI framework leverages Radix UI primitives with shadcn/ui components for consistent design patterns. The application uses Wouter for lightweight client-side routing and TanStack Query for server state management and caching.

Key architectural decisions:
- **Component Structure**: Organized into reusable UI components, page components, and feature-specific components
- **State Management**: TanStack Query handles server state, while React's built-in state manages local UI state
- **Styling**: Tailwind CSS with CSS custom properties for theming and consistent design tokens
- **Type Safety**: Full TypeScript coverage with shared type definitions between client and server

### Backend Architecture
The server follows a RESTful API design built with Express.js and TypeScript. The architecture separates concerns into distinct layers:

- **Route Layer**: Handles HTTP request/response logic and validation
- **Storage Layer**: Abstracts database operations with a clean interface
- **Authentication Layer**: Integrates with Replit's OpenID Connect for secure user authentication
- **WebSocket Layer**: Provides real-time messaging capabilities

Key design patterns:
- **Repository Pattern**: Storage interface abstracts database implementation details
- **Middleware Pipeline**: Express middleware handles authentication, logging, and error handling
- **Session Management**: Uses PostgreSQL-backed sessions with connect-pg-simple

### Data Storage
The application uses PostgreSQL as the primary database with Drizzle ORM for type-safe database operations:

- **Schema Design**: Normalized relational schema with proper foreign key relationships
- **Type Safety**: Drizzle generates TypeScript types from database schema
- **Migrations**: Schema changes managed through Drizzle migrations
- **Connection Pooling**: Neon serverless PostgreSQL with connection pooling

Core entities include Users, Products, Services, Conversations, Messages, Transactions, and Reviews, with proper relationships and constraints to maintain data integrity.

### Authentication & Authorization
The system implements Replit's OpenID Connect authentication:

- **Single Sign-On**: Leverages Replit's identity provider for seamless authentication
- **Session Management**: Server-side sessions stored in PostgreSQL
- **User Verification**: Automatic user profile creation and updates from OIDC claims
- **Route Protection**: Authentication middleware protects sensitive API endpoints

### Real-time Communication
WebSocket integration enables real-time messaging:

- **Bidirectional Communication**: WebSocket connections for instant message delivery
- **Connection Management**: Proper connection lifecycle handling and cleanup
- **Message Persistence**: All messages stored in PostgreSQL for history and reliability

## External Dependencies

### Database Services
- **Neon PostgreSQL**: Serverless PostgreSQL database with connection pooling
- **connect-pg-simple**: PostgreSQL session store for Express sessions

### Authentication Services  
- **Replit Auth**: OpenID Connect integration for user authentication and identity management

### Frontend Libraries
- **Radix UI**: Accessible component primitives for consistent UI patterns
- **shadcn/ui**: Pre-built component library with customizable styling
- **TanStack Query**: Server state management, caching, and synchronization
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Wouter**: Lightweight client-side routing

### Backend Libraries
- **Express.js**: Web application framework for Node.js
- **Drizzle ORM**: Type-safe PostgreSQL ORM with migration support
- **WebSocket (ws)**: Real-time bidirectional communication
- **Passport**: Authentication middleware with OpenID Connect strategy

### Development Tools
- **Vite**: Build tool and development server with hot module replacement
- **TypeScript**: Type safety across the entire application stack
- **ESBuild**: Fast JavaScript bundler for production builds