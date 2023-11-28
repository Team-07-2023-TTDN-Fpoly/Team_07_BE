function formatDressData(dress) {
  return {
    id: dress._id,
    dress_name: dress.dress_name,
    dress_price: dress.dress_price,
    size: dress.size,
    color: dress.color,
    dress_image: dress.dress_image,
    dress_description: dress.dress_description,
    dress_status: dress.dress_status,
    dressTypeId: {
      type_id: dress.dressTypeId._id,
      type_name: dress.dressTypeId.type_name,
    },
  };
}

module.exports = { formatDressData };
