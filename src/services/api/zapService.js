import zapsData from '@/services/mockData/zaps.json';

class ZapService {
  constructor() {
    this.zaps = [...zapsData];
  }

  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.zaps];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const zap = this.zaps.find(z => z.Id === parseInt(id));
    if (!zap) {
      throw new Error('Zap not found');
    }
    return { ...zap };
  }

  async create(zapData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const newId = Math.max(...this.zaps.map(z => z.Id)) + 1;
    const newZap = {
      Id: newId,
      ...zapData,
      lastRun: null,
      errorCount: 0,
      successRate: 100,
      avgDuration: 0
    };
    this.zaps.push(newZap);
    return { ...newZap };
  }

  async update(id, updates) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = this.zaps.findIndex(z => z.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Zap not found');
    }
    this.zaps[index] = { ...this.zaps[index], ...updates };
    return { ...this.zaps[index] };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = this.zaps.findIndex(z => z.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Zap not found');
    }
    this.zaps.splice(index, 1);
    return true;
  }

  async toggleStatus(id) {
    const zap = await this.getById(id);
    const newStatus = zap.status === 'active' ? 'paused' : 'active';
    return await this.update(id, { status: newStatus });
  }

  async testZap(id) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    // Simulate test results
    return {
      success: Math.random() > 0.2,
      message: Math.random() > 0.2 ? 'Test completed successfully' : 'Test failed: Connection timeout'
    };
  }

  async getByStatus(status) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.zaps.filter(z => z.status === status);
  }

  async getByFolder(folderId) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.zaps.filter(z => z.folderId === parseInt(folderId));
  }
}

export default new ZapService();