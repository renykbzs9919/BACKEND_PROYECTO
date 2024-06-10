import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  celular: {
    type: String,
    required: true,
    trim: true
  },
  ubicacion_puesto: {
    type: String,
    required: true,
    trim: true
  },
  ciudad: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true,
  versionKey: false,
});

export default mongoose.model('Client', clientSchema);
