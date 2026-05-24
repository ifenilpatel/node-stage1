class UserDTO {
  constructor(body = {}) {
    this.user_id = body.user_id ?? null;
    this.first_name = body.first_name ?? null;
  }

  static _getItem(entity) {
    return entity?.dataValues ?? entity;
  }

  static _mapItem(item) {
    if (!item) return null;

    return {
      user_id: item.user_id,
      first_name: item.first_name,
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
        user_id: item.user_id,
        first_name: item.first_name
      };
    });
  }
}

module.exports = UserDTO;
