import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTaskById } from '../data/legalTasks';

function TaskWizard() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const task = getTaskById(taskId);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Load saved progress from localStorage
    const saved = localStorage.getItem(`cnslr-${taskId}`);
    if (saved) {
      setFormData(JSON.parse(saved));
    }
  }, [taskId]);

  useEffect(() => {
    // Save progress to localStorage
    if (Object.keys(formData).length > 0) {
      localStorage.setItem(`cnslr-${taskId}`, JSON.stringify(formData));
    }
  }, [formData, taskId]);

  if (!task) {
    return (
      <div className="wizard-container">
        <div className="wizard-content">
          <h2>Task not found</h2>
          <p>The requested legal task could not be found.</p>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const currentStep = task.steps[currentStepIndex];
  const isLastStep = currentStepIndex === task.steps.length - 1;
  const isReviewStep = currentStep.id === 'review';
  const progress = ((currentStepIndex + 1) / task.steps.length) * 100;

  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateStep = () => {
    const fields = task.fields[currentStep.id] || [];
    const newErrors = {};
    fields.forEach(field => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = 'This field is required';
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (isReviewStep) {
      handleSubmit();
      return;
    }
    if (validateStep()) {
      setCurrentStepIndex(prev => Math.min(prev + 1, task.steps.length - 1));
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    setCurrentStepIndex(prev => Math.max(prev - 1, 0));
    window.scrollTo(0, 0);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // In production, this would call the backend API
      // For now, we'll simulate a submission
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Save form data for success page (survives page refresh)
      localStorage.setItem(`cnslr-success-${taskId}`, JSON.stringify(formData));

      // Clear wizard progress
      localStorage.removeItem(`cnslr-${taskId}`);

      // Navigate to success page
      navigate(`/success/${taskId}`, { state: { formData, task } });
    } catch (error) {
      console.error('Submission error:', error);
      setIsSubmitting(false);
    }
  };

  const renderField = (field) => {
    const value = formData[field.name] || '';
    const error = errors[field.name];

    switch (field.type) {
      case 'text':
      case 'email':
      case 'tel':
      case 'number':
      case 'date':
      case 'time':
        return (
          <div className="form-group" key={field.name}>
            <label className="form-label">{field.label}{field.required && ' *'}</label>
            <input
              type={field.type}
              className={`form-input ${error ? 'error' : ''}`}
              value={value}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              style={error ? { borderColor: 'var(--danger)' } : {}}
            />
            {field.hint && <p className="form-hint">{field.hint}</p>}
            {error && <p className="form-hint" style={{ color: 'var(--danger)' }}>{error}</p>}
          </div>
        );

      case 'textarea':
        return (
          <div className="form-group" key={field.name}>
            <label className="form-label">{field.label}{field.required && ' *'}</label>
            <textarea
              className={`form-textarea ${error ? 'error' : ''}`}
              value={value}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              style={error ? { borderColor: 'var(--danger)' } : {}}
            />
            {error && <p className="form-hint" style={{ color: 'var(--danger)' }}>{error}</p>}
          </div>
        );

      case 'select':
        return (
          <div className="form-group" key={field.name}>
            <label className="form-label">{field.label}{field.required && ' *'}</label>
            <select
              className={`form-select ${error ? 'error' : ''}`}
              value={value}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              style={error ? { borderColor: 'var(--danger)' } : {}}
            >
              {field.options.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            {error && <p className="form-hint" style={{ color: 'var(--danger)' }}>{error}</p>}
          </div>
        );

      case 'radio':
        return (
          <div className="form-group" key={field.name}>
            <label className="form-label">{field.label}{field.required && ' *'}</label>
            <div className="option-cards">
              {field.options.map(opt => (
                <label
                  key={opt.value}
                  className={`option-card ${value === opt.value ? 'selected' : ''}`}
                >
                  <input
                    type="radio"
                    name={field.name}
                    value={opt.value}
                    checked={value === opt.value}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                  />
                  <div className="option-content">
                    <h4>{opt.label}</h4>
                    {opt.description && <p>{opt.description}</p>}
                  </div>
                </label>
              ))}
            </div>
            {error && <p className="form-hint" style={{ color: 'var(--danger)' }}>{error}</p>}
          </div>
        );

      case 'checkbox':
        return (
          <div className="form-group" key={field.name}>
            <label className={`option-card ${value ? 'selected' : ''}`} style={{ cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={!!value}
                onChange={(e) => handleInputChange(field.name, e.target.checked)}
              />
              <div className="option-content">
                <p>{field.checkboxLabel}</p>
              </div>
            </label>
            {error && <p className="form-hint" style={{ color: 'var(--danger)' }}>{error}</p>}
          </div>
        );

      default:
        return null;
    }
  };

  const renderReviewSection = () => {
    // Group form data by step for review
    const sections = task.steps.slice(0, -1).map(step => {
      const fields = task.fields[step.id] || [];
      const items = fields.map(field => {
        let displayValue = formData[field.name];

        // Format display value for radio/select options
        if (field.options && displayValue) {
          const option = field.options.find(opt => opt.value === displayValue);
          displayValue = option ? option.label : displayValue;
        }

        // Format boolean
        if (field.type === 'checkbox') {
          displayValue = displayValue ? 'Yes' : 'No';
        }

        return {
          label: field.label,
          value: displayValue || '\u2014'
        };
      });

      return { title: step.title, items };
    });

    return (
      <div>
        <div className="info-box success" style={{ marginBottom: '2rem' }}>
          <span className="info-icon">\u2705</span>
          <div className="info-content">
            <p><strong>You're almost done!</strong> Review your information below. You can go back to make changes if needed.</p>
          </div>
        </div>

        {sections.map((section, idx) => (
          <div className="review-section" key={idx}>
            <h4>{section.title}</h4>
            {section.items.map((item, itemIdx) => (
              <div className="review-item" key={itemIdx}>
                <span className="review-label">{item.label}</span>
                <span className="review-value">{item.value}</span>
              </div>
            ))}
          </div>
        ))}

        <div className="info-box" style={{ marginTop: '2rem' }}>
          <span className="info-icon">\u2139\uFE0F</span>
          <div className="info-content">
            <p>
              <strong>What happens next?</strong> After submission, you'll receive your documents ready for
              {task.eFileAvailable ? ' e-filing or manual submission.' : ' manual submission.'}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="wizard-container">
      <div className="wizard-header">
        <h1 className="wizard-title">{task.title}</h1>

        <div className="progress-bar-container">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <div className="progress-text">
            <span>Step {currentStepIndex + 1} of {task.steps.length}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
        </div>

        <div className="steps-indicator">
          {task.steps.map((step, idx) => (
            <div
              key={step.id}
              className={`step-item ${idx === currentStepIndex ? 'active' : ''} ${idx < currentStepIndex ? 'completed' : ''}`}
            >
              <div className="step-circle">
                {idx < currentStepIndex ? '\u2713' : idx + 1}
              </div>
              <span className="step-label">{step.title}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="wizard-content">
        <div className="step-content">
          <h2>{currentStep.title}</h2>
          <p className="step-description">{currentStep.description}</p>

          {isReviewStep ? (
            renderReviewSection()
          ) : (
            <div>
              {(task.fields[currentStep.id] || []).map(field => renderField(field))}
            </div>
          )}

          <div className="wizard-nav">
            <button
              className="btn btn-secondary"
              onClick={currentStepIndex === 0 ? () => navigate('/') : handleBack}
            >
              {currentStepIndex === 0 ? '\u2190 Exit' : '\u2190 Back'}
            </button>

            <button
              className={`btn ${isLastStep ? 'btn-success' : 'btn-primary'}`}
              onClick={handleNext}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                'Processing...'
              ) : isLastStep ? (
                <>Submit & Generate Documents \uD83D\uDCC4</>
              ) : (
                <>Continue \u2192</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskWizard;
