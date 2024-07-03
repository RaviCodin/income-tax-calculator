export const oldComputeTotalIncome  = (salary, rentalIncome, otherIncome) => {
  console.log(salary)

  return Number(salary)  + Number(rentalIncome) + Number(otherIncome);
};

export const oldComputeDeductions = (section80C, section80D, hra, otherDeductions) => {
  // console.log("computeDeductions")

  const totalDeductions =  Number(section80C) + Number(section80D) + Number(hra) + Number(otherDeductions);
  const max80C = 300000; // Max limit for Section 80C
  return Math.min(totalDeductions, max80C);
};

export const oldComputeTax =(taxableIncome) => {
  // console.log("computeTax")
  const num = Number(taxableIncome)

  let tax = 0;
  if (num <= 500000) {
    return tax;
  }
  else if (num <= 1000000) {
    tax = 250000 * 0.05 + (num - 500000) * 0.2;
  } else {
    tax = 250000 * 0.05 + 500000 * 0.2 + (num - 1000000) * 0.3;
  }
  tax += tax * 0.04
  return tax;
};
