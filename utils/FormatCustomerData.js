function formatCustomerData(customer) {
  return {
    cus_id: customer._id,
    cus_name: customer.cus_name,
    cus_phone: customer.cus_phone,
    cus_phoneSecond: customer.cus_phoneSecond,
    cus_email: customer.cus_email,
    cus_wedding_date: customer.cus_wedding_date,
    cus_address: customer.cus_address,
  };
}

module.exports = { formatCustomerData };
