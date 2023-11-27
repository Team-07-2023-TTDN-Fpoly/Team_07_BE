const Contract = require("../models/ContractSchema.js");
const ContractDetail = require("../models/ContractDetailSchema.js");
const Dress = require("../models/DressSchema.js");

class ContractController {
  //Tạo mới contract
  static async createContract(req, res) {
    const {
      cus_id,
      emp_id,
      createAt,
      endAt,
      total_amount,
      prepay,
      discount,
      contract_status,
      contract_description,
      contract_details, // Danh sách các chi tiết hợp đồng
    } = req.body;

    if (!cus_id) {
      return res
        .status(400)
        .json({ message: "Vui lòng chọn khách hàng cho hợp đồng!" });
    }

    // Tạo các ContractDetail
    try {
      const savedDetails = await Promise.all(
        contract_details.map((item) => {
          const contractDetail = new ContractDetail({
            dress_id: item.dress_id,
            rental_date: item.rental_date,
            return_date: item.return_date,
          });
          return contractDetail.save();
        })
      );

      // Tính toán total_amount
      const prices = await Promise.all(
        savedDetails.map(async (detail) => {
          const dress = await Dress.findById(detail.dress_id);
          return dress.dress_price; // mỗi Dress có thuộc tính dress_price
        })
      );
      const totalAmount = prices.reduce((total, price) => total + price, 0);

      // Tạo Contract mới
      const newContract = new Contract({
        cus_id: cus_id,
        emp_id: emp_id,
        contract_details: savedDetails.map((detail) => detail._id),
        createAt: createAt,
        endAt: endAt,
        total_amount: total_amount || totalAmount,
        prepay: prepay || 0,
        discount: discount || 0,
        contract_status: contract_status || "Chưa thanh toán",
        contract_description: contract_description || "",
      });

      const savedContract = await newContract.save();
      res.status(201).json({ contract: savedContract._id });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}

module.exports = ContractController;
