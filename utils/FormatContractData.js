const { formatEmployeeData } = require("./FormatEmployeeData.js");
const { formatDressData } = require("./FormatDressData.js");
const { formatCustomerData } = require("./FormatCustomerData.js");

function formatContractData(contract) {
  return {
    ...contract,
    cus_id: contract.cus_id ? formatCustomerData(contract.cus_id) : null,
    contract_details: contract.contract_details.map((contract_detail) => {
      return {
        ...contract_detail,
        dress_id: formatDressData(contract_detail.dress_id),
      };
    }),
    emp_id: formatEmployeeData(contract.emp_id),
    total_amount: contract.total_amount ? contract.total_amount : 0,
    prepay: contract.prepay ? contract.prepay : 0,
    discount: contract.discount ? contract.discount : 0,
  };
}

module.exports = { formatContractData };
