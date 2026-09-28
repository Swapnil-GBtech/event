import { Schema } from "mongoose";
const EnquirySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    validate: {
      validator: function (v) {
        return /\d{10}/.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
});

export const Enquiry = mongoose.model("Enquiry", EnquirySchema);
