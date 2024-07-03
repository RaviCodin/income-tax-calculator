'use client'
import TaxCalculate from './components/taxCalculate'
import taxBanner from '../images/tax.jpg'
import Image from 'next/image'
const Home = () => {

  return (
    <div class=" md:flex  gap-1 justify-between">
      <div class="sm:w-full md:w-2/3 ">
        <TaxCalculate />
      </div>
      <div class="sm:w-full md:w-1/3  flex justify-center  m-1 px-5 pt-14 ">
        <Image
          src={taxBanner}
          alt="Example Image"
          class="w-auto h-3/4 rounded-lg"
        />
      </div>
    </div>

  );
}

export default Home