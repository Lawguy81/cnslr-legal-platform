const express = require('express');
const cors = require('cors');
const path = require('path');
const { generatePDF } = require('./documentGenerators/pdfGenerator');
const { generateDOCX } = require('./documentGenerators/docxGenerator');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes

// Generate PDF document
app.post('/api/generate/pdf', async (req, res) => {
  try {
    const { taskId, formData } = req.body;

    if (!taskId || !formData) {
      return res.status(400).json({ error: 'Missing taskId or formData' });
    }

    const pdfBuffer = await generatePDF(taskId, formData);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${taskId}-${Date.now()}.pdf`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
});

// Generate DOCX document
app.post('/api/generate/docx', async (req, res) => {
  try {
    const { taskId, formData } = req.body;

    if (!taskId || !formData) {
      return res.status(400).json({ error: 'Missing taskId or formData' });
    }

    const docxBuffer = await generateDOCX(taskId, formData);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename=${taskId}-${Date.now()}.docx`);
    res.send(docxBuffer);
  } catch (error) {
    console.error('DOCX generation error:', error);
    res.status(500).json({ error: 'Failed to generate DOCX' });
  }
});

// E-file submission endpoint (mock - ready for real integration)
app.post('/api/efile', async (req, res) => {
  try {
    const { taskId, formData, jurisdiction } = req.body;

    // In production, this would integrate with actual e-filing systems
    // For now, return a mock success response

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));

    res.json({
      success: true,
      confirmationNumber: `EFILE-${taskId.toUpperCase()}-${Date.now()}`,
      submittedAt: new Date().toISOString(),
      jurisdiction: jurisdiction || 'pending-setup',
      status: 'submitted',
      message: 'Your documents have been submitted for e-filing. You will receive a confirmation email shortly.'
    });
  } catch (error) {
    console.error('E-file error:', error);
    res.status(500).json({ error: 'Failed to submit e-file' });
  }
});

// Get submission status
app.get('/api/status/:confirmationNumber', async (req, res) => {
  try {
    const { confirmationNumber } = req.params;

    // In production, this would check actual filing status
    res.json({
      confirmationNumber,
      status: 'processing',
      lastUpdated: new Date().toISOString(),
      estimatedCompletion: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
      notes: 'Your filing is being processed by the appropriate authority.'
    });
  } catch (error) {
    console.error('Status check error:', error);
    res.status(500).json({ error: 'Failed to check status' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`CNSLR API Server running on port ${PORT}`);
});

module.exports = app;
