import workflowsData from '@/services/mockData/workflows.json';

// Mock data with workflows and steps
let workflows = [...workflowsData];
let lastId = Math.max(...workflows.map(w => w.Id), 0);

const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

export const workflowService = {
  // Get all workflows
  async getAll() {
    await delay();
    return [...workflows];
  },

  // Get workflow by ID
  async getById(id) {
    await delay();
    const workflow = workflows.find(w => w.Id === id);
    if (!workflow) {
      throw new Error('Workflow not found');
    }
    return { ...workflow };
  },

  // Create new workflow
  async create(workflowData) {
    await delay();
    const newWorkflow = {
      ...workflowData,
      Id: ++lastId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
      runs: 0,
      lastRun: null
    };
    workflows.push(newWorkflow);
    return { ...newWorkflow };
  },

  // Update workflow
  async update(id, workflowData) {
    await delay();
    const index = workflows.findIndex(w => w.Id === id);
    if (index === -1) {
      throw new Error('Workflow not found');
    }
    
    workflows[index] = {
      ...workflows[index],
      ...workflowData,
      Id: id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString(),
      version: workflows[index].version + 1
    };
    
    return { ...workflows[index] };
  },

  // Delete workflow
  async delete(id) {
    await delay();
    const index = workflows.findIndex(w => w.Id === id);
    if (index === -1) {
      throw new Error('Workflow not found');
    }
    
    workflows.splice(index, 1);
    return { success: true };
  },

  // Execute workflow
  async execute(id) {
    await delay(500);
    const workflow = workflows.find(w => w.Id === id);
    if (!workflow) {
      throw new Error('Workflow not found');
    }

    // Simulate execution
    const executionId = Date.now();
    const results = [];

    for (const step of workflow.steps) {
      const stepResult = await this.executeStep(step);
      results.push({
        stepId: step.Id,
        stepName: step.name,
        status: stepResult.success ? 'success' : 'error',
        result: stepResult.result,
        duration: stepResult.duration
      });

      if (!stepResult.success) {
        break; // Stop on first error
      }
    }

    // Update workflow stats
    const index = workflows.findIndex(w => w.Id === id);
    if (index !== -1) {
      workflows[index].runs += 1;
      workflows[index].lastRun = new Date().toISOString();
    }

    return {
      executionId,
      workflowId: id,
      status: results.every(r => r.status === 'success') ? 'success' : 'error',
      steps: results,
      duration: results.reduce((sum, r) => sum + r.duration, 0)
    };
  },

  // Execute individual step
  async executeStep(step) {
    const startTime = Date.now();
    
    try {
      let result = {};

      switch (step.type) {
        case 'trigger':
          result = { message: 'Trigger activated', data: { timestamp: new Date().toISOString() } };
          break;

        case 'api_call':
          if (!step.config?.url) {
            throw new Error('API URL is required');
          }
          // Simulate API call
          await delay(200 + Math.random() * 300);
          result = {
            status: 200,
            data: { message: 'API call successful', url: step.config.url, method: step.config.method },
            headers: { 'content-type': 'application/json' }
          };
          break;

        case 'condition':
          // Simulate condition evaluation
          const conditionMet = Math.random() > 0.3; // 70% success rate
          result = {
            conditionMet,
            variable: step.config.variable,
            value: step.config.value,
            operator: step.config.operator
          };
          break;

        case 'delay':
          const duration = step.config.duration || 1;
          await delay(Math.min(duration * 1000, 2000)); // Cap at 2 seconds for demo
          result = { delayed: duration, unit: 'seconds' };
          break;

        case 'action':
          await delay(100 + Math.random() * 200);
          result = { message: 'Action completed', timestamp: new Date().toISOString() };
          break;

        default:
          result = { message: 'Step executed', type: step.type };
      }

      return {
        success: true,
        result,
        duration: Date.now() - startTime
      };

    } catch (error) {
      return {
        success: false,
        result: { error: error.message },
        duration: Date.now() - startTime
      };
    }
  },

  // Get workflow templates
  async getTemplates() {
    await delay();
    return [
      {
        Id: 'template_1',
        name: 'API Data Sync',
        description: 'Sync data between two APIs with error handling',
        category: 'Integration',
        steps: [
          {
            Id: 1,
            type: 'trigger',
            name: 'Schedule Trigger',
            description: 'Run every hour',
            config: { schedule: '0 * * * *' }
          },
          {
            Id: 2,
            type: 'api_call',
            name: 'Fetch Source Data',
            description: 'Get data from source API',
            config: {
              method: 'GET',
              url: 'https://api.source.com/data',
              headers: { 'Authorization': 'Bearer {{token}}' }
            }
          },
          {
            Id: 3,
            type: 'condition',
            name: 'Check Response',
            description: 'Verify API response is valid',
            config: {
              variable: 'response.status',
              operator: 'equals',
              value: '200'
            }
          },
          {
            Id: 4,
            type: 'api_call',
            name: 'Update Destination',
            description: 'Send data to destination API',
            config: {
              method: 'POST',
              url: 'https://api.destination.com/data',
              headers: { 'Content-Type': 'application/json' },
              body: '{{source_data}}'
            }
          }
        ]
      },
      {
        Id: 'template_2',
        name: 'Webhook Processor',
        description: 'Process incoming webhooks with validation',
        category: 'Automation',
        steps: [
          {
            Id: 1,
            type: 'trigger',
            name: 'Webhook Trigger',
            description: 'Receive webhook payload',
            config: { endpoint: '/webhook/receive' }
          },
          {
            Id: 2,
            type: 'condition',
            name: 'Validate Payload',
            description: 'Check required fields exist',
            config: {
              variable: 'payload.type',
              operator: 'not_equals',
              value: ''
            }
          },
          {
            Id: 3,
            type: 'action',
            name: 'Process Data',
            description: 'Transform and validate data',
            config: { processor: 'data_transformer' }
          },
          {
            Id: 4,
            type: 'api_call',
            name: 'Send Notification',
            description: 'Notify external system',
            config: {
              method: 'POST',
              url: 'https://notifications.example.com/send',
              body: '{"message": "Webhook processed", "data": {{processed_data}}}'
            }
          }
        ]
      }
    ];
  }
};

export default workflowService;