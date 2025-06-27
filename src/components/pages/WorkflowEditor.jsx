import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { toast } from "react-toastify";
import workflowService from "@/services/api/workflowService";
import ApperIcon from "@/components/ApperIcon";
import Workflows from "@/components/pages/Workflows";
import Settings from "@/components/pages/Settings";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";

const WorkflowEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

const [workflow, setWorkflow] = useState({
    name: '',
    description: '',
    status: 'draft',
    steps: []
  });
  const [loading, setLoading] = useState(isEditing);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [showStepModal, setShowStepModal] = useState(false);
  const [editingStep, setEditingStep] = useState(null);
  const [draggedStep, setDraggedStep] = useState(null);
  const [canvasMode, setCanvasMode] = useState(false);

  const stepTypes = [
    { value: 'trigger', label: 'Trigger', icon: 'Zap', description: 'Start the workflow' },
    { value: 'action', label: 'Action', icon: 'Play', description: 'Perform an action' },
    { value: 'condition', label: 'Condition', icon: 'GitBranch', description: 'Add conditional logic' },
    { value: 'delay', label: 'Delay', icon: 'Clock', description: 'Wait before continuing' },
    { value: 'api_call', label: 'API Call', icon: 'Globe', description: 'Make HTTP request' }
  ];

  const httpMethods = [
    { value: 'GET', label: 'GET' },
    { value: 'POST', label: 'POST' },
    { value: 'PUT', label: 'PUT' },
    { value: 'PATCH', label: 'PATCH' },
    { value: 'DELETE', label: 'DELETE' }
  ];

  useEffect(() => {
    if (isEditing) {
      loadWorkflow();
    }
  }, [id]);

  const loadWorkflow = async () => {
    try {
      setLoading(true);
      const data = await workflowService.getById(parseInt(id));
      setWorkflow(data);
    } catch (err) {
      setError('Failed to load workflow');
      toast.error('Failed to load workflow');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!workflow.name.trim()) {
      toast.error('Workflow name is required');
      return;
    }

    if (workflow.steps.length === 0) {
      toast.error('At least one step is required');
      return;
    }

    try {
      setSaving(true);
      if (isEditing) {
        await workflowService.update(parseInt(id), workflow);
        toast.success('Workflow updated successfully');
      } else {
        const newWorkflow = await workflowService.create(workflow);
        toast.success('Workflow created successfully');
        navigate(`/workflows/editor/${newWorkflow.Id}`);
      }
    } catch (err) {
      toast.error(`Failed to save workflow: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!workflow.name.trim() || workflow.steps.length === 0) {
      toast.error('Complete the workflow before publishing');
      return;
    }

    try {
      setSaving(true);
      const updatedWorkflow = { ...workflow, status: 'active' };
      if (isEditing) {
        await workflowService.update(parseInt(id), updatedWorkflow);
      } else {
        await workflowService.create(updatedWorkflow);
      }
      toast.success('Workflow published successfully');
      navigate('/workflows');
    } catch (err) {
      toast.error(`Failed to publish workflow: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

const handleAddStep = (stepType) => {
    const newStep = {
      Id: Date.now(),
      type: stepType,
      name: stepTypes.find(s => s.value === stepType)?.label || 'New Step',
      description: '',
      position: canvasMode ? { 
        x: Math.random() * 400 + 100, 
        y: Math.random() * 300 + 100 
      } : null,
      config: stepType === 'api_call' ? {
        method: 'GET',
        url: '',
        headers: {},
        body: ''
      } : {}
    };

    setWorkflow(prev => ({
      ...prev,
      steps: [...prev.steps, newStep]
    }));
    setEditingStep(newStep);
    setShowStepModal(true);
  };

  const handleEditStep = (step) => {
    setEditingStep(step);
    setShowStepModal(true);
  };

  const handleDeleteStep = (stepId) => {
    if (confirm('Are you sure you want to delete this step?')) {
      setWorkflow(prev => ({
        ...prev,
        steps: prev.steps.filter(s => s.Id !== stepId)
      }));
      toast.success('Step deleted successfully');
    }
  };

  const handleStepUpdate = (updatedStep) => {
    setWorkflow(prev => ({
      ...prev,
      steps: prev.steps.map(s => s.Id === updatedStep.Id ? updatedStep : s)
    }));
    setShowStepModal(false);
    setEditingStep(null);
    toast.success('Step updated successfully');
  };

const handleDragStart = (e, step) => {
    setDraggedStep(step);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetStep) => {
    e.preventDefault();
    if (!draggedStep || draggedStep.Id === targetStep.Id) return;

    const steps = [...workflow.steps];
    const draggedIndex = steps.findIndex(s => s.Id === draggedStep.Id);
    const targetIndex = steps.findIndex(s => s.Id === targetStep.Id);

    steps.splice(draggedIndex, 1);
    steps.splice(targetIndex, 0, draggedStep);

    setWorkflow(prev => ({ ...prev, steps }));
    setDraggedStep(null);
    toast.success('Step order updated');
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const steps = Array.from(workflow.steps);
    const [reorderedStep] = steps.splice(result.source.index, 1);
    steps.splice(result.destination.index, 0, reorderedStep);

    setWorkflow(prev => ({ ...prev, steps }));
    toast.success('Step order updated');
  };

  const handleStepPositionUpdate = (stepId, position) => {
    setWorkflow(prev => ({
      ...prev,
      steps: prev.steps.map(step => 
        step.Id === stepId 
          ? { ...step, position }
          : step
      )
    }));
  };

  if (loading) {
    return (
      <div className="flex-1 p-8">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-8">
        <Error
          title="Failed to load workflow"
          message={error}
          onRetry={loadWorkflow}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            icon="ArrowLeft"
            onClick={() => navigate('/workflows')}
          >
            Back to Workflows
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditing ? 'Edit Workflow' : 'Create Workflow'}
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {workflow.steps.length} steps configured
            </p>
          </div>
        </div>

<div className="flex items-center gap-3">
          <Button
            variant="ghost"
            icon={canvasMode ? "List" : "Layers"}
            onClick={() => setCanvasMode(!canvasMode)}
            className="mr-2"
          >
            {canvasMode ? 'Linear View' : 'Canvas View'}
          </Button>
          <Button
            variant="secondary"
            onClick={handleSave}
            loading={saving}
            disabled={saving}
          >
            Save Draft
          </Button>
          <Button
            variant="primary"
            onClick={handlePublish}
            loading={saving}
            disabled={saving}
            icon="Rocket"
          >
            Publish
          </Button>
        </div>
      </div>

      {/* Main Content */}
<div className="flex-1 flex overflow-hidden">
        {/* Workflow Canvas */}
        <div className="flex-1 p-6 overflow-auto bg-gray-50">
          <div className="max-w-4xl mx-auto">
            {/* Workflow Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">Workflow Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Workflow Name"
                  value={workflow.name}
                  onChange={(e) => setWorkflow(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter workflow name"
                  required
                />
                <Select
                  label="Status"
                  value={workflow.status}
                  onChange={(value) => setWorkflow(prev => ({ ...prev, status: value }))}
                  options={[
                    { value: 'draft', label: 'Draft' },
                    { value: 'active', label: 'Active' },
                    { value: 'paused', label: 'Paused' }
                  ]}
                />
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={workflow.description}
                  onChange={(e) => setWorkflow(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what this workflow does"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Steps */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">
                  Workflow Steps {canvasMode && <span className="text-sm text-gray-500 ml-2">(Canvas Mode)</span>}
                </h2>
                <div className="flex items-center gap-2">
                  {stepTypes.map((type) => (
                    <Button
                      key={type.value}
                      variant="ghost"
                      size="sm"
                      icon={type.icon}
                      onClick={() => handleAddStep(type.value)}
                      className="text-xs"
                    >
                      {type.label}
                    </Button>
                  ))}
                </div>
              </div>

              {workflow.steps.length === 0 ? (
                <div className="text-center py-12">
                  <ApperIcon name="Workflow" size={48} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No steps yet</h3>
                  <p className="text-gray-600 mb-4">Add your first step to get started</p>
                  <Button
                    variant="primary"
                    icon="Plus"
                    onClick={() => handleAddStep('trigger')}
                  >
                    Add Trigger Step
                  </Button>
                </div>
              ) : canvasMode ? (
                <VisualCanvas
                  steps={workflow.steps}
                  stepTypes={stepTypes}
                  onEditStep={handleEditStep}
                  onDeleteStep={handleDeleteStep}
                  onPositionUpdate={handleStepPositionUpdate}
                />
              ) : (
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="workflow-steps">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                        {workflow.steps.map((step, index) => {
                          const stepType = stepTypes.find(t => t.value === step.type);
                          return (
                            <Draggable key={step.Id} draggableId={step.Id.toString()} index={index}>
                              {(provided, snapshot) => (
                                <motion.div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  layout
                                  className={`relative bg-gray-50 rounded-lg border-2 border-dashed p-4 transition-colors ${
                                    snapshot.isDragging 
                                      ? 'border-blue-400 bg-blue-50 shadow-lg' 
                                      : 'border-gray-200 hover:border-blue-300'
                                  }`}
                                >
                                  <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-3">
                                      <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full flex-shrink-0">
                                        <span className="text-sm font-medium text-blue-600">
                                          {index + 1}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <ApperIcon name={stepType?.icon || 'Circle'} size={20} className="text-gray-600" />
                                        <div>
                                          <h4 className="font-medium text-gray-900">{step.name}</h4>
                                          <p className="text-sm text-gray-600">{step.description || stepType?.description}</p>
                                          {step.type === 'api_call' && step.config?.url && (
                                            <p className="text-xs text-blue-600 mt-1">
                                              {step.config.method} {step.config.url}
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        icon="Edit"
                                        onClick={() => handleEditStep(step)}
                                      />
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        icon="Trash2"
                                        onClick={() => handleDeleteStep(step.Id)}
                                        className="text-red-600 hover:text-red-700"
                                      />
                                    </div>
                                  </div>
                                  
                                  {index < workflow.steps.length - 1 && (
                                    <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 z-10">
                                      <div className="w-8 h-8 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center">
                                        <ApperIcon name="ArrowDown" size={16} className="text-gray-400" />
                                      </div>
                                    </div>
                                  )}
                                </motion.div>
                              )}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              )}
            </div>
          </div>
        </div>

        {/* Step Configuration Sidebar */}
        <AnimatePresence>
          {showStepModal && editingStep && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-96 bg-white border-l border-gray-200 flex flex-col"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Configure Step</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon="X"
                    onClick={() => setShowStepModal(false)}
                  />
                </div>
              </div>

              <div className="flex-1 overflow-auto p-6">
                <StepConfigForm
                  step={editingStep}
                  stepTypes={stepTypes}
                  httpMethods={httpMethods}
                  onUpdate={handleStepUpdate}
                  onCancel={() => setShowStepModal(false)}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const StepConfigForm = ({ step, stepTypes, httpMethods, onUpdate, onCancel }) => {
  const [formData, setFormData] = useState(step);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Step name is required');
      return;
    }
    onUpdate(formData);
  };

  const updateConfig = (key, value) => {
    setFormData(prev => ({
      ...prev,
      config: { ...prev.config, [key]: value }
    }));
  };

  const stepType = stepTypes.find(t => t.value === formData.type);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Input
          label="Step Name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="Enter step name"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Describe what this step does"
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <Select
          label="Step Type"
          value={formData.type}
          onChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
          options={stepTypes.map(t => ({ value: t.value, label: t.label }))}
        />
      </div>

      {/* API Call Configuration */}
      {formData.type === 'api_call' && (
        <div className="space-y-4 pt-4 border-t border-gray-200">
          <h4 className="font-medium text-gray-900">API Configuration</h4>
          
          <Select
            label="HTTP Method"
            value={formData.config.method || 'GET'}
            onChange={(value) => updateConfig('method', value)}
            options={httpMethods}
          />

          <Input
            label="URL"
            value={formData.config.url || ''}
            onChange={(e) => updateConfig('url', e.target.value)}
            placeholder="https://api.example.com/endpoint"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Headers (JSON)
            </label>
            <textarea
              value={JSON.stringify(formData.config.headers || {}, null, 2)}
              onChange={(e) => {
                try {
                  const headers = JSON.parse(e.target.value);
                  updateConfig('headers', headers);
                } catch {
                  // Invalid JSON, don't update
                }
              }}
              placeholder='{\n  "Content-Type": "application/json",\n  "Authorization": "Bearer token"\n}'
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
            />
          </div>

          {['POST', 'PUT', 'PATCH'].includes(formData.config.method) && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Request Body
              </label>
              <textarea
                value={formData.config.body || ''}
                onChange={(e) => updateConfig('body', e.target.value)}
                placeholder='{"key": "value"}'
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
              />
            </div>
          )}
        </div>
      )}

      {/* Condition Configuration */}
      {formData.type === 'condition' && (
        <div className="space-y-4 pt-4 border-t border-gray-200">
          <h4 className="font-medium text-gray-900">Condition Settings</h4>
          
          <Input
            label="Variable to Check"
            value={formData.config.variable || ''}
            onChange={(e) => updateConfig('variable', e.target.value)}
            placeholder="response.status"
          />

          <Select
            label="Operator"
            value={formData.config.operator || 'equals'}
            onChange={(value) => updateConfig('operator', value)}
            options={[
              { value: 'equals', label: 'Equals' },
              { value: 'not_equals', label: 'Not Equals' },
              { value: 'greater_than', label: 'Greater Than' },
              { value: 'less_than', label: 'Less Than' },
              { value: 'contains', label: 'Contains' }
            ]}
          />

          <Input
            label="Value"
            value={formData.config.value || ''}
            onChange={(e) => updateConfig('value', e.target.value)}
            placeholder="200"
          />
        </div>
      )}

      {/* Delay Configuration */}
      {formData.type === 'delay' && (
        <div className="space-y-4 pt-4 border-t border-gray-200">
          <h4 className="font-medium text-gray-900">Delay Settings</h4>
          
          <Input
            label="Duration (seconds)"
            type="number"
            value={formData.config.duration || ''}
            onChange={(e) => updateConfig('duration', parseInt(e.target.value) || 0)}
            placeholder="30"
            min="1"
          />
        </div>
      )}

      <div className="flex items-center gap-3 pt-6 border-t border-gray-200">
        <Button type="submit" variant="primary" className="flex-1">
          Save Step
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
</div>
    </form>
  );
};

const VisualCanvas = ({ steps, stepTypes, onEditStep, onDeleteStep, onPositionUpdate }) => {
  const [draggedStep, setDraggedStep] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e, step) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const offset = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    setDragOffset(offset);
    setDraggedStep(step);
  };

  const handleMouseMove = (e) => {
    if (!draggedStep) return;
    
    const canvasRect = e.currentTarget.getBoundingClientRect();
    const newPosition = {
      x: Math.max(0, Math.min(canvasRect.width - 200, e.clientX - canvasRect.left - dragOffset.x)),
      y: Math.max(0, Math.min(canvasRect.height - 100, e.clientY - canvasRect.top - dragOffset.y))
    };
    
    onPositionUpdate(draggedStep.Id, newPosition);
  };

  const handleMouseUp = () => {
    setDraggedStep(null);
  };

  const renderConnectionLine = (fromStep, toStep, index) => {
    const fromPos = fromStep.position || { x: 100 + (index * 250), y: 100 };
    const toPos = toStep.position || { x: 100 + ((index + 1) * 250), y: 100 };
    
    const startX = fromPos.x + 100;
    const startY = fromPos.y + 50;
    const endX = toPos.x + 100;
    const endY = toPos.y + 50;
    
    const midY = (startY + endY) / 2;
    
    return (
      <svg
        key={`connection-${fromStep.Id}-${toStep.Id}`}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 1 }}
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon
              points="0 0, 10 3.5, 0 7"
              fill="#6b7280"
            />
          </marker>
        </defs>
        <path
          d={`M ${startX} ${startY} C ${startX} ${midY}, ${endX} ${midY}, ${endX} ${endY}`}
          stroke="#6b7280"
          strokeWidth="2"
          fill="none"
          markerEnd="url(#arrowhead)"
          className="drop-shadow-sm"
        />
      </svg>
    );
  };

  return (
    <div 
      className="relative w-full h-96 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200 overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Connection Lines */}
      {steps.map((step, index) => {
        if (index < steps.length - 1) {
          return renderConnectionLine(step, steps[index + 1], index);
        }
        return null;
      })}

      {/* Steps */}
      {steps.map((step, index) => {
        const stepType = stepTypes.find(t => t.value === step.type);
        const position = step.position || { 
          x: 100 + (index * 250), 
          y: 100 + (index % 2 === 0 ? 0 : 80) 
        };
        
        return (
          <motion.div
            key={step.Id}
            className={`absolute w-48 bg-white rounded-lg border-2 shadow-sm cursor-move select-none ${
              draggedStep?.Id === step.Id 
                ? 'border-blue-400 shadow-lg z-20' 
                : 'border-gray-200 hover:border-blue-300 z-10'
            }`}
            style={{
              left: position.x,
              top: position.y,
              zIndex: draggedStep?.Id === step.Id ? 20 : 10
            }}
            onMouseDown={(e) => handleMouseDown(e, step)}
            animate={{
              scale: draggedStep?.Id === step.Id ? 1.05 : 1,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="p-3">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full flex-shrink-0">
                    <span className="text-xs font-medium text-blue-600">
                      {index + 1}
                    </span>
                  </div>
                  <ApperIcon 
                    name={stepType?.icon || 'Circle'} 
                    size={16} 
                    className="text-gray-600" 
                  />
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon="Edit"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditStep(step);
                    }}
                    className="p-1 h-6 w-6"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    icon="Trash2"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteStep(step.Id);
                    }}
                    className="p-1 h-6 w-6 text-red-600 hover:text-red-700"
                  />
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 text-sm truncate mb-1">
                  {step.name}
                </h4>
                <p className="text-xs text-gray-600 line-clamp-2">
                  {step.description || stepType?.description}
                </p>
                {step.type === 'api_call' && step.config?.url && (
                  <p className="text-xs text-blue-600 mt-1 truncate">
                    {step.config.method} {step.config.url}
                  </p>
                )}
              </div>
            </div>
            
            {/* Drag Handle */}
            <div className="absolute top-1 right-1 text-gray-400">
              <ApperIcon name="GripVertical" size={12} />
            </div>
          </motion.div>
        );
      })}
      
      {/* Canvas Instructions */}
      {steps.length > 0 && (
        <div className="absolute bottom-4 left-4 text-xs text-gray-500 bg-white px-2 py-1 rounded shadow">
          Drag steps to rearrange • Click edit to configure
        </div>
      )}
    </div>
  );
};