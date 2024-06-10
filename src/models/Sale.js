import { roundToNearestHours } from "date-fns";
import { tr } from "date-fns/locale";
import mongoose from "mongoose";

const saleSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
        totalPricePerProduct: {
          type: Number,
          required: true,
          default: 0,
        },
      },
    ],
    totalSalePrice: {
      type: Number,
      required: true,
      default: 0,
    },
    totalPaid: {
      type: Number,
      required: true,
      default: 0,
    },
    amountDue: {
      type: Number,
      required: true,
      default: function() {
        return this.totalPaid - this.totalSalePrice;
      }
    },
    status: {
      type: String,
      enum: ["pending", "cancelled"],
      default: "pending",
    },
    saleDate: {
      type: Date,
      default: Date.now,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model("Sale", saleSchema);
