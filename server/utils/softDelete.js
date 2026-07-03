export const softDelete = (doc, { now = new Date() } = {}) => {
  if (!doc) return null;
  doc.isDeleted = true;
  doc.deletedAt = now;
  return doc;
};

