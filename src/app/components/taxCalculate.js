'use client'

import { newComputeDeductions, newComputeTax, newComputeTotalIncome } from "../tax/newRegimeCompute";
import { oldComputeDeductions, oldComputeTax, oldComputeTotalIncome } from "../tax/oldRegimeCompute";
import { useEffect, useState } from "react";

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
  
  
    useEffect(() => {
      // Sample data
  
  
  
      // console.log(`..... \n\n Total Income: ₹${totalIncome}`);
      // console.log(`Total Deductions: ₹${totalDeductions}`);
      // console.log(`Taxable Income: ₹${taxableIncome}`);
      // console.log(`Old Tax Payable: ₹${taxPayable}`);
  
      // console.log(`\n\nNewTaxable Income: ₹${newTaxableIncome}`);
      // console.log(`New Tax Payable: ₹${newTaxPayable}`);
  
  
  
    }, [taxPayable, newTaxPayable])
  
  
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
  
      console.log(`\n\nNewTaxable Income: ₹${newTaxableIncome}`);
  
  
    }
  
    const [financeYear, setFinanceYear] = useState('');
  
    const handleFinanceYearChange = (event) => {
      const year = event.target.value;
      setFinanceYear(year);
  
    };
  
    const [age, setAge] = useState('');
  
    const handleAgeChange = (event) => {
      const age = event.target.value;
      setAge(age);
  
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
            <input type="number" class="w-40 p-2 border border-blue-200 rounded focus:outline-blue-700" placeholder="Enter Amount Rs" value={salary} onChange={e => setSalary(e.target.value)} />
          </div>

          <div class="flex-col gap-2">
            <p class="text-left"> Rental Income </p>
            <input type="number" class="w-40 p-2 border border-blue-200 rounded focus:outline-blue-700" placeholder="Enter Amount Rs" value={rentalIncome} onChange={e => setRentalIncome(e.target.value)} />
          </div>

          <div class="flex-col gap-2">
            <p class="text-left">Other Income</p>
            <input type="number" class="w-40 p-2 border border-blue-200 rounded focus:outline-blue-700" placeholder="Enter Amount Rs" value={otherIncome} onChange={e => setOtherIncome(e.target.value)} />
          </div>


        </div>

      </div>

      <div class="border border-blue-100  p-4 mt-5 rounded">
        <h1 class="bg-blue-50  p-2 px-3 text-blue-600 rounded ">Deductions </h1>

        <div class="pt-4 flex align-middle gap-5 flex-wrap">

          <div class="flex-col gap-2">
            <p class="text-left">Section 80C </p>
            <input type="number" class=" w-40 p-2 border border-blue-200 rounded focus:outline-blue-700" placeholder="Enter Amount Rs" value={section80C} onChange={e => setSection80C(e.target.value)} />
          </div>

          <div class="flex-col gap-2">
            <p class="text-left"> Section 80D </p>
            <input type="number" class="w-40 p-2 border border-blue-200 rounded focus:outline-blue-700" placeholder="Enter Amount Rs" value={section80D} onChange={e => setSection80D(e.target.value)} />
          </div>

          <div class="flex-col gap-2">
            <p class="text-left">HRA</p>
            <input type="number" class="w-40 p-2 border border-blue-200 rounded focus:outline-blue-700" placeholder="Enter Amount Rs" value={hra} onChange={e => setHra(e.target.value)} />
          </div>


          <div class="flex-col gap-2">
            <p class="text-left">Other Deductions</p>
            <input type="number" class="w-40 p-2 border border-blue-200 rounded focus:outline-blue-700" placeholder="Enter Amount Rs" value={otherDeductions} onChange={e => setOtherDeductions(e.target.value)} />
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


        </div>

      </div>
    </div>
    </div>
  )
}

export default TaxCalculate