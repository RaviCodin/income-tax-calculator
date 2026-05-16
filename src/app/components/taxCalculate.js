'use client'

import { newComputeDeductions, newComputeTax, newComputeTotalIncome } from "../tax/newRegimeCompute";
import { oldComputeDeductions, oldComputeTax, oldComputeTotalIncome } from "../tax/oldRegimeCompute";
import { useEffect, useState } from "react";

const sanitizePdfText = (value) => String(value ?? '').replace(/[^\x20-\x7E]/g, ' ');

const escapePdfText = (value) => sanitizePdfText(value).replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');

const createPdfDocument = (lines) => {
    let contentStream = `BT\n/F1 18 Tf\n50 760 Td\n(${escapePdfText(lines[0])}) Tj\n/F1 11 Tf\n`;

    lines.slice(1).forEach((line) => {
      contentStream += `0 -16 Td\n(${escapePdfText(line)}) Tj\n`;
    });

    contentStream += 'ET';

    const objects = [
      '<< /Type /Catalog /Pages 2 0 R >>',
      '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
      '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>',
      '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
      `<< /Length ${contentStream.length} >>\nstream\n${contentStream}\nendstream`,
    ];

    let pdf = '%PDF-1.4\n';
    const offsets = [0];

    objects.forEach((object, index) => {
      offsets.push(pdf.length);
      pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
    });

    const xrefOffset = pdf.length;
    pdf += `xref\n0 ${objects.length + 1}\n`;
    pdf += '0000000000 65535 f \n';

    offsets.slice(1).forEach((offset) => {
      pdf += `${String(offset).padStart(10, '0')} 00000 n \n`;
    });

    pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

    return pdf;
};

const TaxCalculate = () => {
    const [salary, setSalary] = useState(0)
    const [rentalIncome, setRentalIncome] = useState(0)
    const [otherIncome, setOtherIncome] = useState(0)
  
  
    const [section80C, setSection80C] = useState(0)
    const [section80D, setSection80D] = useState(0)
    const [hra, setHra] = useState(0)
    const [otherDeductions, setOtherDeductions] = useState(0)
  
    const [taxPayable, setTaxPayable] = useState(0)
    const [newTaxPayable, setNewTaxPayable] = useState(0)
    const [calculationDetails, setCalculationDetails] = useState(null)
    const [financeYear, setFinanceYear] = useState('');
    const [age, setAge] = useState('');
  
  
    useEffect(() => {
      // Sample data
  
  
  
      // console.log(`..... \n\n Total Income: ₹${totalIncome}`);
      // console.log(`Total Deductions: ₹${totalDeductions}`);
      // console.log(`Taxable Income: ₹${taxableIncome}`);
      // console.log(`Old Tax Payable: ₹${taxPayable}`);
  
      // console.log(`\n\nNewTaxable Income: ₹${newTaxableIncome}`);
      // console.log(`New Tax Payable: ₹${newTaxPayable}`);
  
  
  
    }, [taxPayable, newTaxPayable])
  
    const handleAmountChange = (setter) => (event) => {
      setter(event.target.value)
      setCalculationDetails(null)
    };

    const formatAmount = (amount) => {
      const number = Number(amount);

      if (!Number.isFinite(number)) {
        return '0';
      }

      return number.toLocaleString('en-IN', { maximumFractionDigits: 2 });
    };

    const isCalculationValidForPdf = () => {
      const numericValues = [salary, rentalIncome, otherIncome, section80C, section80D, hra, otherDeductions];

      return Boolean(financeYear && age)
        && numericValues.every((value) => value !== '' && Number.isFinite(Number(value)) && Number(value) >= 0)
        && numericValues.some((value) => Number(value) > 0);
    };
  
    const getTaxHandle = () => {
      const totalIncome = oldComputeTotalIncome(salary, rentalIncome, otherIncome);
      const totalDeductions = oldComputeDeductions(section80C, section80D, hra, otherDeductions);
      const taxableIncome = totalIncome - totalDeductions;
      const taxPayable = oldComputeTax(taxableIncome);
      setTaxPayable(taxPayable)
  
  
      // const newTotalIncome = oldComputeTotalIncome(salary, investments, rentalIncome, otherIncome);
      const newTotalDeductions = newComputeDeductions(section80C, section80D, hra, otherDeductions);
      const newTaxableIncome = totalIncome - newTotalDeductions;
      const newTaxPayable = newComputeTax(newTaxableIncome);
      setNewTaxPayable(newTaxPayable)
  
      if (isCalculationValidForPdf()) {
        setCalculationDetails({
          financeYear,
          age,
          salary,
          rentalIncome,
          otherIncome,
          section80C,
          section80D,
          hra,
          otherDeductions,
          totalIncome,
          totalDeductions,
          taxableIncome,
          taxPayable,
          newTotalDeductions,
          newTaxableIncome,
          newTaxPayable,
        })
      } else {
        setCalculationDetails(null)
      }
  
      console.log(`\n\nNewTaxable Income: ₹${newTaxableIncome}`);
  
  
    }
  
    const downloadPdfHandle = () => {
      if (!calculationDetails) {
        return;
      }

      const generatedOn = new Date().toLocaleString();
      const pdfLines = [
        'Income Tax Calculation Summary',
        `Generated on: ${generatedOn}`,
        '',
        'Input Details',
        `Financial Year: ${calculationDetails.financeYear}`,
        `Age: ${calculationDetails.age}`,
        `Income from Salary: Rs. ${formatAmount(calculationDetails.salary)}`,
        `Rental Income: Rs. ${formatAmount(calculationDetails.rentalIncome)}`,
        `Other Income: Rs. ${formatAmount(calculationDetails.otherIncome)}`,
        `Total Income: Rs. ${formatAmount(calculationDetails.totalIncome)}`,
        '',
        'Deductions / Exemptions Entered',
        `Section 80C: Rs. ${formatAmount(calculationDetails.section80C)}`,
        `Section 80D: Rs. ${formatAmount(calculationDetails.section80D)}`,
        `HRA: Rs. ${formatAmount(calculationDetails.hra)}`,
        `Other Deductions: Rs. ${formatAmount(calculationDetails.otherDeductions)}`,
        '',
        'Old Regime Result',
        `Total Deductions: Rs. ${formatAmount(calculationDetails.totalDeductions)}`,
        `Taxable Income: Rs. ${formatAmount(calculationDetails.taxableIncome)}`,
        `Final Tax Payable: Rs. ${formatAmount(calculationDetails.taxPayable)}`,
        '',
        'New Regime Result',
        `Total Deductions: Rs. ${formatAmount(calculationDetails.newTotalDeductions)}`,
        `Taxable Income: Rs. ${formatAmount(calculationDetails.newTaxableIncome)}`,
        `Final Tax Payable: Rs. ${formatAmount(calculationDetails.newTaxPayable)}`,
      ];
      const pdfContent = createPdfDocument(pdfLines);
      const blob = new Blob([pdfContent], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = url;
      link.download = 'income-tax-calculation.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    };
  
    const handleFinanceYearChange = (event) => {
      const year = event.target.value;
      setFinanceYear(year);
      setCalculationDetails(null)
  
    };
  
    const handleAgeChange = (event) => {
      const age = event.target.value;
      setAge(age);
      setCalculationDetails(null)
  
    };
  
  
  return (
    <div>
        <div class="m-8 " >
      <h1 class="text-2xl  font-bold text-blue-400">Income Tax Calculator</h1>

      <div class="border border-blue-100  p-4 mt-5 rounded">
        {/* <h1 class="bg-gray-50  p-2 text-center ">Income </h1> */}

        <div class="pt-4 flex-col align-middle  flex-wrap">

          <div class="flex-col gap-2">
            <p class="text-left">Which Financial Year do you want to calculate taxes for?</p>

            <div class="pt-1">
              <label class="inline-flex items-center">
                <input
                  type="radio"
                  name="year"
                  value="2023-24"
                  checked={financeYear === '2023-24'}
                  onChange={handleFinanceYearChange}
                  class="form-radio"
                />
                <span class="ml-2">2023-24</span>
              </label>
              <label class="inline-flex items-center ml-6">
                <input
                  type="radio"
                  name="year"
                  value="2024-25"
                  checked={financeYear === '2024-25'}
                  onChange={handleFinanceYearChange}
                  class="form-radio"
                />
                <span class="ml-2">2024-25</span>
              </label>
            </div>

          </div>

          <div class="flex-col gap-2 mt-5">
            <p class="text-left">Your Age?</p>

            <div class="pt-1">
              <label class="inline-flex items-center">
                <input
                  type="radio"
                  name="age"
                  value="0-60"
                  checked={age === '0-60'}
                  onChange={handleAgeChange}
                  class="form-radio"
                />
                <span class="ml-2">0-60</span>
              </label>

              {/* <label class="inline-flex items-center ml-6">
                <input
                  type="radio"
                  name="age"
                  value="60-80"
                  checked={age === '60-80'}
                  onChange={handleAgeChange}
                  class="form-radio"
                />
                <span class="ml-2">60-80</span>
              </label>

              <label class="inline-flex items-center ml-6">
                <input
                  type="radio"
                  name="age"
                  value="80-above"
                  checked={age === '80-above'}
                  onChange={handleAgeChange}
                  class="form-radio"
                />
                <span class="ml-2">80-above</span>
              </label> */}
            </div>

          </div>

          



        </div>

      </div>

      <div class="border border-blue-100  p-4 mt-5 rounded">
        <h1 class="bg-blue-50  p-2 px-3 text-blue-600 rounded ">Income </h1>

        <div class="pt-4 flex align-middle gap-5 flex-wrap">

          <div class="flex-col gap-2">
            <p class="text-left">Income from Salary </p>
            <input type="number" class="w-40 p-2 border border-blue-200 rounded focus:outline-blue-700" placeholder="Enter Amount Rs" value={salary} onChange={handleAmountChange(setSalary)} />
          </div>

          <div class="flex-col gap-2">
            <p class="text-left"> Rental Income </p>
            <input type="number" class="w-40 p-2 border border-blue-200 rounded focus:outline-blue-700" placeholder="Enter Amount Rs" value={rentalIncome} onChange={handleAmountChange(setRentalIncome)} />
          </div>

          <div class="flex-col gap-2">
            <p class="text-left">Other Income</p>
            <input type="number" class="w-40 p-2 border border-blue-200 rounded focus:outline-blue-700" placeholder="Enter Amount Rs" value={otherIncome} onChange={handleAmountChange(setOtherIncome)} />
          </div>


        </div>

      </div>

      <div class="border border-blue-100  p-4 mt-5 rounded">
        <h1 class="bg-blue-50  p-2 px-3 text-blue-600 rounded ">Deductions </h1>

        <div class="pt-4 flex align-middle gap-5 flex-wrap">

          <div class="flex-col gap-2">
            <p class="text-left">Section 80C </p>
            <input type="number" class=" w-40 p-2 border border-blue-200 rounded focus:outline-blue-700" placeholder="Enter Amount Rs" value={section80C} onChange={handleAmountChange(setSection80C)} />
          </div>

          <div class="flex-col gap-2">
            <p class="text-left"> Section 80D </p>
            <input type="number" class="w-40 p-2 border border-blue-200 rounded focus:outline-blue-700" placeholder="Enter Amount Rs" value={section80D} onChange={handleAmountChange(setSection80D)} />
          </div>

          <div class="flex-col gap-2">
            <p class="text-left">HRA</p>
            <input type="number" class="w-40 p-2 border border-blue-200 rounded focus:outline-blue-700" placeholder="Enter Amount Rs" value={hra} onChange={handleAmountChange(setHra)} />
          </div>


          <div class="flex-col gap-2">
            <p class="text-left">Other Deductions</p>
            <input type="number" class="w-40 p-2 border border-blue-200 rounded focus:outline-blue-700" placeholder="Enter Amount Rs" value={otherDeductions} onChange={handleAmountChange(setOtherDeductions)} />
          </div>


        </div>

      </div>


      <div class="border border-blue-100  p-4 mt-5 rounded">
        <h1 class="bg-blue-50  p-2 px-3 text-blue-400 rounded">Income Tax </h1>

        <div class="pt-4 flex align-middle gap-5 flex-wrap">

          <div class="flex-col gap-2">
            <p class="text-left">Old Regime</p>
            <h1 class=" bg-blue-50 p-2 text-center w-40 rounded">{taxPayable ? taxPayable : 0}</h1>

          </div>

          <div class="flex-col gap-2">
            <p class="text-left"> New Regime</p>
            <h1 class=" bg-blue-50 p-2 text-center w-40 rounded">{newTaxPayable ? newTaxPayable : 0}</h1>
          </div>

          <button class=" mt-3 h-10 bg-blue-600 text-white p-2 rounded shadow-lg shadow-blue-400/100 hover:shadow-none transition duration-0.5 ease-in-out" onClick={getTaxHandle}>Calculate</button>

          {calculationDetails && (
            <button class=" mt-3 h-10 bg-green-600 text-white p-2 rounded shadow-lg shadow-green-400/100 hover:shadow-none transition duration-0.5 ease-in-out" onClick={downloadPdfHandle}>Download PDF</button>
          )}


        </div>

      </div>
    </div>
    </div>
  )
}

export default TaxCalculate