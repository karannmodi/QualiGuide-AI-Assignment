# Migration Notes

The single-file Artifact was separated into:

- `src/data/sampleData.jsx` for sample documents, personas, form defaults, and options
- `src/utils/qualiguide.js` for IDs, document matching, and NCR generation
- `src/components/` for each major screen and reusable feedback functionality
- `src/styles/qualiguide.css` for the original visual design
- `src/App.jsx` for shared application state and view selection

No feature enhancements were added. Browser persistence remains intentionally disabled for this migration stage.
