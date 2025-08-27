# UI/UX (eng)

# SRFP Management System - UX/UI Requirements

## Overview

The Shipment Request for Proposals (SRFP) system enables logistics professionals to create, manage, and finalize shipping contracts through a structured three-stage workflow. The interface must accommodate two distinct user roles—logists (document owners) and carriers (bidders/contractors)—while maintaining clear visibility into document state and relevant data at each lifecycle stage.

## Core Design Principles

### Space-Efficient Progressive Disclosure

The interface should present all decision-critical information within a single view for each stage, utilizing collapsible sections rather than tab-based navigation. Users must understand the complete picture without context switching between major interface sections.

### Status-Driven Interface Adaptation

Document status acts as a read-only system state that drives interface behavior. User actions trigger status transitions (e.g., "Publish" action changes status to `PUBLISHED`), with the interface adapting accordingly to show/hide relevant controls and data sections.

### Role-Based Data Visibility

Carriers see only General and Route data plus their own bid during bidding stage, while logists have comprehensive visibility across all sections appropriate to the current stage.

## Stage-Specific Interface Requirements

### Stage 1: Inception (Statuses: new, draft, paused, declined)

**Visible to:** Logist only\n**Primary sections:** General, Route

* **Layout:** Two-column layout with General section (left) and Route section (right)
* **General Section:** Standard form layout using appropriate input components (TextInput, NumberInput, Select, DatePicker, etc.) with logical field grouping via Paper components or fieldsets
* **Route Section:** an interactive form visually associated with the real process of transporting cargo between specified geographic points.
  * Creation/editing of route points includes selecting a warehouse, entering an address, or specifying a point on the map.
  * Each point can have any number of cargo items added, with the type of handling at that point specified (loading/unloading).
  * Each cargo item is described by a small set of simple attributes.
* **Map Integration:** Secondary visualization using embedded map component showing route waypoints, positioned below or alongside the route form
* **Actions:** Floating ActionIcon or Button group for save/publish/delete operations

### Stage 2: Bidding (Statuses: published, stopped, cancelled)

**Visible to:** Both roles with different perspectives\n**Primary sections:** General (read-only), Route (read-only), Bidding

#### Logist View

* **Layout:** Three-column layout with General (left), Route (center), Bidding (right, expanded)
* **Bidding Section:** Card-based layout for individual bids with:
  * Badge components for bid rating indicators
  * Progress indicators for bid comparison metrics
  * ActionIcon buttons for bid management (accept/compare)
* **Gamification Elements:**
  * RingProgress or similar for bid scoring visualization
  * Spotlight highlighting for top-performing bids
  * Notification badges for new/updated bids

#### Carrier View

* **Layout:** Two-column with General/Route (left, collapsed/summarized) and Bid Form (right, prominent)
* **Bid Form:** Standard form layout in Modal or dedicated Panel
* **Submission State:** Clear visual feedback using Alert components for submission status

#### Optional Direct Assignment Flow

* Toggle or Switch component during inception to bypass bidding
* Streamlined carrier selection via Select component
* Direct transition to contracting stage

### Stage 3: Contracting (Statuses: assigned, accepted, closed)

**Primary sections:** General (reference), Route (minimized), Contract (prominent)

* **Layout:** Two-column with Contract section taking 70% width, General/Route summary in sidebar
* **Contract Section:** Collaborative editing interface using:
  * Fieldset components grouping related fields
  * Badge indicators showing field ownership (logist vs carrier editable)
  * Comments or notifications system for collaborative updates
  * Version history via Timeline component
* **Route Reference:** Accordion component for collapsible route summary
* **Document Finalization:** Prominent Button for contract signing/closure
* **Bidding Section:** Should be accessible on-demand as a readonly history (overall not relevant at this point)

## Component Specifications

### Navigation & State Management

* **AppShell** with Header showing current stage and status Badge
* **Progress** indicator showing overall SRFP completion
* **Notifications** system for status changes and updates

### Data Display Components

* **Table** with sorting/filtering for bid listings
* **Card** components for individual bids and cargo items
* **Timeline** for process history
* **Accordion** for collapsible data sections
* **Paper** components for logical section grouping

### Interactive Elements

* **Autocomplete** for warehouse/address selection
* **DatePicker** and **TimeInput** for scheduling
* **NumberInput** with steppers for quantities/weights
* **Select** and **MultiSelect** for categorical data
* **Switch/Checkbox/Chip** for boolean preferences
* **ActionIcon** groups for quick actions
* **Button** components with appropriate variants for primary actions

### Feedback & Status

* **Badge** components for status indicators
* **Alert** for important messages and errors
* **RingProgress** for bid scoring and completion tracking
* **Skeleton** loaders for async data loading
* **Modal** for confirmations and detailed views

## Responsive Behavior

* **Desktop:** Multi-column layouts as specified above
* **Tablet:** Collapsible sidebar navigation with single-column content flow
* **Mobile:** Stack-based layout with prominent stage indicators and action buttons

## Interaction Patterns

### State Transitions

* Confirmation Modal for destructive actions (cancel, reject)
* Loading states with Skeleton components during status changes
* Success notifications via Notifications API for completed actions

### Data Validation

* Real-time validation with appropriate input states (error, valid)
* Form submission blocking with clear error messaging
* Required field indicators using asterisks or Badge components

### Collaborative Features

* Real-time updates via polling or WebSocket integration
* Optimistic updates with rollback on failure
* Conflict resolution through Alert components and user choice