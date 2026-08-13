import { list } from "@keystone-6/core";
import fs from "node:fs";
import path from "node:path";

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
        validation: {
          isRequired: true,
          match: {
            regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            explanation: "Please provide a valid email address.",
          },
        },
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

      productImage: image({
        storage: {
          async put(key, stream) {
            const imageDirectory = path.resolve(process.cwd(), "public/images");

            await fs.promises.mkdir(imageDirectory, {
              recursive: true,
            });

            const filePath = path.join(imageDirectory, key);

            await new Promise<void>((resolve, reject) => {
              const writeStream = fs.createWriteStream(filePath);

              stream.pipe(writeStream);

              writeStream.on("finish", resolve);
              writeStream.on("error", reject);
              stream.on("error", reject);
            });
          },

          async delete(key) {
            const imageDirectory = path.resolve(process.cwd(), "public/images");

            const filePath = path.join(imageDirectory, key);

            await fs.promises.unlink(filePath).catch(() => {});
          },

          url(key) {
            const baseUrl = process.env.BACKEND_URL || "http://localhost:5000";

            return `${baseUrl.replace(/\/$/, "")}/images/${encodeURIComponent(key)}`;
          },
        },
      }),
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
    hooks: {
      validateInput: ({ addValidationError, resolvedData, item }) => {
        const start =
          resolvedData.saleStart !== undefined
            ? resolvedData.saleStart
            : item?.saleStart;
        const end =
          resolvedData.saleEnd !== undefined
            ? resolvedData.saleEnd
            : item?.saleEnd;
        const saleStatus =
          resolvedData.sale !== undefined ? resolvedData.sale : item?.sale;

        // 1. Ensure end date is not before start date
        if (start && end) {
          if (new Date(end) < new Date(start)) {
            addValidationError(
              "The sale end date cannot be before the sale start date.",
            );
          }
        }

        // 2. Ensure dates are provided if a sale is enabled
        if (saleStatus === "enable") {
          if (!start || !end) {
            addValidationError(
              "Both a sale start date and sale end date are required when the sale status is set to Enable.",
            );
          }
        }
      },
    },
  }),

  Variant: list({
    access: allowAll,
    fields: {
      name: text({ validation: { isRequired: true } }),
    },
  }),

  ProductVariant: list({
    access: allowAll,
    fields: {
      variant: relationship({
        ref: "Variant",
        many: false,
      }),
      value: text({
        validation: { isRequired: true },
        isIndexed: "unique",
      }),
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
        validation: { isRequired: true },
        precision: 7,
        scale: 2,
        hooks: {
          validateInput: ({ addValidationError, resolvedData, fieldKey }) => {
            const price = resolvedData[fieldKey];
            if (price !== undefined && price !== null && Number(price) < 0) {
              addValidationError("Price cannot be negative.");
            }
          },
        },
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
