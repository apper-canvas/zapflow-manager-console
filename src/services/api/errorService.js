import errorLogsData from '@/services/mockData/errorLogs.json';

class ErrorService {
  constructor() {
    this.errorLogs = [...errorLogsData];
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.errorLogs];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const error = this.errorLogs.find(e => e.Id === parseInt(id));
    if (!error) {
      throw new Error('Error log not found');
    }
    return { ...error };
  }

  async getByZapId(zapId) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.errorLogs.filter(e => e.zapId === parseInt(zapId));
  }

  async getBySeverity(severity) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.errorLogs.filter(e => e.severity === severity);
  }

  async getRecent(limit = 10) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.errorLogs
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);
  }

  async create(errorData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newId = Math.max(...this.errorLogs.map(e => e.Id)) + 1;
    const newError = {
      Id: newId,
      ...errorData,
      timestamp: new Date().toISOString()
    };
    this.errorLogs.push(newError);
    return { ...newError };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = this.errorLogs.findIndex(e => e.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Error log not found');
    }
    this.errorLogs.splice(index, 1);
    return true;
  }

  async clearByZapId(zapId) {
    await new Promise(resolve => setTimeout(resolve, 400));
    this.errorLogs = this.errorLogs.filter(e => e.zapId !== parseInt(zapId));
    return true;
  }
}

export default new ErrorService();