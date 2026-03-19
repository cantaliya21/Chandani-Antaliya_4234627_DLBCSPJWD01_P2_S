# Test Cases Documentation

## Test Case Structure

| ID | Scenario | Steps | Expected Result | Status |
|----|----------|-------|------------------|--------|
| TC01 | Create Valid Task | 1. Enter task title in form<br>2. Optionally enter description<br>3. Click "Add Task" button | Task appears in task list immediately<br>Form clears<br>Task persists after page refresh | ✅ Pass |
| TC02 | Create Empty Task | 1. Leave title field empty<br>2. Click "Add Task" button | Validation error message displayed<br>Task is not created<br>Form remains with entered data | ✅ Pass |
| TC03 | Toggle Task Completion | 1. Click checkbox on an incomplete task<br>2. Observe task appearance | Task marked as completed<br>Visual indication (strikethrough, opacity change)<br>Status persists after refresh | ✅ Pass |
| TC04 | Toggle Completed Task | 1. Click checkbox on a completed task<br>2. Observe task appearance | Task marked as incomplete<br>Visual indication removed<br>Status persists after refresh | ✅ Pass |
| TC05 | Delete Task | 1. Click "Delete" button on a task<br>2. Confirm deletion in dialog | Task removed from list immediately<br>Task does not reappear after refresh | ✅ Pass |
| TC06 | Cancel Delete Task | 1. Click "Delete" button<br>2. Click "Cancel" in confirmation dialog | Task remains in list<br>No changes made | ✅ Pass |
| TC07 | Data Persistence | 1. Create multiple tasks<br>2. Toggle some tasks as completed<br>3. Refresh browser page | All tasks remain visible<br>Completion status preserved<br>Order maintained | ✅ Pass |
| TC08 | Responsive Design - Mobile | 1. Resize browser to mobile width (< 768px)<br>2. Observe layout changes | Form stacks vertically<br>Buttons become full-width<br>Larger touch targets<br>Text remains readable | ✅ Pass |
| TC09 | Responsive Design - Tablet | 1. Resize browser to tablet width (768px - 1024px)<br>2. Observe layout | Layout adapts appropriately<br>No horizontal scrolling<br>Elements properly spaced | ✅ Pass |
| TC10 | Backend Connection Error | 1. Stop backend server<br>2. Try to create a task | Error message displayed<br>User informed of connection issue<br>App remains functional (read-only) | ✅ Pass |
| TC11 | Multiple Rapid Actions | 1. Create task<br>2. Immediately toggle completion<br>3. Immediately delete | All actions execute correctly<br>No race conditions<br>UI updates properly | ✅ Pass |
| TC12 | Long Task Title | 1. Enter very long task title (> 100 characters)<br>2. Create task | Task created successfully<br>Text wraps appropriately<br>Layout remains intact | ✅ Pass |
| TC13 | Special Characters | 1. Enter task with special characters (!@#$%^&*)<br>2. Create task | Task created successfully<br>Characters displayed correctly<br>No encoding issues | ✅ Pass |

## Dynamic Backend Interactions Verified

### Interaction 1: Create Task (POST)
- **Component**: TaskForm.jsx
- **Method**: handleSubmit()
- **API Call**: POST /api/tasks
- **Verification**: Task appears in list, persists after refresh

### Interaction 2: Toggle Completion (PUT)
- **Component**: TaskItem.jsx
- **Method**: handleToggleComplete()
- **API Call**: PUT /api/tasks/:id
- **Verification**: Status changes, persists after refresh

### Bonus Interaction: Delete Task (DELETE)
- **Component**: TaskItem.jsx
- **Method**: handleDelete()
- **API Call**: DELETE /api/tasks/:id
- **Verification**: Task removed, persists after refresh

## Test Environment

- **Browser**: Chrome, Firefox, Safari, Edge (latest versions)
- **Screen Sizes**: Desktop (1920x1080), Tablet (768x1024), Mobile (375x667)
- **Node.js**: v18.x or higher
- **Backend**: Express server on port 3001
- **Frontend**: React app on port 3000

## Notes

- All test cases assume both backend and frontend servers are running
- Test cases cover both functional and UI/UX aspects
- Responsive design tests verify mobile-first approach
- Data persistence tests verify backend storage functionality
