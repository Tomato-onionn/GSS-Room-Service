class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  async findAll(options = {}) {
    return await this.model.findAll(options);
  }

  async findById(id, options = {}) {
    return await this.model.findByPk(id, options);
  }

  async findOne(where, options = {}) {
    return await this.model.findOne({ where, ...options });
  }

  async create(data) {
    return await this.model.create(data);
  }

  async update(id, data) {
    const [updatedRowsCount] = await this.model.update(data, {
      where: { id }
    });
    
    if (updatedRowsCount === 0) {
      return null;
    }
    
    return await this.findById(id);
  }

  async findAndCountAll(options = {}) {
    return await this.model.findAndCountAll(options);
  }

  async count(where = {}) {
    return await this.model.count({ where });
  }

  async bulkCreate(data, options = {}) {
    return await this.model.bulkCreate(data, options);
  }

  async bulkUpdate(data, where) {
    return await this.model.update(data, { where });
  }
}

module.exports = BaseRepository;