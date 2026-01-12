# Future Coding Challenges

## Overview

Curated list of frontend coding challenges to add to FEMaster. Organized by domain, difficulty, and priority.

---

## 1. React & Component Architecture

### Design Patterns

#### Higher-Order Component (HOC) Pattern

- **Difficulty**: Mid
- **Subcategory**: design-patterns
- **Description**: Implement a `withAuth` HOC that adds authentication logic to components
- **Learning Goals**: Component composition, props forwarding, TypeScript generics
- **Demo**: Login/protected route simulation
- **Priority**: High

#### Render Props Pattern

- **Difficulty**: Mid
- **Subcategory**: design-patterns
- **Description**: Create a `MouseTracker` component using render props pattern
- **Learning Goals**: Inversion of control, code reuse without HOCs
- **Demo**: Interactive mouse position tracker
- **Priority**: High

#### Controlled vs Uncontrolled Components

- **Difficulty**: Mid
- **Subcategory**: design-patterns
- **Description**: Build a form library supporting both controlled and uncontrolled inputs
- **Learning Goals**: Refs, form state management, validation
- **Demo**: Form with mixed input types
- **Priority**: Medium

#### Portal Pattern

- **Difficulty**: Mid
- **Subcategory**: design-patterns
- **Description**: Implement a Modal component using React portals
- **Learning Goals**: DOM structure, event bubbling, portals
- **Demo**: Nested modals with backdrop
- **Priority**: High

### State Management

#### Undo/Redo System

- **Difficulty**: Senior
- **Subcategory**: state-management
- **Description**: Implement undo/redo for a drawing canvas
- **Learning Goals**: Command pattern, state history, immutability
- **Demo**: Drawing app with undo/redo
- **Priority**: High

#### Context API with useReducer

- **Difficulty**: Mid
- **Subcategory**: state-management
- **Description**: Build a shopping cart with Context API and useReducer
- **Learning Goals**: Global state, reducers, TypeScript with Context
- **Demo**: E-commerce cart
- **Priority**: High

#### Optimistic Updates

- **Difficulty**: Senior
- **Subcategory**: state-management
- **Description**: Implement optimistic UI updates with rollback on error
- **Learning Goals**: UX patterns, error handling, state reconciliation
- **Demo**: Todo list with API simulation
- **Priority**: Medium

#### State Machine (XState-like)

- **Difficulty**: Senior
- **Subcategory**: state-management
- **Description**: Implement a finite state machine for form wizard
- **Learning Goals**: FSM, state transitions, validation
- **Demo**: Multi-step form
- **Priority**: Low

### Recursive UI

#### File Explorer

- **Difficulty**: Mid
- **Subcategory**: recursive-ui
- **Description**: Build a file/folder tree with expand/collapse
- **Learning Goals**: Recursion, tree traversal, UI patterns
- **Demo**: Interactive file system
- **Priority**: High

#### Drag-and-Drop Tree

- **Difficulty**: Senior
- **Subcategory**: recursive-ui
- **Description**: Add drag-and-drop to nested tree structure
- **Learning Goals**: DnD API, tree mutations, event handling
- **Demo**: Sortable nested lists
- **Priority**: Medium

#### Nested Dropdown Menu

- **Difficulty**: Mid
- **Subcategory**: recursive-ui
- **Description**: Create nested dropdown with keyboard navigation
- **Learning Goals**: Recursion, a11y, keyboard events
- **Demo**: Multi-level menu
- **Priority**: Medium

---

## 2. Performance & Scalability

### Rendering Optimization

#### React.memo and useMemo Strategy

- **Difficulty**: Mid
- **Subcategory**: rendering-optimization
- **Description**: Optimize a slow list with proper memoization
- **Learning Goals**: Profiling, memo strategies, re-render optimization
- **Demo**: Before/after performance comparison
- **Priority**: High

#### Infinite Scroll

- **Difficulty**: Mid
- **Subcategory**: rendering-optimization
- **Description**: Implement infinite scroll with pagination
- **Learning Goals**: Intersection Observer, data fetching, loading states
- **Demo**: Image gallery with infinite scroll
- **Priority**: High

#### Lazy Loading with Suspense

- **Difficulty**: Mid
- **Subcategory**: rendering-optimization
- **Description**: Implement code splitting and lazy loading for routes
- **Learning Goals**: React.lazy, Suspense, error boundaries
- **Demo**: Multi-route app with loading states
- **Priority**: Medium

#### React Server Components (RSC)

- **Difficulty**: Senior
- **Subcategory**: rendering-optimization
- **Description**: Convert client components to RSC where appropriate
- **Learning Goals**: Server vs client components, streaming, data fetching
- **Demo**: Blog with RSC
- **Priority**: Low (Next.js specific)

### Network & Caching

#### useThrottle Hook

- **Difficulty**: Mid
- **Subcategory**: network-caching
- **Description**: Implement throttling for scroll/resize events
- **Learning Goals**: Throttling vs debouncing, event optimization
- **Demo**: Scroll position tracker
- **Priority**: High

#### Request Deduplication

- **Difficulty**: Senior
- **Subcategory**: network-caching
- **Description**: Deduplicate simultaneous identical API requests
- **Learning Goals**: Request caching, Promise management
- **Demo**: Multiple components fetching same data
- **Priority**: Medium

#### Stale-While-Revalidate Pattern

- **Difficulty**: Senior
- **Subcategory**: network-caching
- **Description**: Implement SWR pattern like React Query
- **Learning Goals**: Cache strategies, background refetching
- **Demo**: News feed with SWR
- **Priority**: High

#### Offline-First with Service Worker

- **Difficulty**: Senior
- **Subcategory**: network-caching
- **Description**: Implement offline support with cache strategies
- **Learning Goals**: Service workers, cache API, sync
- **Demo**: PWA with offline mode
- **Priority**: Medium

### Offloading Computation

#### Web Worker Pool

- **Difficulty**: Senior
- **Subcategory**: offloading-computation
- **Description**: Create a pool of web workers for parallel tasks
- **Learning Goals**: Worker management, task queue, parallelization
- **Demo**: Image processing pipeline
- **Priority**: Medium

#### RequestIdleCallback Scheduling

- **Difficulty**: Mid
- **Subcategory**: offloading-computation
- **Description**: Defer non-critical work using requestIdleCallback
- **Learning Goals**: Browser scheduling, priority management
- **Demo**: Background data processing
- **Priority**: Low

#### Incremental Rendering

- **Difficulty**: Senior
- **Subcategory**: offloading-computation
- **Description**: Break large render into chunks with scheduler
- **Learning Goals**: Time slicing, concurrent rendering
- **Demo**: Large dataset rendering
- **Priority**: Low

---

## 3. Core CS & JavaScript

### Data Structures

#### Trie (Prefix Tree)

- **Difficulty**: Senior
- **Subcategory**: data-structures
- **Description**: Implement autocomplete using Trie
- **Learning Goals**: Trie structure, prefix search, optimization
- **Demo**: Search bar with autocomplete
- **Priority**: High

#### Doubly Linked List

- **Difficulty**: Mid
- **Subcategory**: data-structures
- **Description**: Implement doubly linked list with operations
- **Learning Goals**: Pointers, insertion/deletion, edge cases
- **Demo**: Music playlist (prev/next)
- **Priority**: Medium

#### Priority Queue (Min/Max Heap)

- **Difficulty**: Senior
- **Subcategory**: data-structures
- **Description**: Implement priority queue for task scheduler
- **Learning Goals**: Heap operations, time complexity
- **Demo**: Task priority visualization
- **Priority**: Medium

#### Graph Representation & BFS/DFS

- **Difficulty**: Senior
- **Subcategory**: data-structures
- **Description**: Implement graph and traversal algorithms
- **Learning Goals**: Adjacency list/matrix, graph traversal
- **Demo**: Social network connections
- **Priority**: Medium

### Asynchronous Flow

#### Promise.all/race/allSettled Polyfills

- **Difficulty**: Mid
- **Subcategory**: async-flow
- **Description**: Implement Promise combinator methods
- **Learning Goals**: Promise API, error handling, concurrency
- **Demo**: Parallel API requests
- **Priority**: High

#### Async Queue with Concurrency Limit

- **Difficulty**: Senior
- **Subcategory**: async-flow
- **Description**: Process async tasks with max N concurrent
- **Learning Goals**: Queue management, concurrency control
- **Demo**: Image upload queue
- **Priority**: High

#### Retry with Exponential Backoff

- **Difficulty**: Mid
- **Subcategory**: async-flow
- **Description**: Implement retry logic with backoff strategy
- **Learning Goals**: Error recovery, timing, exponential growth
- **Demo**: Flaky API simulation
- **Priority**: High

#### AbortController for Request Cancellation

- **Difficulty**: Mid
- **Subcategory**: async-flow
- **Description**: Implement request cancellation with AbortController
- **Learning Goals**: Cancellation patterns, cleanup
- **Demo**: Search with request cancellation
- **Priority**: Medium

### Object & Logic

#### Deep Clone

- **Difficulty**: Mid
- **Subcategory**: object-logic
- **Description**: Implement deep clone handling circular references
- **Learning Goals**: Recursion, WeakMap, object traversal
- **Demo**: Clone complex object
- **Priority**: High

#### Deep Equal

- **Difficulty**: Mid
- **Subcategory**: object-logic
- **Description**: Implement deep equality comparison
- **Learning Goals**: Recursion, type checking, edge cases
- **Demo**: Object comparison visualizer
- **Priority**: Medium

#### Get/Set by Path (lodash.get/set)

- **Difficulty**: Mid
- **Subcategory**: object-logic
- **Description**: Access nested properties with path string
- **Learning Goals**: String parsing, object traversal, edge cases
- **Demo**: Form field access
- **Priority**: High

#### Curry Function

- **Difficulty**: Mid
- **Subcategory**: object-logic
- **Description**: Implement function currying with TypeScript types
- **Learning Goals**: Closures, partial application, type inference
- **Demo**: Calculator with curried operations
- **Priority**: Medium

#### Pipe/Compose Functions

- **Difficulty**: Mid
- **Subcategory**: object-logic
- **Description**: Implement function composition utilities
- **Learning Goals**: Functional programming, type safety
- **Demo**: Data transformation pipeline
- **Priority**: Medium

---

## 4. Custom Hooks & Browser API

### DOM Interaction

#### useIntersectionObserver

- **Difficulty**: Mid
- **Subcategory**: dom-interaction
- **Description**: Create hook for intersection detection
- **Learning Goals**: Intersection Observer API, cleanup, refs
- **Demo**: Lazy load images
- **Priority**: High

#### useResizeObserver

- **Difficulty**: Mid
- **Subcategory**: dom-interaction
- **Description**: Create hook for element resize detection
- **Learning Goals**: Resize Observer API, performance
- **Demo**: Responsive chart
- **Priority**: High

#### useMutationObserver

- **Difficulty**: Mid
- **Subcategory**: dom-interaction
- **Description**: Watch DOM changes with MutationObserver
- **Learning Goals**: Mutation Observer API, cleanup
- **Demo**: Dynamic content watcher
- **Priority**: Low

#### useClickOutside

- **Difficulty**: Mid
- **Subcategory**: dom-interaction
- **Description**: Detect clicks outside element
- **Learning Goals**: Event handling, refs, portals
- **Demo**: Dropdown that closes on outside click
- **Priority**: High

#### useDragAndDrop

- **Difficulty**: Senior
- **Subcategory**: dom-interaction
- **Description**: Generic drag-and-drop hook
- **Learning Goals**: DnD events, coordinates, state management
- **Demo**: Kanban board
- **Priority**: High

### Event Systems

#### Event Emitter (Pub/Sub)

- **Difficulty**: Mid
- **Subcategory**: event-systems
- **Description**: Implement EventEmitter class with TypeScript
- **Learning Goals**: Observer pattern, event management
- **Demo**: Cross-component messaging
- **Priority**: High

#### Custom Event Bus

- **Difficulty**: Mid
- **Subcategory**: event-systems
- **Description**: Create global event bus for React
- **Learning Goals**: Custom events, decoupling
- **Demo**: Analytics tracking
- **Priority**: Medium

#### Keyboard Shortcuts Manager

- **Difficulty**: Mid
- **Subcategory**: event-systems
- **Description**: Implement keyboard shortcut system
- **Learning Goals**: Keyboard events, combo detection, conflicts
- **Demo**: Shortcut-enabled app
- **Priority**: Medium

#### Gesture Recognition

- **Difficulty**: Senior
- **Subcategory**: event-systems
- **Description**: Detect swipe, pinch, rotate gestures
- **Learning Goals**: Touch events, gesture calculation
- **Demo**: Touch-enabled photo viewer
- **Priority**: Low

---

## 5. Advanced/System Design Challenges

### Architecture

#### Micro-Frontend Communication

- **Difficulty**: Senior
- **Description**: Implement communication between micro-frontends
- **Learning Goals**: Module federation, messaging, isolation
- **Priority**: Low

#### Design System Architecture

- **Difficulty**: Senior
- **Description**: Design and implement scalable component system
- **Learning Goals**: Design tokens, theming, variants
- **Priority**: Low

#### Plugin System

- **Difficulty**: Senior
- **Description**: Create extensible plugin architecture
- **Learning Goals**: Lifecycle hooks, dependency injection
- **Priority**: Low

### Real-World Scenarios

#### Form Builder

- **Difficulty**: Senior
- **Description**: Create drag-and-drop form builder
- **Learning Goals**: Schema validation, dynamic rendering
- **Demo**: Visual form builder
- **Priority**: Medium

#### Rich Text Editor

- **Difficulty**: Senior
- **Description**: Implement contenteditable-based editor
- **Learning Goals**: Selection API, contenteditable, commands
- **Demo**: WYSIWYG editor
- **Priority**: Medium

#### Real-Time Collaboration

- **Difficulty**: Senior
- **Description**: Implement collaborative editing with OT/CRDT
- **Learning Goals**: Operational transformation, WebSockets
- **Demo**: Collaborative document
- **Priority**: Low

#### Data Grid

- **Difficulty**: Senior
- **Description**: Build feature-rich data table
- **Learning Goals**: Virtualization, sorting, filtering, grouping
- **Demo**: Advanced table with features
- **Priority**: High

---

## 6. Testing & Quality Challenges

### Testing Patterns

#### Custom Testing Library

- **Difficulty**: Senior
- **Description**: Build simplified testing framework
- **Learning Goals**: Test runners, assertions, mocking
- **Priority**: Low

#### Mock Service Worker Setup

- **Difficulty**: Mid
- **Description**: Set up API mocking for tests
- **Learning Goals**: MSW, test isolation, fixtures
- **Priority**: Low

---

## 7. Accessibility Challenges

#### Screen Reader Navigation

- **Difficulty**: Mid
- **Description**: Build accessible navigation with ARIA
- **Learning Goals**: ARIA attributes, roles, keyboard nav
- **Demo**: Accessible menu system
- **Priority**: Medium

#### Focus Management

- **Difficulty**: Mid
- **Description**: Implement focus trap for modals
- **Learning Goals**: Focus management, tab order
- **Demo**: Modal with focus trap
- **Priority**: Medium

---

## Implementation Priority

### Phase 1 (Next 10 Challenges)

1. Portal Pattern (Modal)
2. Context API with useReducer
3. Lazy Loading with Suspense
4. useThrottle Hook
5. Stale-While-Revalidate Pattern
6. Trie (Autocomplete)
7. Promise.all/race/allSettled
8. Async Queue with Concurrency
9. Retry with Exponential Backoff
10. Deep Clone

### Phase 2 (Next 15 Challenges)

11. Get/Set by Path
12. useIntersectionObserver
13. useResizeObserver
14. useClickOutside
15. useDragAndDrop
16. Event Emitter
17. Keyboard Shortcuts Manager
18. Data Grid
19. Form Builder
20. Controlled vs Uncontrolled Components
21. Drag-and-Drop Tree
22. Nested Dropdown Menu
23. Request Deduplication
24. Offline-First with Service Worker
25. Web Worker Pool

### Phase 3 (Long-term)

26-50. Remaining challenges based on user feedback and demand

---

## Challenge Template

When adding new challenges, use this structure:

```json
{
  "id": "challenge-slug",
  "title": "Challenge Title",
  "domain": "domain-id",
  "subcategory": "subcategory-id",
  "difficulty": "Mid" | "Senior",
  "statement": "Problem description...",
  "constraints": ["Constraint 1", "Constraint 2"],
  "complexity": "Time: O(n), Space: O(1)",
  "code": "// Solution code...",
  "language": "typescript" | "tsx" | "javascript",
  "commonMistakes": ["Mistake 1", "Mistake 2"],
  "demoComponentKey": "DemoComponentName"
}
```

---

## Contribution Guidelines

### Adding a New Challenge

1. Choose appropriate domain and subcategory
2. Write clear problem statement (bilingual if needed)
3. Implement optimal solution with comments
4. Add complexity analysis
5. Document common mistakes
6. Create interactive demo component
7. Add test cases
8. Submit for review

### Quality Checklist

- [ ] Problem is clear and unambiguous
- [ ] Solution is optimal and well-commented
- [ ] Code follows project style guide
- [ ] Common mistakes are documented
- [ ] Demo is interactive and educational
- [ ] Complexity analysis is accurate
- [ ] Edge cases are handled
- [ ] TypeScript types are correct

---

Last updated: 2026-01-13
