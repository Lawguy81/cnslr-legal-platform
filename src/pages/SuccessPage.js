import React, { useState, useMemo } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { getTaskById } from '../data/legalTasks';

function SuccessPage() {
  const { taskId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const task = getTaskById(taskId);

  // Try navigation state first, fall back to localStorage
  const formData = useMemo(() => {
    if (location.state && location.state.formData) {
      return location.state.formData;
    }
    // Fallback: read from localStorage (survives page refresh)
    try {
      const saved = localStorage.getItem(`cnslr-success-${taskId}`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error reading saved form data:', e);
    }
    return null;
  }, [location.state, taskId]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [showEfileModal, setShowEfileModal] = useState(false);

  if (!task || !formData) {
    return (
      <div className="wizard-container">
        <div className="wizard-content" style={{ textAlign: 'center', padding: '3rem' }}>
          <h2>Session Expired</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            Your session has expired. Please start a new submission.
          </p>
          <Link to="/" className="btn btn-primary">Start Over</Link>
        </div>
      </div>
    );
  }

  const handleDownload = async (format) => {
    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const documentContent = generateDocumentPreview(format);
      const blob = new Blob([documentContent], {
        type: format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${taskId}-${Date.now()}.${format === 'pdf' ? 'pdf' : 'docx'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      alert(`Your ${format.toUpperCase()} document has been downloaded!`);
    } catch (error) {
      console.error('Download error:', error);
      alert('Error generating document. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateDocumentPreview = (format) => {
    let content = `
================================================================================
                          CNSLR LEGAL DOCUMENT
================================================================================

Document Type: ${task.title}
Generated: ${new Date().toLocaleString()}
Reference: CNSLR-${taskId.toUpperCase()}-${Date.now()}

--------------------------------------------------------------------------------
`;

    Object.entries(formData).forEach(([key, value]) => {
      const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
      content += `${label}: ${value}\n`;
    });

    content += `
--------------------------------------------------------------------------------
NOTICE: This document was generated using CNSLR. Please review all information
for accuracy before submitting to the appropriate authority.
================================================================================
`;

    return content;
  };

  const handleEfile = () => {
    setShowEfileModal(true);
  };

  const getNextStepsContent = () => {
    switch (taskId) {
      case 'parking-ticket':
        return {
          steps: [
            'Download your appeal letter (PDF or Word format)',
            'Print and sign the letter where indicated',
            'Make copies of any supporting evidence (photos, receipts)',
            'Submit to your local parking authority by mail or in person',
            'Keep a copy for your records'
          ],
          deadline: 'Most jurisdictions require appeals within 30-60 days',
          tip: 'Send your appeal via certified mail to have proof of delivery'
        };
      case 'small-claims':
        return {
          steps: [
            'Download your claim form and statement',
            'File at your local courthouse (fee varies by jurisdiction)',
            'Pay the filing fee (typically $30-$75)',
            'Have the defendant served with a copy',
            'Prepare for your court date'
          ],
          deadline: 'Statutes of limitations vary - typically 2-6 years',
          tip: 'Bring all evidence organized in a folder to your hearing'
        };
      case 'demand-letter':
        return {
          steps: [
            'Download and print your demand letter',
            'Sign and date the letter',
            'Send via certified mail with return receipt',
            'Keep copies of everything',
            'Wait for the response deadline to pass before taking further action'
          ],
          deadline: 'Your letter specifies a response deadline',
          tip: 'Certified mail creates a legal record that the letter was received'
        };
      case 'name-change':
        return {
          steps: [
            'Download your petition documents',
            'File the petition at your local court',
            'Pay the filing fee ($150-$500 varies by state)',
            'Publish notice (if required in your state)',
            'Attend your court hearing',
            'Receive your court order',
            'Update your ID, Social Security, and other records'
          ],
          deadline: 'Process typically takes 4-8 weeks',
          tip: 'Bring extra copies of your court order - many agencies require originals'
        };
      case 'landlord-dispute':
        return {
          steps: [
            'Download your formal notice letter',
            'Send via certified mail to your landlord',
            'Keep a copy with the mailing receipt',
            'Document any responses or actions taken',
            'If unresolved, consider filing with housing authority or small claims'
          ],
          deadline: 'Give landlord reasonable time to respond (typically 14-30 days)',
          tip: 'Take dated photos of any issues as evidence'
        };
      default:
        return {
          steps: ['Download your documents', 'Review for accuracy', 'Submit as directed'],
          deadline: 'Check local requirements',
          tip: 'Keep copies of all documents'
        };
    }
  };

  const nextSteps = getNextStepsContent();

  return (
    <div className="wizard-container">
      <div className="wizard-content">
        <div className="success-container">
          <div className="success-icon">\u2713</div>
          <h2>Your Documents Are Ready!</h2>
          <p>
            We've prepared your {task.title.toLowerCase()} documents based on your
            information. Download them below to proceed with your submission.
          </p>

          <div className="download-options">
            <button
              className="btn btn-primary btn-lg"
              onClick={() => handleDownload('pdf')}
              disabled={isGenerating}
            >
              \uD83D\uDCC4 Download PDF
            </button>
            <button
              className="btn btn-secondary btn-lg"
              onClick={() => handleDownload('docx')}
              disabled={isGenerating}
            >
              \uD83D\uDCDD Download Word
            </button>
            {task.eFileAvailable && (
              <button
                className="btn btn-success btn-lg"
                onClick={handleEfile}
                disabled={isGenerating}
              >
                \u26A1 E-File Now
              </button>
            )}
          </div>
        </div>

        <div style={{ marginTop: '3rem' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>\uD83D\uDCCB Next Steps</h3>

          <div className="info-box" style={{ marginBottom: '1.5rem' }}>
            <span className="info-icon">\u23F0</span>
            <div className="info-content">
              <p><strong>Important Deadline:</strong> {nextSteps.deadline}</p>
            </div>
          </div>

          <div style={{ background: 'var(--bg-tertiary)', borderRadius: '8px', padding: '1.5rem', marginBottom: '1.5rem' }}>
            <ol style={{ paddingLeft: '1.5rem', margin: 0 }}>
              {nextSteps.steps.map((step, idx) => (
                <li key={idx} style={{ padding: '0.5rem 0', color: 'var(--text-secondary)' }}>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          <div className="info-box success">
            <span className="info-icon">\uD83D\uDCA1</span>
            <div className="info-content">
              <p><strong>Pro Tip:</strong> {nextSteps.tip}</p>
            </div>
          </div>
        </div>

        <div style={{
          marginTop: '2rem',
          paddingTop: '2rem',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <Link to="/" className="btn btn-secondary">
            \u2190 Back to Home
          </Link>
          <button className="btn btn-primary" onClick={() => window.print()}>
            \uD83D\uDDA8\uFE0F Print This Page
          </button>
        </div>
      </div>

      {/* E-File Modal */}
      {showEfileModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px', padding: '2rem',
            maxWidth: '500px', width: '90%'
          }}>
            <h3 style={{ marginBottom: '1rem' }}>\u26A1 E-File Your Documents</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              E-filing allows you to submit your documents electronically to the
              appropriate authority. This feature is coming soon for your jurisdiction.
            </p>
            <div className="info-box warning" style={{ marginBottom: '1.5rem' }}>
              <span className="info-icon">\uD83D\uDD27</span>
              <div className="info-content">
                <p>
                  <strong>Coming Soon:</strong> We're working on integrating with local
                  court e-filing systems. Sign up to be notified when it's available in your area.
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setShowEfileModal(false)}>
                Close
              </button>
              <button className="btn btn-primary" onClick={() => {
                alert("You'll be notified when e-filing is available!");
                setShowEfileModal(false);
              }}>
                Notify Me
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SuccessPage;
