import { list } from '@keystone-6/core';

import {
  text,
  relationship,
  password,
  image,
  decimal,
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
      price: relationship({
        ref: 'VariantPrice',
        many: true,
      })
   },
  }),
  Variant: list({
    fields: {
      name: text()
    },
  }),
  ProductVariant: list({
    fields: {
      variant: relationship({
        ref: 'Variant',
        many: false,
      }),
      value: text({isIndexed: 'unique'})
    },
  }),
  VariantPrice: list({
    fields: {
      variant: relationship({
        ref: 'ProductVariant',
        many: false,
      }),
      price: decimal({
        precision: 7,
        scale: 2,
      }),
    }
  })
}  
