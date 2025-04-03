# Health Insights App

## Project Overview
The Health Insights App is a human-centered mobile application built with React Native that helps users track, visualize, and maintain ownership of their personal health data. The app allows users to manually input key health metrics (steps, sleep hours, water intake, mood) and provides visualizations to help users understand patterns in their personal health data.

This project aligns with Track 1: Tools and interfaces for human/data-centered AI from the project proposal by creating a mobile interface that helps users control and explore their personal health data.

## Key Features

### Core Functionality
- Manual entry of daily health metrics
- Data visualization of health trends over time
- Basic insights based on user data patterns
- Data export functionality
- Privacy-focused design with local data storage

### Human-Centered & Data-Centered Elements

#### Participatory Features
The app includes several mechanisms for users to actively participate in and shape the system:

- **User Feedback System**: A dedicated feedback dialog (FeedbackDialog.js) allows users to rate the helpfulness of insights and provide qualitative feedback that can improve the system.
- **Context Annotation System**: Users can add context flags and notes (in DataEntryForm.js) to explain unusual data points, providing a richer understanding of their health patterns.
- **Impact Assessment**: The DataManagementScreen shows users how their data contributions affect insights, creating transparency in how their data is used.

#### Data Provenance Tracking
The app provides clear information about where insights come from and how they are generated:

- **Insight Source Badges**: A visual indicator (InsightSourceBadge.js) shows whether insights are derived from the user's own data, general guidelines, or research.
- **Confidence Indicators**: Each insight includes a confidence rating (ConfidenceIndicator.js) based on data completeness and consistency.
- **Metadata in Exports**: The enhanced export function (storage.js) includes provenance metadata detailing data collection methods and processing steps.

#### Ethical Data Handling
The app prioritizes user control over personal data:

- **Granular Privacy Controls**: Users can selectively delete data by date range or metric type (DataManagementScreen.js).
- **Transparent Data Retention**: Users can customize how long their data is stored on their device.
- **Data Impact Preview**: Before deletion, users can see how removing data will affect their insights.

#### Transparency Dashboard
The app explains how it works and the limitations of its insights:

- **How It Works Screen**: A dedicated screen (HowItWorksScreen.js) explains the data collection methodology, insight generation process, and limitations in plain language.
- **Limitations Disclosure**: The app is transparent about the scope and reliability of its recommendations.
- **Source Information**: Users can tap on information icons to learn more about the origin of specific insights.

#### User Control Enhancements
The app empowers users with greater control over their experience:

- **Customizable Health Metric Thresholds**: Users can define their own health goals and thresholds through the userPreferences.js utilities.
- **Context Flags**: Users can add relevant context (travel, illness, stress, etc.) to their data entries, helping them understand patterns.
- **Override Options**: Users can provide feedback on insights that don't seem relevant to their situation.

## Human-Centric AI Principles Integration

### Human-Centered Design (Shneiderman)
Ben Shneiderman emphasizes creating AI systems that are reliable, safe, and trustworthy. Our app applies these principles through:

- The Transparency Dashboard that explains how insights are generated
- User Control Enhancements that keep humans in the decision-making loop
- Clear confidence indicators that avoid misleading certainty

These features ensure users understand the system's capabilities and limitations, maintaining appropriate trust.

### Data Ownership and Agency
The app gives users complete control over their health data through:

- Comprehensive Data Provenance Tracking
- Ethical Data Handling with granular privacy controls
- Local-only storage by default
- Export options in multiple formats

This approach acknowledges that users should maintain ownership of their personal health information.

### Data Feminism and Inclusive Design
The principles of Data Feminism advocate for examining power dynamics in data collection and analysis. Our app addresses this through:

- Participatory Features that give users a voice in shaping the system
- Context Annotations that allow for qualitative narratives alongside quantitative data
- User-defined thresholds that avoid one-size-fits-all approaches to health

These features recognize that health experiences are diverse and contextual, avoiding oversimplified metrics.

### Critical Data Studies Perspective
Through transparent data practices and clear documentation, we encourage users to critically engage with their health data rather than accepting algorithmic outputs as absolute truth. Features that support this include:

- Clear source attribution for all insights
- Confidence indicators that communicate uncertainty
- Educational content about how insights are generated

## Technical Implementation
- Built with React Native for cross-platform compatibility
- Uses AsyncStorage for secure local data persistence
- Implements a modular component architecture for maintainability
- Features responsive design for various device sizes

## Privacy Commitment
The Health Insights App is built with privacy as a foundational principle. No data is transmitted to external servers without explicit user consent, and all processing occurs locally on the device.