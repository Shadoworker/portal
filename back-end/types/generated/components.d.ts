import type { Schema, Attribute } from '@strapi/strapi';

export interface ComponentsFilter extends Schema.Component {
  collectionName: 'components_components_filters';
  info: {
    displayName: 'filter';
    icon: 'filter';
    description: '';
  };
  attributes: {
    name: Attribute.Enumeration<['classic', 'trending', 'fun']>;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'components.filter': ComponentsFilter;
    }
  }
}
