const Contract = require("../models/ContractSchema.js");
const ContractDetail = require("../models/ContractDetailSchema.js");
const Dress = require("../models/DressSchema.js");
const Customer = require("../models/CustomerSchema.js");

const { formatContractData } = require("../utils/FormatContractData");
class ContractController {
  //Tạo mới contract
  static async createContract(req, res) {
    const {
      cus_id,
      auth_id,
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
        emp_id: auth_id,
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

  static async getAllContracts(req, res) {
    // const { search } = req.query;
    try {
      //search
      // let listCustomerIds = [];
      let filter = { hidden: false };

      // if (search) {
      //   const customers = await Customer.find({
      //     cus_name: { $regex: search, $options: "i" },
      //   }).select("_id"); //trả về danh sách id của customer

      //   //danh sách id employee
      //   for (let i = 0; i < customers.length; i++) {
      //     listCustomerIds.push(customers[i]._id);
      //   }
      // }
      // //Kiểm tra xem có khách hàng nào không
      // if (listCustomerIds.length > 0) {
      //   filter["cus_id"] = { $in: listCustomerIds };
      // }

      const listContract = await Contract.find(filter)
        .populate({ path: "cus_id", model: "Customer" })
        .populate({
          path: "emp_id",
          model: "Authentication",
          populate: {
            path: "emp_id",
            model: "Employee",
            populate: {
              path: "workShiftId",
              model: "WorkShift",
            },
          },
        })
        .populate({
          path: "contract_details",
          model: "ContractDetail",
          populate: {
            path: "dress_id",
            model: "Dress",
            populate: {
              path: "dressTypeId",
              model: "DressType",
            },
          },
        })
        .lean();
      const list = listContract.map((contract) => {
        return formatContractData(contract);
      });
      res.status(200).json({ data: list });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Xóa hợp đồng
  static async deleteContract(req, res) {
    try {
      const { id } = req.params;

      // Xóa hợp đồng
      const contract = await Contract.findByIdAndUpdate(
        id,
        { hidden: true },
        { new: true }
      );
      if (!contract) {
        throw new Error("Không tìm thấy hợp đồng để xóa.");
      }
      res.status(200).json({
        message: "Hợp đồng đã được xóa thành công.",
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = ContractController;
