import { list } from '@keystone-6/core';

import {
  text,
  relationship,
  password,
  image,
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
      sizes: relationship({ ref: 'ProductSize.products', many: true }),
      price: decimal({
        precision: 7,
        scale: 2,
        db: { map: 'product_price' },
      }),
      onSale: checkbox(),
      salePrice: decimal({
        precision: 7,
        scale: 2,
        db: { map: 'sale_price' },
      }),
    },
  }),
  ProductSize: list({
    fields: {
      type: text(),
      unit: text(),
      products: relationship({ ref: 'Product.sizes', many: true  })
    }
  })
}  
