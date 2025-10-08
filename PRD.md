# 60pportunities - Enterprise Architecture Management Platform

A TOGAF-aligned enterprise architecture management platform that provides complete visibility over applications, processes, data, technologies and their interdependencies for strategic decision-making.

## Experience Qualities
1. **Professional**: Clean, enterprise-grade interface that conveys trust and competence for C-level executives
2. **Insightful**: Data-rich visualizations that immediately surface key architectural insights and dependencies  
3. **Intuitive**: Complex enterprise data presented in digestible, actionable formats with minimal learning curve

## Complexity Level
**Complex Application** - Advanced functionality with multiple interconnected features, comprehensive data models, and sophisticated relationship mapping that supports enterprise-level decision making.

## Essential Features

### Application Portfolio Management
- **Functionality**: Complete application lifecycle and metadata management
- **Purpose**: Maintain single source of truth for all enterprise applications
- **Trigger**: Architect accesses application registry or adds new system
- **Progression**: Navigate applications → View/create application → Edit details → Associate capabilities/technologies → Save changes → View dashboard
- **Success criteria**: 100% critical applications catalogued with complete metadata

### Business Capability Mapping  
- **Functionality**: Hierarchical capability modeling with application associations
- **Purpose**: Connect business strategy to supporting technology systems
- **Trigger**: Business architect defines new capability or reviews existing mapping
- **Progression**: Access capabilities → Create/edit capability → Define hierarchy → Link applications → Set criticality → Visualize coverage
- **Success criteria**: Clear visualization of capability-application relationships with gap identification

### Interface & Dependency Analysis
- **Functionality**: Map and analyze system integrations and dependencies
- **Purpose**: Understand impact of changes and identify architectural risks
- **Trigger**: Impact analysis needed for system change or integration planning
- **Progression**: Select application → View dependencies → Analyze impact graph → Identify affected systems → Export analysis report
- **Success criteria**: Complete dependency mapping enabling informed change decisions

### Technology Risk Management
- **Functionality**: Track technology lifecycle and obsolescence risks
- **Purpose**: Proactively manage technical debt and platform migration needs
- **Trigger**: Regular risk assessment or technology evaluation cycle
- **Progression**: Review technology inventory → Identify obsolescent platforms → Assess application impact → Plan migration roadmap
- **Success criteria**: Proactive identification of technology risks before critical failures

## Edge Case Handling
- **Invalid data entry**: Real-time validation with clear error messaging
- **Circular dependencies**: Detection and prevention with visual indicators  
- **Missing relationships**: Automated gap identification and suggestions
- **Large dataset performance**: Virtualized rendering and progressive loading
- **Concurrent edits**: Optimistic locking with conflict resolution

## Design Direction
The design should feel authoritative and data-driven, conveying enterprise-grade reliability while remaining accessible. A rich interface better serves the complex analytical needs, featuring comprehensive dashboards, detailed forms, and sophisticated visualizations that enterprise architects expect.

## Color Selection
**Complementary (opposite colors)** - Using deep blue primary with warm orange accents to create strong contrast that aids in data differentiation while maintaining professional credibility expected in enterprise software.

- **Primary Color**: Deep Professional Blue (oklch(0.45 0.15 260)) - Communicates trust, stability and expertise
- **Secondary Colors**: Cool Gray (oklch(0.85 0.02 260)) for backgrounds, Darker Blue (oklch(0.25 0.15 260)) for text
- **Accent Color**: Warm Orange (oklch(0.7 0.18 45)) for CTAs, alerts, and highlighting critical information
- **Foreground/Background Pairings**:
  - Background (White oklch(1 0 0)): Dark Blue text (oklch(0.25 0.15 260)) - Ratio 8.2:1 ✓
  - Card (Light Gray oklch(0.98 0.01 260)): Dark Blue text (oklch(0.25 0.15 260)) - Ratio 7.8:1 ✓  
  - Primary (Deep Blue oklch(0.45 0.15 260)): White text (oklch(1 0 0)) - Ratio 6.1:1 ✓
  - Accent (Warm Orange oklch(0.7 0.18 45)): White text (oklch(1 0 0)) - Ratio 4.9:1 ✓

## Font Selection
Typography should project competence and clarity for complex data presentation, using Inter for its excellent readability at various sizes and professional appearance suitable for enterprise dashboards and detailed forms.

- **Typographic Hierarchy**:
  - H1 (Page Title): Inter Bold/32px/tight letter spacing
  - H2 (Section Headers): Inter Semibold/24px/normal letter spacing  
  - H3 (Card Titles): Inter Medium/18px/normal letter spacing
  - Body Text: Inter Regular/16px/relaxed line height
  - Caption/Meta: Inter Regular/14px/compact line height

## Animations
Subtle and purposeful animations that enhance enterprise productivity by providing clear state feedback and smooth transitions without distracting from critical data analysis tasks.

- **Purposeful Meaning**: Motion communicates system reliability and data relationships through smooth transitions that build confidence in the platform
- **Hierarchy of Movement**: Priority on loading states, form validation feedback, and relationship visualization animations over decorative effects

## Component Selection
- **Components**: Cards for application/capability summaries, Tables for detailed listings, Dialogs for forms, Tabs for multi-view data, Progress indicators for health scores, specialized graph components for dependency visualization
- **Customizations**: Enhanced data tables with sorting/filtering, interactive network graphs for dependencies, multi-select capability associations, hierarchical tree views for capabilities
- **States**: Clear loading states for complex queries, validation states for forms, hover states revealing additional context, selected states for graph navigation
- **Icon Selection**: Building blocks (applications), Network (integrations), Shield (security/compliance), Trend up/down (health metrics), Warning triangle (risks)
- **Spacing**: Consistent 16px base unit with 8px for tight spacing, 24px for section separation, 32px for major layout divisions
- **Mobile**: Collapsible sidebar navigation, stacked card layouts, simplified graph interactions, priority information surfaced first with progressive disclosure