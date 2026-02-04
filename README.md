# CNSLR Legal Platform

A TurboTax-style web application for handling everyday legal tasks. Simple, guided flows help users complete legal documents with confidence.

## Features

### Legal Tasks Included
- **Parking Ticket Appeals** - Contest unfair citations
- **Small Claims Court** - File claims up to your state's limit
- **Demand Letters** - Formal payment/action requests
- **Name Change Petitions** - Court filings for legal name changes
- **Landlord/Tenant Disputes** - Address repair, deposit, and habitability issues

### Key Features
- 📊 **Progress Tracking** - TurboTax-style progress bars and step indicators
- 💾 **Auto-Save** - Progress saved automatically in browser
- 📄 **Document Generation** - Professional PDF and Word documents
- ⚡ **E-File Ready** - Architecture supports future e-filing integrations
- 📱 **Responsive Design** - Works on desktop and mobile

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server (frontend + backend)
npm run dev

# Or start separately:
npm start          # Frontend only (port 3000)
npm run server     # Backend only (port 5000)
```

### Build for Production

```bash
npm run build
NODE_ENV=production npm run server
```

## Project Structure

```
cnslr-legal-platform/
├── public/
│   └── index.html
├── src/
│   ├── App.js              # Main app with routing
│   ├── index.js            # Entry point
│   ├── index.css           # Global styles
│   ├── data/
│   │   └── legalTasks.js   # Task definitions & form fields
│   └── pages/
│       ├── HomePage.js     # Landing page with task cards
│       ├── TaskWizard.js   # TurboTax-style wizard
│       └── SuccessPage.js  # Completion & download page
├── server/
│   ├── index.js            # Express API server
│   └── documentGenerators/
│       ├── pdfGenerator.js  # PDF document creation
│       └── docxGenerator.js # Word document creation
└── package.json
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/generate/pdf` | Generate PDF document |
| POST | `/api/generate/docx` | Generate Word document |
| POST | `/api/efile` | Submit for e-filing (mock) |
| GET | `/api/status/:id` | Check filing status |
| GET | `/api/health` | Health check |

## Adding New Legal Tasks

1. Add task definition to `src/data/legalTasks.js`:

```javascript
{
  id: 'new-task',
  title: 'Task Name',
  description: 'Description',
  icon: '📋',
  color: '#e0e7ff',
  estimatedTime: '10-15 minutes',
  eFileAvailable: false,
  steps: [
    { id: 'step-1', title: 'Step 1', description: 'First step' },
    { id: 'review', title: 'Review', description: 'Review & submit' }
  ],
  fields: {
    'step-1': [
      { name: 'fieldName', label: 'Field Label', type: 'text', required: true }
    ]
  }
}
```

2. Add document generator in `server/documentGenerators/pdfGenerator.js`

## E-Filing Integration

The platform is architectured to support e-filing when ready:

1. **Court APIs** - Many jurisdictions now offer e-filing APIs
2. **Tyler Technologies** - Major e-filing provider with API access
3. **File & ServeXpress** - Alternative e-filing network

To integrate:
1. Obtain API credentials from your target jurisdiction
2. Update `/api/efile` endpoint with actual submission logic
3. Implement status polling via `/api/status/:id`

## License

MIT

## Disclaimer

CNSLR is not a law firm and does not provide legal advice. The documents generated are templates based on user input and should be reviewed for accuracy. For complex legal matters, consult a licensed attorney.
