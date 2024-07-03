export const newComputeTotalIncome = (salary, rentalIncome, otherIncome) => {
    return Number(salary)  + Number(rentalIncome) + Number(otherIncome);
};

export const newComputeDeductions = (section80C, section80D, hra, otherDeductions) => {

    const totalDeductions = Number(section80C) + Number(section80D) + Number(hra) + Number(otherDeductions);
    const max80C = 50000; // Max limit for Section 80C
    return Math.min(totalDeductions, max80C);
};

export const newComputeTax = (taxableIncome) => {
    const num = Number(taxableIncome)

    let tax = 0;
    if (num <= 700000) {
        return tax;
    }
    else if (num <= 900000) {
        console.log(300000 * 0.05 + (num - 600000) * 0.10)
        tax = 300000 * 0.05 + (num - 600000) * 0.10;
    }
    else if (num <= 1200000) {
        console.log('num <= 1200000')
        tax = 300000 * 0.05 + 300000 * 0.10 + (num - 900000) * 0.15;
    }
    else if (num <= 1500000) {
        tax = 300000 * 0.05 + 300000 * 0.10 + 300000 * 0.15 + (num - 1200000) * 0.20;
    }
    else {
        tax = 300000 * 0.05 + 300000 * 0.1 + 300000 * 0.15 + 300000 * 0.20 + (num - 1500000) * 0.30;
    }
    tax += tax * 0.04
    return tax;
};
