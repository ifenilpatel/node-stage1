class DepartmentDTO {
  constructor(body = {}) {
    this.department_id = body.department_id ?? null;
    this.code = body.code ?? null;
    this.title = body.title ?? null;
    this.is_active = body.is_active ?? true;
    this.created_by = body.created_by ?? true;
    this.updated_by = body.updated_by ?? true;
  }

  static _getItem(entity) {
    return entity?.dataValues ?? entity;
  }

  static _mapItem(item) {
    if (!item) return null;

    return {
      department_id: item.department_id,
      code: item.code,
      is_active: item.is_active,
      created_by: item.created_by,
      updated_by: item.updated_by,
      created_at: item.created_at,
      updated_at: item.updated_at
    };
  }

  static toResponse(entity) {
    if (!entity) return null;

    return this._mapItem(this._getItem(entity));
  }

  static toResponseList(entities) {
    if (!Array.isArray(entities)) return [];

    return entities.map((entity) => this._mapItem(this._getItem(entity)));
  }

  static toResponseSelection(entities) {
    if (!Array.isArray(entities)) return [];

    return entities.map((entity) => {
      const item = this._getItem(entity);

      return {
        department_id: item.department_id,
        code: item.code,
        title: item.title
      };
    });
  }
}

module.exports = DepartmentDTO;
