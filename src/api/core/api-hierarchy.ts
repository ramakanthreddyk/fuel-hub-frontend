/**
 * @file api-hierarchy.ts
 * @description Utility functions for handling API hierarchy relationships
 */

/**
 * Hierarchy relationship between entities
 */
export const EntityHierarchy = {
  // Station is the top-level entity
  STATION: 'station',
  // Pump belongs to a station
  PUMP: 'pump',
  // Nozzle belongs to a pump
  NOZZLE: 'nozzle',
  // Reading belongs to a nozzle
  READING: 'reading',
  // Fuel price belongs to a station
  FUEL_PRICE: 'fuelPrice'
};

/**
 * Relationship map between entities
 */
export const EntityRelationships = {
  [EntityHierarchy.PUMP]: {
    parent: EntityHierarchy.STATION,
    parentIdField: 'stationId'
  },
  [EntityHierarchy.NOZZLE]: {
    parent: EntityHierarchy.PUMP,
    parentIdField: 'pumpId',
    grandparent: EntityHierarchy.STATION,
    grandparentIdField: 'stationId'
  },
  [EntityHierarchy.READING]: {
    parent: EntityHierarchy.NOZZLE,
    parentIdField: 'nozzleId'
  },
  [EntityHierarchy.FUEL_PRICE]: {
    parent: EntityHierarchy.STATION,
    parentIdField: 'stationId'
  }
};

/**
 * Get parent entity ID from child entity
 * @param entity Child entity
 * @param childType Child entity type
 * @returns Parent entity ID
 */
export function getParentId(entity: any, childType: string): string | undefined {
  const relationship = EntityRelationships[childType];
  if (!relationship) return undefined;
  
  const parentIdField = relationship.parentIdField;
  return entity[parentIdField];
}

/**
 * Get grandparent entity ID from child entity
 * @param entity Child entity
 * @param childType Child entity type
 * @returns Grandparent entity ID
 */
export function getGrandparentId(entity: any, childType: string): string | undefined {
  const relationship = EntityRelationships[childType];
  if (!relationship || !relationship.grandparentIdField) return undefined;
  
  const grandparentIdField = relationship.grandparentIdField;
  return entity[grandparentIdField];
}

/**
 * Check if entity has valid parent
 * @param entity Entity to check
 * @param childType Child entity type
 * @returns True if entity has valid parent
 */
export function hasValidParent(entity: any, childType: string): boolean {
  const parentId = getParentId(entity, childType);
  return !!parentId;
}

/**
 * Get entity path for API calls
 * @param entityType Entity type
 * @param entityId Entity ID
 * @param parentId Optional parent ID
 * @returns API path
 */
export function getEntityPath(entityType: string, entityId?: string, parentId?: string): string {
  const relationship = EntityRelationships[entityType];
  
  if (!relationship) {
    // Base entity (e.g., station)
    return entityId ? `/${entityType}s/${entityId}` : `/${entityType}s`;
  }
  
  const parentType = relationship.parent;
  
  if (parentId) {
    // If parent ID is provided, use nested path
    return entityId 
      ? `/${parentType}s/${parentId}/${entityType}s/${entityId}`
      : `/${parentType}s/${parentId}/${entityType}s`;
  }
  
  // Otherwise use flat path
  return entityId ? `/${entityType}s/${entityId}` : `/${entityType}s`;
}