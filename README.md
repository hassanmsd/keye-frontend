# Project Structure & Overview

This React project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Project Folder Structure

- **`/pages`**  
  Contains the main page components for the app, each representing a route or view.

- **`/modules`**  
  Contains feature-specific modules — collections of components and logic related to a particular feature or section of the app.

- **`/components`**  
  Contains reusable UI components that can be shared across different pages and modules.

- **`/hooks`**  
  Contains reusable custom React hooks that encapsulate logic and state management across the app.

- **`/api`**  
  Contains functions and modules responsible for API calls and backend communication.

- **`/constants`**  
  Stores global constant values used throughout the app, such as enums, strings, or config values.

- **`/types`**  
  Contains TypeScript global types and interfaces for the project.

- **`/utils`**  
  Contains helper functions and utilities used across the app.

---

## Key Parts of the Implementation

- **`Hook-Based State Management`**  
  useSpreadsheet: Manages spreadsheet rows and cellFormats, handles data loading from localStorage or API fallback, and saves updates persistently.

- **`Undo/Redo Functionality`**  
  useSpreadsheetHistory: Custom hook that tracks state history for undo and redo functionality, allowing easy navigation between previous spreadsheet states.

- **`Reusable UI Components`**

  - Contains reusable UI components that can be shared across different pages and modules.
  - Spreadsheet: Composes the grid, toolbar, and snackbar, and connects user interactions with formatting logic

- **`Dynamic Column Rendering`**  
  getSpreadsheetColumns: Dynamically creates column definitions with inline formatting logic based on per-cell styles.

- **`Persistent Storage`**  
  Uses localStorage to persist both spreadsheet data and cell formats, enabling session restoration. If no local data exists, it fetches from a fallback API.

- **`Sorting, Filtering, and Resizing`**

  - Users can resize columns by hovering over the edge of a column header and dragging.
  - Users can sort or filter columns by clicking the three-dot menu in the header of each column.

- **`Backend Integration`**  
  Fetches growth data from a backend API built with NestJS to populate the spreadsheet

- **`Documentation`**  
  Added comments throughout the codebase wherever necessary

---

## Assumptions and Design Decisions

- **`Local Storage as Primary Cache`**  
  Persisting spreadsheet data (rows and formatting) in localStorage is sufficient for session continuity and offline support.

- **`Snapshot-based Undo/Redo`**  
  Implemented undo/redo functionality using immutable snapshots of both rows and cell formats via a custom hook (useSpreadsheetHistory) for clean and reusable state management.

- **`Custom Hook for Spreadsheet Logic`**
  Encapsulated spreadsheet data fetching, state management, and formatting logic inside a custom hook (useSpreadsheet) to promote separation of concerns and easier testing.

- **`Cell-level Formatting Keys`**  
  Used composite keys (rowId_fieldName) to manage cell formatting states, enabling fine-grained formatting control per cell.

- **`Backend Data Source`**  
  Backend API (built with NestJS) provides well-structured data for initial load when no local storage data is present.

- **`UI Responsiveness`**
  Decided to use MUI DataGrid features for sorting, pagination, and resizing to keep UI flexible and user-friendly without reinventing these functionalities

- **`Toolbar Control States`**
  Toolbar buttons are disabled when no cell is selected, ensuring formatting actions only affect the intended cell

---

## Usage Notes

- The toolbar buttons remain disabled until a user selects a cell in the spreadsheet.

- Users can navigate through cells using arrow keys and copy text from any cell.

- To edit a cell, double-click the cell or select it and press Enter. Edits are saved when the user clicks outside the cell or presses Enter again. After editing, you can also copy and paste data.

- Currently, only a limited set of colors is available for cell text formatting, but this list can be expanded as needed.

- For sorting and filtering, hover over the column header cells to access menu options. You can also resize columns by dragging the column borders.

- The implementation currently does not include basic formula support (a bonus feature) due to time constraints, focusing instead on core functionality within the given 4-6 hour scope.

---

## Testing

- Unit tests written using Jest cover core hooks and components, including loading and saving data, formatting, and undo/redo functionality

- Tests use mocks for localStorage and API calls to isolate and verify behavior.

- Run tests with npm test or yarn test to verify everything works as expected.

---

## Description of what I would improve with more time

- Add Basic Formula Functionality: Implement simple spreadsheet formulas (like SUM, AVERAGE, etc.) to enhance data analysis capabilities directly within the grid.

- Expand Color Palette and Formatting Options: Increase the variety of colors and text formatting features to allow more customization.

- Enhance Undo/Redo UX: Improve the undo/redo experience by adding keyboard shortcuts for quicker user interaction

- Add comprehensive test cases covering all relevant scenarios, beyond just the major ones.

---

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
