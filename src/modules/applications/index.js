/**
 * Applications Module — Public API
 *
 * Only import from this file when using the applications module
 * from outside its own directory.
 *
 * @module applications
 */

// Page component (used by router)
export { default as ApplicationsPage } from './ApplicationsPage';

// Hook (used by AppContext orchestrator and Analytics read)
export { useApplications } from './hooks/useApplications';

// Constants (used by shared search or cross-module filters)
export { APPLICATION_STATUSES, PLATFORMS, WORK_MODES } from './constants';
