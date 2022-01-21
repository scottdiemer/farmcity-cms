import { list } from '@keystone-6/core';

import {
  text,
  relationship,
  password,
  image,
  select,
  decimal,
  checkbox
} from '@keystone-6/core/fields';
import { document } from '@keystone-6/fields-document';
import { Lists } from '.keystone/types';

export const lists: Lists = {
  User: list({
    fields: {
      name: text({ validation: { isRequired: true } }),
      email: text({
        validation: { isRequired: true },
        isIndexed: 'unique',
        isFilterable: true,
      }),
      password: password({ validation: { isRequired: true } }),
      product: relationship({ ref: 'User', many: true})
    },
  }),
  Product: list({
    fields: {
      name: text({ validation: { isRequired: true }}),
      description: document({
        formatting: true,
        dividers: true,
        links: true,
        layouts: [
          [1, 1],
          [1, 1, 1],
        ],
      }),
      productImage: image(),
      attributes: relationship({
        ref: 'ProductAttribute',
        many: true,
        ui: {
          displayMode: 'cards',
          cardFields: ['attribute', 'value'],
          inlineCreate: {fields: ['attribute', 'value']},
          inlineEdit: {fields: ['attribute', 'value']},
        }
      }),
      price: decimal({
        precision: 7,
        scale: 2,
        db: { map: 'product_price' },
      }),
   },
  }),
  Attribute: list({
    fields: {
      name: text()
    },
  }),
  ProductAttribute: list({
    fields: {
      attribute: relationship({
        ref: 'Attribute',
      }),
      value: text({isIndexed: 'unique'})
    },
  }),
}  
  
