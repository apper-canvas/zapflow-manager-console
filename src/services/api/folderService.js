import foldersData from '@/services/mockData/folders.json';

class FolderService {
  constructor() {
    this.folders = [...foldersData];
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...this.folders];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 150));
    const folder = this.folders.find(f => f.Id === parseInt(id));
    if (!folder) {
      throw new Error('Folder not found');
    }
    return { ...folder };
  }

  async create(folderData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newId = Math.max(...this.folders.map(f => f.Id)) + 1;
    const newFolder = {
      Id: newId,
      ...folderData,
      zapCount: 0
    };
    this.folders.push(newFolder);
    return { ...newFolder };
  }

  async update(id, updates) {
    await new Promise(resolve => setTimeout(resolve, 250));
    const index = this.folders.findIndex(f => f.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Folder not found');
    }
    this.folders[index] = { ...this.folders[index], ...updates };
    return { ...this.folders[index] };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = this.folders.findIndex(f => f.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Folder not found');
    }
    this.folders.splice(index, 1);
    return true;
  }

  async updateZapCount(id, count) {
    return await this.update(id, { zapCount: count });
  }
}

export default new FolderService();