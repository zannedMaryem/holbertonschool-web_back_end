// 5-typed_arrays.js
export default function createInt8TypedArray(length, position, value) {
  // Create a buffer of the given length
  const buffer = new ArrayBuffer(length);
  const view = new DataView(buffer);

  // Check position validity
  if (position < 0 || position >= length) {
    throw new Error('Position outside range');
  }

  // Set the value at the given position
  view.setInt8(position, value);

  // Return the DataView
  return view;
}
