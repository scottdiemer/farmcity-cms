import { list } from "@keystone-6/core";
const allowAll = {
  operation: {
    query: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
};

import {
  text,
  relationship,
  password,
  image,
  decimal,
  select,
  timestamp,
} from "@keystone-6/core/fields";
import { document } from "@keystone-6/fields-document";
import { Lists } from ".keystone/types";

export const lists: Lists = {
  User: list({
    access: allowAll,
    fields: {
      name: text({ validation: { isRequired: true } }),
      email: text({
        validation: { isRequired: true },
        isIndexed: "unique",
        isFilterable: true,
      }),
      password: password({ validation: { isRequired: true } }),
    },
  }),
  Product: list({
    access: allowAll,
    fields: {
      name: text({ validation: { isRequired: true } }),
      manufacturer: relationship({
        ref: "Manufacturer",
        many: false,
        ui: { displayMode: "select" },
      }),
      summary: text({
        validation: { isRequired: true },
        ui: { displayMode: "textarea" },
      }),
      description: document({
        formatting: true,
        dividers: true,
        links: true,
        layouts: [
          [1, 1],
          [1, 1, 1],
        ],
      }),
      status: select({
        options: [
          { label: "Draft", value: "draft" },
          { label: "Enable", value: "enable" },
          { label: "Disable", value: "disable" },
        ],
        defaultValue: "draft",
        ui: { displayMode: "segmented-control" },
      }),
      productImage: image({ storage: "local_images" }),
      prices: relationship({
        ref: "VariantPrice",
        many: true,
        ui: {
          displayMode: "cards",
          cardFields: ["variant", "price"],
          linkToItem: true,
          inlineCreate: { fields: ["variant", "price"] },
          inlineEdit: { fields: ["variant", "price"] },
          inlineConnect: true,
        },
      }),
      sale: select({
        options: [
          { label: "Draft", value: "draft" },
          { label: "Enable", value: "enable" },
          { label: "Disable", value: "disable" },
        ],
        defaultValue: "draft",
        ui: { displayMode: "segmented-control" },
      }),
      saleStart: timestamp(),
      saleEnd: timestamp(),
      salePrices: relationship({
        ref: "VariantPrice",
        many: true,
        ui: {
          displayMode: "cards",
          cardFields: ["variant", "price"],
          linkToItem: true,
          inlineCreate: { fields: ["variant", "price"] },
          inlineEdit: { fields: ["variant", "price"] },
          inlineConnect: true,
        },
      }),
    },
  }),
  Variant: list({
    access: allowAll,
    fields: {
      name: text(),
    },
  }),
  ProductVariant: list({
    access: allowAll,
    fields: {
      variant: relationship({
        ref: "Variant",
        many: false,
      }),
      value: text({ isIndexed: "unique" }),
    },
    ui: {
      labelField: "value",
      listView: {
        initialColumns: ["variant", "value"],
      },
    },
  }),
  VariantPrice: list({
    access: allowAll,
    fields: {
      variant: relationship({
        ref: "ProductVariant",
        many: false,
      }),
      price: decimal({
        precision: 7,
        scale: 2,
      }),
    },
    ui: {
      labelField: "price",
      listView: {
        initialColumns: ["variant", "price"],
      },
    },
  }),
  Manufacturer: list({
    access: allowAll,
    fields: {
      name: text({ validation: { isRequired: true } }),
    },
  }),
};
