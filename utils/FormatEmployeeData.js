function formatEmployeeData(auth) {
  const employeeData =
    auth.emp_id && auth.emp_id._doc ? auth.emp_id._doc : auth.emp_id || {};
  return {
    emp_name: employeeData.emp_name,
    emp_phone: employeeData.emp_phone,
    emp_address: employeeData.emp_address,
    emp_birthday: employeeData.emp_birthday,
    role: employeeData.role,
    join_date: employeeData.join_date,
    basic_salary: employeeData.basic_salary,
    workShift: employeeData.workShiftId
      ? {
          shift_id: employeeData.workShiftId._id,
          name: employeeData.workShiftId.name,
          timeStart: employeeData.workShiftId.timeStart,
          timeEnd: employeeData.workShiftId.timeEnd,
          shift_description: employeeData.workShiftId.shift_description,
        }
      : {},
    auth_id: auth._id,
    emp_id: auth.emp_id ? auth.emp_id._id : null,
    email: auth.email, // Email từ Authentication
    is_disable: auth.is_disable, // Trạng thái từ Authentication
  };
}

module.exports = { formatEmployeeData };
